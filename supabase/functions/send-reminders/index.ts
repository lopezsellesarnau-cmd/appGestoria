// Supabase Edge Function: send-reminders
// Corre a diario (pg_cron). Envía recordatorios de seguimientos pendientes
// vía Brevo y actualiza el estado tras 3 recordatorios.
//
// Variables de entorno necesarias (Supabase → Edge Functions → Secrets):
//   SUPABASE_URL              (inyectada automáticamente)
//   SUPABASE_SERVICE_ROLE_KEY (inyectada automáticamente)
//   BREVO_API_KEY             (tu clave de API de Brevo)
//   SENDER_EMAIL              (remitente verificado en Brevo)
//   SENDER_NAME               (nombre del remitente, p. ej. "Fincas Pro")

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MAX_REMINDERS = 3;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

interface TrackingRow {
  id: string;
  external_ref: string;
  status: string;
  last_response_at: string | null;
  reminder_count: number;
  created_at: string;
  tracking_types: { name: string; threshold_days: number } | null;
  contacts: { name: string; email: string } | null;
  communities: { name: string } | null;
}

function daysSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / MS_PER_DAY;
}

async function sendBrevoEmail(params: {
  toEmail: string;
  toName: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = Deno.env.get("BREVO_API_KEY");
  const senderEmail = Deno.env.get("SENDER_EMAIL");
  const senderName = Deno.env.get("SENDER_NAME") ?? "Fincas Pro";
  if (!apiKey || !senderEmail) {
    return { ok: false, error: "Faltan BREVO_API_KEY o SENDER_EMAIL" };
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: params.toEmail, name: params.toName }],
      subject: params.subject,
      htmlContent: params.html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: `Brevo ${res.status}: ${text}` };
  }
  return { ok: true };
}

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data, error } = await supabase
    .from("trackings")
    .select(
      "id, external_ref, status, last_response_at, reminder_count, created_at, " +
        "tracking_types(name, threshold_days), contacts(name, email), communities(name)",
    )
    .eq("status", "pending");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const trackings = (data ?? []) as unknown as TrackingRow[];
  let sent = 0;
  let markedOverdue = 0;
  const errors: string[] = [];

  for (const t of trackings) {
    const threshold = t.tracking_types?.threshold_days;
    if (!threshold) continue;

    // Referencia: última respuesta o, si nunca respondió, la creación.
    const reference = t.last_response_at ?? t.created_at;
    const elapsed = daysSince(reference);

    // El próximo recordatorio vence a umbral × (recordatorios+1).
    const dueAt = threshold * (t.reminder_count + 1);
    if (elapsed < dueAt) continue;

    // Ya se enviaron el máximo de recordatorios → marcar vencido.
    if (t.reminder_count >= MAX_REMINDERS) {
      await supabase.from("trackings").update({ status: "overdue" }).eq("id", t.id);
      await supabase.from("tracking_events").insert({
        tracking_id: t.id,
        event_type: "status_changed",
        description: "Marcado como vencido tras 3 recordatorios sin respuesta",
      });
      markedOverdue++;
      continue;
    }

    const contact = t.contacts;
    if (!contact?.email) {
      errors.push(`${t.external_ref}: sin email de contacto`);
      continue;
    }

    const subject = `Recordatorio: ${t.external_ref}`;
    const html = `
      <p>Hola ${contact.name},</p>
      <p>Te recordamos que seguimos a la espera de respuesta sobre
      <strong>${t.external_ref}</strong>${
      t.communities?.name ? ` (${t.communities.name})` : ""
    }.</p>
      <p>Gracias por tu atención.</p>
      <p>— ${Deno.env.get("SENDER_NAME") ?? "Fincas Pro"}</p>
    `;

    const result = await sendBrevoEmail({
      toEmail: contact.email,
      toName: contact.name,
      subject,
      html,
    });

    // Registrar el email (enviado o fallido).
    await supabase.from("sent_emails").insert({
      tracking_id: t.id,
      to_email: contact.email,
      subject,
      body_html: html,
      status: result.ok ? "sent" : "failed",
      error_message: result.ok ? null : result.error,
    });

    if (!result.ok) {
      errors.push(`${t.external_ref}: ${result.error}`);
      continue;
    }

    // Incrementar contador y dejar traza en el historial.
    await supabase
      .from("trackings")
      .update({ reminder_count: t.reminder_count + 1 })
      .eq("id", t.id);
    await supabase.from("tracking_events").insert({
      tracking_id: t.id,
      event_type: "reminder_sent",
      description: `Recordatorio ${t.reminder_count + 1} enviado a ${contact.email}`,
    });
    sent++;
  }

  return new Response(
    JSON.stringify({ processed: trackings.length, sent, markedOverdue, errors }),
    { headers: { "Content-Type": "application/json" } },
  );
});

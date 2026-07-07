import { notFound } from "next/navigation";
import { MainContent } from "@/components/layout/main-content";
import { Badge } from "@/components/ui/badge";
import { TrackingDetailActions } from "@/components/incidencias/tracking-detail-actions";
import {
  getTracking,
  getTrackingTypes,
  getContact,
  getContacts,
  getCommunity,
  getCommunities,
  getTrackingEvents,
  getSentEmails,
} from "@/lib/db";
import {
  TRACKING_STATUS_LABELS,
  TRACKING_EVENT_LABELS,
  EMAIL_STATUS_LABELS,
} from "@/types/incidencias";
import { formatDate } from "@/lib/utils";

interface IncidenciaDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function IncidenciaDetailPage({
  params,
}: IncidenciaDetailPageProps) {
  const { id } = await params;

  const tracking = await getTracking(id);
  if (!tracking) notFound();

  const [trackingTypes, contact, community, events, emails, contacts, communities] =
    await Promise.all([
      getTrackingTypes(),
      getContact(tracking.contactId),
      getCommunity(tracking.communityId),
      getTrackingEvents(id),
      getSentEmails(id),
      getContacts(),
      getCommunities(),
    ]);

  const typeName =
    trackingTypes.find((t) => t.id === tracking.trackingTypeId)?.name ?? "—";

  return (
    <MainContent title={`Incidencia · ${tracking.externalRef}`}>
      <div className="space-y-5">
        {/* Resumen */}
        <div
          className="rounded-lg border p-4"
          style={{ borderColor: "var(--border)", backgroundColor: "#ffffff" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Tipo: </span>
                {typeName}
              </div>
              <div>
                <span className="text-muted-foreground">Comunidad: </span>
                {community?.name ?? "—"}
              </div>
              <div>
                <span className="text-muted-foreground">Contacto: </span>
                {contact ? `${contact.name} (${contact.email})` : "—"}
              </div>
              <div>
                <span className="text-muted-foreground">Recordatorios: </span>
                {tracking.reminderCount}
              </div>
              <div>
                <span className="text-muted-foreground">Última respuesta: </span>
                {tracking.lastResponseAt
                  ? formatDate(tracking.lastResponseAt)
                  : "—"}
              </div>
              <div>
                <span className="text-muted-foreground">Creada: </span>
                {formatDate(tracking.createdAt)}
              </div>
            </div>
            <Badge>{TRACKING_STATUS_LABELS[tracking.status]}</Badge>
          </div>
          {tracking.notes && (
            <p className="mt-3 text-sm text-muted-foreground">
              {tracking.notes}
            </p>
          )}
        </div>

        {/* Acciones */}
        <TrackingDetailActions
          tracking={{
            id: tracking.id,
            externalRef: tracking.externalRef,
            trackingTypeId: tracking.trackingTypeId,
            contactId: tracking.contactId,
            communityId: tracking.communityId,
            notes: tracking.notes,
          }}
          status={tracking.status}
          trackingTypes={trackingTypes.map((t) => ({ id: t.id, name: t.name }))}
          contacts={contacts.map((c) => ({ id: c.id, name: c.name }))}
          communities={communities.map((c) => ({ id: c.id, name: c.name }))}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Historial */}
          <section
            className="rounded-lg border p-4"
            style={{ borderColor: "var(--border)", backgroundColor: "#ffffff" }}
          >
            <h2 className="mb-3 font-semibold" style={{ color: "#1a1a2e" }}>
              Historial
            </h2>
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin eventos.</p>
            ) : (
              <ul className="space-y-3">
                {events.map((e) => (
                  <li key={e.id} className="flex gap-3 text-sm">
                    <span
                      className="mt-1 h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: "#1e3648" }}
                    />
                    <div>
                      <div className="font-medium">
                        {TRACKING_EVENT_LABELS[e.eventType]}
                      </div>
                      {e.description && (
                        <div className="text-muted-foreground">
                          {e.description}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {formatDate(e.createdAt)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Emails enviados */}
          <section
            className="rounded-lg border p-4"
            style={{ borderColor: "var(--border)", backgroundColor: "#ffffff" }}
          >
            <h2 className="mb-3 font-semibold" style={{ color: "#1a1a2e" }}>
              Emails enviados
            </h2>
            {emails.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aún no se ha enviado ningún email.
              </p>
            ) : (
              <ul className="space-y-3">
                {emails.map((m) => (
                  <li key={m.id} className="text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{m.subject}</span>
                      <Badge
                        variant={
                          m.status === "sent"
                            ? "success"
                            : m.status === "bounced"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {EMAIL_STATUS_LABELS[m.status]}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground">
                      {m.toEmail} · {formatDate(m.sentAt)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </MainContent>
  );
}

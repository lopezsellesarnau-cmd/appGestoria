-- =================================================================
-- Programación diaria del scheduler de recordatorios (bloque 6)
-- =================================================================
-- Invoca la Edge Function `send-reminders` cada día a las 08:00.
--
-- REQUISITOS antes de ejecutar:
--   1) Haber desplegado la función:  supabase functions deploy send-reminders
--   2) Configurar los secretos de la función (Brevo, remitente).
--   3) Sustituir <PROJECT_REF> y <SERVICE_ROLE_KEY> abajo por los de tu
--      proyecto (Project Settings -> API).
--
-- Nota: se usa pg_cron para programar y pg_net para la llamada HTTP.
-- =================================================================

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Elimina el job anterior si ya existía (idempotente).
select cron.unschedule('send-reminders-daily')
where exists (
  select 1 from cron.job where jobname = 'send-reminders-daily'
);

select cron.schedule(
  'send-reminders-daily',
  '0 8 * * *',                       -- todos los días a las 08:00 (UTC)
  $$
  select net.http_post(
    url     := 'https://<PROJECT_REF>.supabase.co/functions/v1/send-reminders',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer <SERVICE_ROLE_KEY>'
    ),
    body    := '{}'::jsonb
  );
  $$
);

# Scheduler de recordatorios (`send-reminders`)

> **Nota de despliegue actual:** en producción la función se desplegó vía el
> editor del dashboard con el nombre autogenerado **`rapid-function`** y con
> **"Verify JWT" desactivado** (la invoca solo el cron interno). El cron y las
> llamadas `net.http_post` apuntan por tanto a
> `/functions/v1/rapid-function` **sin** cabecera `Authorization`.
> Si algún día se redespliega por CLI, conviene renombrarla a `send-reminders`
> para que cuadre con este repo y actualizar la URL del cron.

Edge Function que, a diario, envía recordatorios por email (Brevo) de los
seguimientos en estado `pending` cuyo umbral de días se ha superado, y marca
como `overdue` los que ya acumulan 3 recordatorios sin respuesta.

## Puesta en marcha (una sola vez)

### 1. Brevo
- Verifica el **remitente** (email o dominio) en Brevo → *Senders & IP*.
- Copia tu **API key** en Brevo → *SMTP & API → API Keys*.

### 2. Instalar y enlazar la CLI de Supabase
```bash
brew install supabase/tap/supabase   # o npm i -g supabase
supabase login
supabase link --project-ref <PROJECT_REF>
```

### 3. Configurar los secretos de la función
```bash
supabase secrets set \
  BREVO_API_KEY=xxxxxxxx \
  SENDER_EMAIL=recordatorios@tudominio.com \
  SENDER_NAME="Fincas Pro"
```
(`SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` los inyecta Supabase solo.)

### 4. Desplegar la función
```bash
supabase functions deploy send-reminders
```

### 5. Programar el cron
Abre `supabase/migrations/20260706000000_schedule_reminders.sql`, sustituye
`<PROJECT_REF>` y `<SERVICE_ROLE_KEY>`, y ejecútalo en el **SQL Editor** de
Supabase. Programa la función todos los días a las 08:00 UTC.

## Probar manualmente
```bash
curl -i -X POST \
  "https://<PROJECT_REF>.supabase.co/functions/v1/send-reminders" \
  -H "Authorization: Bearer <SERVICE_ROLE_KEY>"
```
Respuesta: `{ processed, sent, markedOverdue, errors }`.

## Cadencia
Para cada seguimiento `pending`, referencia = `last_response_at` (o
`created_at` si nunca respondió). Se envía recordatorio cuando los días
transcurridos alcanzan `threshold_days × (reminder_count + 1)`, es decir a
×1, ×2 y ×3 del umbral. Tras el 3.º, pasa a `overdue`.

-- =================================================================
-- Gestoria schema — initial migration
-- =================================================================

-- ---- Enums ----

CREATE TYPE receipt_type AS ENUM (
  'ordinary',
  'extraordinary'
);

CREATE TYPE receipt_status AS ENUM (
  'paid',
  'pending',
  'claimed',
  'judicial'
);

CREATE TYPE provider_expense_status AS ENUM (
  'paid',
  'pending',
  'overdue'
);

CREATE TYPE provider_expense_category AS ENUM (
  'cleaning',
  'maintenance',
  'insurance',
  'utilities',
  'administration'
);

CREATE TYPE contact_type AS ENUM (
  'provider',
  'agent'
);

CREATE TYPE tracking_status AS ENUM (
  'pending',
  'responded',
  'closed',
  'overdue'
);

CREATE TYPE tracking_event_type AS ENUM (
  'created',
  'status_changed',
  'reminder_sent',
  'response_received',
  'note_added',
  'closed'
);

CREATE TYPE email_status AS ENUM (
  'sent',
  'failed',
  'bounced'
);

-- ---- Helper: auto-update updated_at ----

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =================================================================
-- Core entities (mirroring frontend types)
-- =================================================================

CREATE TABLE communities (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  municipality text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE owners (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name   text NOT NULL,
  unit_reference text NOT NULL,                                      -- e.g. "1ºA"
  community_id   uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON owners (community_id);

CREATE TABLE providers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  tax_id        text NOT NULL,
  community_id  uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON providers (community_id);

CREATE TABLE provider_expenses (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id    uuid NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  community_id   uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  issue_date     date NOT NULL,
  due_date       date NOT NULL,
  concept        text NOT NULL,
  amount_cents   integer NOT NULL CHECK (amount_cents >= 0),
  payment_status provider_expense_status NOT NULL DEFAULT 'pending',
  category       provider_expense_category NOT NULL,
  invoice_number text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON provider_expenses (provider_id);
CREATE INDEX ON provider_expenses (community_id);

CREATE TABLE receipts (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number text NOT NULL,
  type           receipt_type NOT NULL,
  owner_id       uuid NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  community_id   uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  issue_date     date NOT NULL,
  due_date       date NOT NULL,
  period_label   text NOT NULL,                                      -- e.g. "Enero 2024"
  concept        text NOT NULL,
  amount_cents   integer NOT NULL CHECK (amount_cents >= 0),
  status         receipt_status NOT NULL DEFAULT 'pending',
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON receipts (owner_id);
CREATE INDEX ON receipts (community_id);
CREATE INDEX ON receipts (status) WHERE status IN ('pending', 'claimed', 'judicial');

-- ---- View: deudores (derived, no table) ----
-- Owners with at least one unpaid receipt, with aggregate debt and overdue info.

CREATE VIEW deudores AS
SELECT
  o.id                                       AS owner_id,
  o.display_name,
  o.unit_reference,
  o.community_id,
  COUNT(r.id)                                AS receipt_count,
  SUM(r.amount_cents)                        AS total_debt_cents,
  MIN(r.due_date)                            AS oldest_due_date,
  (CURRENT_DATE - MIN(r.due_date))           AS days_overdue,
  bool_or(r.status = 'judicial')             AS has_judicial,
  ARRAY_AGG(r.id ORDER BY r.due_date)        AS receipt_ids
FROM owners o
JOIN receipts r ON r.owner_id = o.id
WHERE r.status IN ('pending', 'claimed', 'judicial')
GROUP BY o.id, o.display_name, o.unit_reference, o.community_id;

-- =================================================================
-- Tracking system (incidencias / siniestros)
-- =================================================================

-- Contacto: a provider rep or an insurance agent who receives follow-up emails.
-- community_id and provider_id are both optional (nullable) — a contact may be
-- linked to one, both, or neither depending on context.
CREATE TABLE contacts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  email        text NOT NULL,
  type         contact_type NOT NULL,
  community_id uuid REFERENCES communities(id) ON DELETE SET NULL,
  provider_id  uuid REFERENCES providers(id)  ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON contacts (community_id);
CREATE INDEX ON contacts (provider_id);

-- TipoSeguimiento: defines the kind of tracking and how many days before a
-- reminder is triggered (threshold_days).
CREATE TABLE tracking_types (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  slug           text NOT NULL UNIQUE,
  threshold_days integer NOT NULL CHECK (threshold_days > 0),
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- Seed the two initial types
INSERT INTO tracking_types (name, slug, threshold_days) VALUES
  ('Presupuesto de proveedor', 'proveedor_presupuesto', 7),
  ('Siniestro con agente',     'siniestro_agente',      15);

-- Seguimiento: the main tracking record for a claim or budget request.
-- external_ref is free text (claim number, budget code, etc.).
CREATE TABLE trackings (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_ref     text NOT NULL,
  tracking_type_id uuid NOT NULL REFERENCES tracking_types(id),
  contact_id       uuid NOT NULL REFERENCES contacts(id),
  community_id     uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  status           tracking_status NOT NULL DEFAULT 'pending',
  last_response_at timestamptz,
  reminder_count   integer NOT NULL DEFAULT 0,
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_trackings_updated_at
  BEFORE UPDATE ON trackings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX ON trackings (community_id);
CREATE INDEX ON trackings (contact_id);
CREATE INDEX ON trackings (tracking_type_id);
CREATE INDEX ON trackings (status);

-- EventoSeguimiento: append-only log of every state change or action.
-- metadata is a free jsonb bag for event-specific extra data.
CREATE TABLE tracking_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id uuid NOT NULL REFERENCES trackings(id) ON DELETE CASCADE,
  event_type  tracking_event_type NOT NULL,
  description text,
  metadata    jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON tracking_events (tracking_id);

-- EmailEnviado: one row per email attempted (sent or failed).
CREATE TABLE sent_emails (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id   uuid NOT NULL REFERENCES trackings(id) ON DELETE CASCADE,
  to_email      text NOT NULL,
  subject       text NOT NULL,
  body_html     text,
  status        email_status NOT NULL DEFAULT 'sent',
  sent_at       timestamptz NOT NULL DEFAULT now(),
  error_message text
);

CREATE INDEX ON sent_emails (tracking_id);

-- Registro cerrado por código de invitación.
-- Nadie puede crear cuenta sin un código válido y sin usar. Los códigos los
-- genera un administrador (por SQL o con scripts/gen-invite.mjs). El registro se
-- valida server-side con el service role, así que esta tabla no necesita
-- políticas para el rol authenticated: queda bloqueada salvo para el backend.

CREATE TABLE IF NOT EXISTS invite_codes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code       text NOT NULL UNIQUE,
  note       text,                                   -- para qué / a quién es
  used_by    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS invite_codes_code_idx ON invite_codes (code);

ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
-- Sin políticas => el rol `authenticated`/`anon` no ve ni toca nada.
-- El registro usa el service role, que se salta RLS.

-- Ejemplo para generar un código a mano desde el SQL Editor:
--   insert into invite_codes (code, note) values ('FINCAS-2026-ABC', 'Gestoría X');

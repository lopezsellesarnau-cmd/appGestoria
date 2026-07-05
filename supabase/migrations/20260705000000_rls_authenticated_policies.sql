-- =================================================================
-- RLS: acceso completo para usuarios autenticados (rol admin único)
-- =================================================================
-- Contexto: una sola gestoría (Irene). Cualquier usuario autenticado
-- puede gestionar todos los datos. El rol `anon` (sin sesión) queda
-- bloqueado al no tener ninguna política.
--
-- Patrón por tabla: habilitar RLS + política FOR ALL para `authenticated`
-- con USING (true) y WITH CHECK (true).
-- =================================================================

do $$
declare
  t text;
  tables text[] := array[
    'communities',
    'owners',
    'providers',
    'provider_expenses',
    'receipts',
    'contacts',
    'tracking_types',
    'trackings',
    'tracking_events',
    'sent_emails'
  ];
begin
  foreach t in array tables loop
    -- Asegura privilegios de tabla para el rol authenticated
    execute format('grant all on table public.%I to authenticated', t);
    -- Habilita RLS (idempotente)
    execute format('alter table public.%I enable row level security', t);
    -- Recrea la política de acceso completo
    execute format('drop policy if exists "authenticated_full_access" on public.%I', t);
    execute format(
      'create policy "authenticated_full_access" on public.%I '
      || 'for all to authenticated using (true) with check (true)',
      t
    );
  end loop;
end $$;

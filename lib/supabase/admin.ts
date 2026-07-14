import { createClient } from '@supabase/supabase-js'

/**
 * Cliente con la service_role key. Se salta RLS y puede crear usuarios.
 * Solo se usa en server actions de confianza (p. ej. el registro con código).
 * NUNCA exponer en el cliente.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}

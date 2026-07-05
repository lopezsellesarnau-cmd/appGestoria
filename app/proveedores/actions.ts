'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type ActionResult = { ok: true } | { ok: false; error: string }

function parseFields(formData: FormData) {
  return {
    business_name: String(formData.get('business_name') ?? '').trim(),
    tax_id: String(formData.get('tax_id') ?? '').trim(),
    community_id: String(formData.get('community_id') ?? '').trim(),
    is_active: formData.get('is_active') === 'on',
  }
}

function validate(f: ReturnType<typeof parseFields>): string | null {
  if (!f.business_name) return 'El nombre comercial es obligatorio.'
  if (!f.tax_id) return 'El CIF/NIF es obligatorio.'
  if (!f.community_id) return 'Selecciona una comunidad.'
  return null
}

export async function createProvider(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const f = parseFields(formData)
  const error = validate(f)
  if (error) return { ok: false, error }

  const sb = createClient()
  const { error: dbError } = await sb.from('providers').insert(f)
  if (dbError) return { ok: false, error: 'No se pudo crear el proveedor.' }

  revalidatePath('/proveedores')
  return { ok: true }
}

export async function updateProvider(
  id: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const f = parseFields(formData)
  const error = validate(f)
  if (error) return { ok: false, error }

  const sb = createClient()
  const { error: dbError } = await sb.from('providers').update(f).eq('id', id)
  if (dbError) return { ok: false, error: 'No se pudo guardar el proveedor.' }

  revalidatePath('/proveedores')
  revalidatePath(`/proveedores/${id}/mayor`)
  return { ok: true }
}

export async function deleteProvider(id: string): Promise<ActionResult> {
  const sb = createClient()

  const { count } = await sb
    .from('provider_expenses')
    .select('id', { count: 'exact', head: true })
    .eq('provider_id', id)
  if (count && count > 0) {
    return {
      ok: false,
      error: `No se puede borrar: el proveedor tiene ${count} gasto(s) asociado(s).`,
    }
  }

  const { error: dbError } = await sb.from('providers').delete().eq('id', id)
  if (dbError) return { ok: false, error: 'No se pudo borrar el proveedor.' }

  revalidatePath('/proveedores')
  return { ok: true }
}

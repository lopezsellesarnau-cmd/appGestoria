'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type ActionResult = { ok: true } | { ok: false; error: string }

function parseFields(formData: FormData) {
  return {
    display_name: String(formData.get('display_name') ?? '').trim(),
    unit_reference: String(formData.get('unit_reference') ?? '').trim(),
    community_id: String(formData.get('community_id') ?? '').trim(),
  }
}

function validate(f: ReturnType<typeof parseFields>): string | null {
  if (!f.display_name) return 'El nombre es obligatorio.'
  if (!f.unit_reference) return 'La referencia de la vivienda es obligatoria.'
  if (!f.community_id) return 'Selecciona una comunidad.'
  return null
}

export async function createOwner(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const f = parseFields(formData)
  const error = validate(f)
  if (error) return { ok: false, error }

  const sb = createClient()
  const { error: dbError } = await sb.from('owners').insert(f)
  if (dbError) return { ok: false, error: 'No se pudo crear el propietario.' }

  revalidatePath('/propietarios')
  return { ok: true }
}

export async function updateOwner(
  id: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const f = parseFields(formData)
  const error = validate(f)
  if (error) return { ok: false, error }

  const sb = createClient()
  const { error: dbError } = await sb.from('owners').update(f).eq('id', id)
  if (dbError) return { ok: false, error: 'No se pudo guardar el propietario.' }

  revalidatePath('/propietarios')
  revalidatePath(`/propietarios/${id}/mayor`)
  return { ok: true }
}

export async function deleteOwner(id: string): Promise<ActionResult> {
  const sb = createClient()

  const { count } = await sb
    .from('receipts')
    .select('id', { count: 'exact', head: true })
    .eq('owner_id', id)
  if (count && count > 0) {
    return {
      ok: false,
      error: `No se puede borrar: el propietario tiene ${count} recibo(s) asociado(s).`,
    }
  }

  const { error: dbError } = await sb.from('owners').delete().eq('id', id)
  if (dbError) return { ok: false, error: 'No se pudo borrar el propietario.' }

  revalidatePath('/propietarios')
  return { ok: true }
}

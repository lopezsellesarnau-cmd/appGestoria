'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type ActionResult = { ok: true } | { ok: false; error: string }

function parseFields(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const municipality = String(formData.get('municipality') ?? '').trim()
  return { name, municipality }
}

function validate(fields: { name: string; municipality: string }): string | null {
  if (!fields.name) return 'El nombre es obligatorio.'
  if (!fields.municipality) return 'El municipio es obligatorio.'
  return null
}

export async function createCommunity(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const fields = parseFields(formData)
  const error = validate(fields)
  if (error) return { ok: false, error }

  const sb = createClient()
  const { error: dbError } = await sb.from('communities').insert(fields)
  if (dbError) return { ok: false, error: 'No se pudo crear la comunidad.' }

  revalidatePath('/comunidades')
  return { ok: true }
}

export async function updateCommunity(
  id: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const fields = parseFields(formData)
  const error = validate(fields)
  if (error) return { ok: false, error }

  const sb = createClient()
  const { error: dbError } = await sb
    .from('communities')
    .update(fields)
    .eq('id', id)
  if (dbError) return { ok: false, error: 'No se pudo guardar la comunidad.' }

  revalidatePath('/comunidades')
  revalidatePath(`/comunidades/${id}`)
  return { ok: true }
}

export async function deleteCommunity(id: string): Promise<ActionResult> {
  const sb = createClient()

  // Bloquea el borrado si la comunidad tiene propietarios (evita cascada de datos).
  const { count } = await sb
    .from('owners')
    .select('id', { count: 'exact', head: true })
    .eq('community_id', id)
  if (count && count > 0) {
    return {
      ok: false,
      error: `No se puede borrar: la comunidad tiene ${count} propietario(s) asociado(s).`,
    }
  }

  const { error: dbError } = await sb.from('communities').delete().eq('id', id)
  if (dbError) return { ok: false, error: 'No se pudo borrar la comunidad.' }

  revalidatePath('/comunidades')
  return { ok: true }
}

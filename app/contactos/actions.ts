'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type ActionResult = { ok: true } | { ok: false; error: string }

const TYPES = ['provider', 'agent'] as const

function parseFields(formData: FormData) {
  return {
    name: String(formData.get('name') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim(),
    type: String(formData.get('type') ?? '').trim(),
    community_id: String(formData.get('community_id') ?? '').trim(),
    provider_id: String(formData.get('provider_id') ?? '').trim(),
  }
}

function buildRow(f: ReturnType<typeof parseFields>): {
  row?: Record<string, unknown>
  error?: string
} {
  if (!f.name) return { error: 'El nombre es obligatorio.' }
  if (!f.email) return { error: 'El email es obligatorio.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    return { error: 'El email no es válido.' }
  if (!(TYPES as readonly string[]).includes(f.type))
    return { error: 'Selecciona el tipo de contacto.' }

  return {
    row: {
      name: f.name,
      email: f.email,
      type: f.type,
      community_id: f.community_id || null,
      provider_id: f.provider_id || null,
    },
  }
}

export async function createContact(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { row, error } = buildRow(parseFields(formData))
  if (error) return { ok: false, error }

  const sb = createClient()
  const { error: dbError } = await sb.from('contacts').insert(row!)
  if (dbError) return { ok: false, error: 'No se pudo crear el contacto.' }

  revalidatePath('/contactos')
  return { ok: true }
}

export async function updateContact(
  id: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { row, error } = buildRow(parseFields(formData))
  if (error) return { ok: false, error }

  const sb = createClient()
  const { error: dbError } = await sb.from('contacts').update(row!).eq('id', id)
  if (dbError) return { ok: false, error: 'No se pudo guardar el contacto.' }

  revalidatePath('/contactos')
  return { ok: true }
}

export async function deleteContact(id: string): Promise<ActionResult> {
  const sb = createClient()

  const { count } = await sb
    .from('trackings')
    .select('id', { count: 'exact', head: true })
    .eq('contact_id', id)
  if (count && count > 0) {
    return {
      ok: false,
      error: `No se puede borrar: el contacto tiene ${count} seguimiento(s) asociado(s).`,
    }
  }

  const { error: dbError } = await sb.from('contacts').delete().eq('id', id)
  if (dbError) return { ok: false, error: 'No se pudo borrar el contacto.' }

  revalidatePath('/contactos')
  return { ok: true }
}

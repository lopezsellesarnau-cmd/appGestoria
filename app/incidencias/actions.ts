'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { TRACKING_STATUS_LABELS, type TrackingStatus } from '@/types/incidencias'

export type ActionResult = { ok: true } | { ok: false; error: string }

const STATUSES: TrackingStatus[] = ['pending', 'responded', 'closed', 'overdue']

function parseFields(formData: FormData) {
  return {
    external_ref: String(formData.get('external_ref') ?? '').trim(),
    tracking_type_id: String(formData.get('tracking_type_id') ?? '').trim(),
    contact_id: String(formData.get('contact_id') ?? '').trim(),
    community_id: String(formData.get('community_id') ?? '').trim(),
    notes: String(formData.get('notes') ?? '').trim(),
  }
}

function validate(f: ReturnType<typeof parseFields>): string | null {
  if (!f.external_ref) return 'La referencia externa es obligatoria.'
  if (!f.tracking_type_id) return 'Selecciona el tipo.'
  if (!f.contact_id) return 'Selecciona un contacto.'
  if (!f.community_id) return 'Selecciona una comunidad.'
  return null
}

export async function createTracking(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const f = parseFields(formData)
  const error = validate(f)
  if (error) return { ok: false, error }

  const sb = createClient()
  const { data, error: dbError } = await sb
    .from('trackings')
    .insert({
      external_ref: f.external_ref,
      tracking_type_id: f.tracking_type_id,
      contact_id: f.contact_id,
      community_id: f.community_id,
      notes: f.notes || null,
    })
    .select('id')
    .single()
  if (dbError || !data) return { ok: false, error: 'No se pudo crear el seguimiento.' }

  await sb.from('tracking_events').insert({
    tracking_id: data.id,
    event_type: 'created',
    description: `Seguimiento creado (ref. ${f.external_ref})`,
  })

  revalidatePath('/incidencias')
  return { ok: true }
}

export async function updateTracking(
  id: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const f = parseFields(formData)
  const error = validate(f)
  if (error) return { ok: false, error }

  const sb = createClient()
  const { error: dbError } = await sb
    .from('trackings')
    .update({
      external_ref: f.external_ref,
      tracking_type_id: f.tracking_type_id,
      contact_id: f.contact_id,
      community_id: f.community_id,
      notes: f.notes || null,
    })
    .eq('id', id)
  if (dbError) return { ok: false, error: 'No se pudo guardar el seguimiento.' }

  revalidatePath('/incidencias')
  revalidatePath(`/incidencias/${id}`)
  return { ok: true }
}

export async function changeStatus(
  id: string,
  status: TrackingStatus,
): Promise<ActionResult> {
  if (!STATUSES.includes(status)) return { ok: false, error: 'Estado no válido.' }

  const sb = createClient()
  const { error: dbError } = await sb
    .from('trackings')
    .update({ status })
    .eq('id', id)
  if (dbError) return { ok: false, error: 'No se pudo cambiar el estado.' }

  await sb.from('tracking_events').insert({
    tracking_id: id,
    event_type: status === 'closed' ? 'closed' : 'status_changed',
    description: `Estado: ${TRACKING_STATUS_LABELS[status]}`,
  })

  revalidatePath('/incidencias')
  revalidatePath(`/incidencias/${id}`)
  return { ok: true }
}

export async function registerResponse(id: string): Promise<ActionResult> {
  const sb = createClient()
  const { error: dbError } = await sb
    .from('trackings')
    .update({ status: 'responded', last_response_at: new Date().toISOString() })
    .eq('id', id)
  if (dbError) return { ok: false, error: 'No se pudo registrar la respuesta.' }

  await sb.from('tracking_events').insert({
    tracking_id: id,
    event_type: 'response_received',
    description: 'Respuesta recibida del contacto',
  })

  revalidatePath('/incidencias')
  revalidatePath(`/incidencias/${id}`)
  return { ok: true }
}

export async function addNote(
  id: string,
  note: string,
): Promise<ActionResult> {
  const text = note.trim()
  if (!text) return { ok: false, error: 'La nota está vacía.' }

  const sb = createClient()
  const { error: dbError } = await sb.from('tracking_events').insert({
    tracking_id: id,
    event_type: 'note_added',
    description: text,
  })
  if (dbError) return { ok: false, error: 'No se pudo añadir la nota.' }

  revalidatePath(`/incidencias/${id}`)
  return { ok: true }
}

export async function deleteTracking(id: string): Promise<ActionResult> {
  const sb = createClient()
  const { error: dbError } = await sb.from('trackings').delete().eq('id', id)
  if (dbError) return { ok: false, error: 'No se pudo borrar el seguimiento.' }

  revalidatePath('/incidencias')
  return { ok: true }
}

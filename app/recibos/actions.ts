'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { parseEurosToCents } from '@/lib/utils'

export type ActionResult = { ok: true } | { ok: false; error: string }

const TYPES = ['ordinary', 'extraordinary'] as const
const STATUSES = ['paid', 'pending', 'claimed', 'judicial'] as const

function parseFields(formData: FormData) {
  return {
    receipt_number: String(formData.get('receipt_number') ?? '').trim(),
    type: String(formData.get('type') ?? '').trim(),
    owner_id: String(formData.get('owner_id') ?? '').trim(),
    issue_date: String(formData.get('issue_date') ?? '').trim(),
    due_date: String(formData.get('due_date') ?? '').trim(),
    period_label: String(formData.get('period_label') ?? '').trim(),
    concept: String(formData.get('concept') ?? '').trim(),
    amount: String(formData.get('amount') ?? '').trim(),
    status: String(formData.get('status') ?? '').trim(),
  }
}

type Parsed = ReturnType<typeof parseFields>

async function buildRow(
  sb: ReturnType<typeof createClient>,
  f: Parsed,
): Promise<{ row?: Record<string, unknown>; error?: string }> {
  if (!f.receipt_number) return { error: 'El número de recibo es obligatorio.' }
  if (!(TYPES as readonly string[]).includes(f.type))
    return { error: 'Tipo de recibo no válido.' }
  if (!f.owner_id) return { error: 'Selecciona un propietario.' }
  if (!f.issue_date) return { error: 'La fecha de emisión es obligatoria.' }
  if (!f.due_date) return { error: 'La fecha de vencimiento es obligatoria.' }
  if (f.due_date < f.issue_date)
    return { error: 'El vencimiento no puede ser anterior a la emisión.' }
  if (!f.period_label) return { error: 'El período es obligatorio.' }
  if (!f.concept) return { error: 'El concepto es obligatorio.' }
  if (!(STATUSES as readonly string[]).includes(f.status))
    return { error: 'Estado no válido.' }

  const amountCents = parseEurosToCents(f.amount)
  if (amountCents === null) return { error: 'Importe no válido.' }

  // La comunidad se deriva del propietario para garantizar coherencia.
  const { data: owner } = await sb
    .from('owners')
    .select('community_id')
    .eq('id', f.owner_id)
    .single()
  if (!owner) return { error: 'El propietario seleccionado no existe.' }

  return {
    row: {
      receipt_number: f.receipt_number,
      type: f.type,
      owner_id: f.owner_id,
      community_id: owner.community_id,
      issue_date: f.issue_date,
      due_date: f.due_date,
      period_label: f.period_label,
      concept: f.concept,
      amount_cents: amountCents,
      status: f.status,
    },
  }
}

export async function createReceipt(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const sb = createClient()
  const { row, error } = await buildRow(sb, parseFields(formData))
  if (error) return { ok: false, error }

  const { error: dbError } = await sb.from('receipts').insert(row!)
  if (dbError) return { ok: false, error: 'No se pudo crear el recibo.' }

  revalidatePath('/recibos')
  return { ok: true }
}

export async function updateReceipt(
  id: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const sb = createClient()
  const { row, error } = await buildRow(sb, parseFields(formData))
  if (error) return { ok: false, error }

  const { error: dbError } = await sb.from('receipts').update(row!).eq('id', id)
  if (dbError) return { ok: false, error: 'No se pudo guardar el recibo.' }

  revalidatePath('/recibos')
  return { ok: true }
}

export async function deleteReceipt(id: string): Promise<ActionResult> {
  const sb = createClient()
  const { error: dbError } = await sb.from('receipts').delete().eq('id', id)
  if (dbError) return { ok: false, error: 'No se pudo borrar el recibo.' }

  revalidatePath('/recibos')
  return { ok: true }
}

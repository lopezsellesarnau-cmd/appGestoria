'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { parseEurosToCents } from '@/lib/utils'

export type ActionResult = { ok: true } | { ok: false; error: string }

const STATUSES = ['paid', 'pending', 'overdue'] as const
const CATEGORIES = [
  'cleaning',
  'maintenance',
  'insurance',
  'utilities',
  'administration',
] as const

function parseFields(formData: FormData) {
  return {
    provider_id: String(formData.get('provider_id') ?? '').trim(),
    community_id: String(formData.get('community_id') ?? '').trim(),
    issue_date: String(formData.get('issue_date') ?? '').trim(),
    due_date: String(formData.get('due_date') ?? '').trim(),
    concept: String(formData.get('concept') ?? '').trim(),
    amount: String(formData.get('amount') ?? '').trim(),
    payment_status: String(formData.get('payment_status') ?? '').trim(),
    category: String(formData.get('category') ?? '').trim(),
    invoice_number: String(formData.get('invoice_number') ?? '').trim(),
  }
}

type Parsed = ReturnType<typeof parseFields>

function buildRow(f: Parsed): { row?: Record<string, unknown>; error?: string } {
  if (!f.provider_id) return { error: 'Selecciona un proveedor.' }
  if (!f.community_id) return { error: 'Selecciona una comunidad.' }
  if (!f.issue_date) return { error: 'La fecha de emisión es obligatoria.' }
  if (!f.due_date) return { error: 'La fecha de vencimiento es obligatoria.' }
  if (f.due_date < f.issue_date)
    return { error: 'El vencimiento no puede ser anterior a la emisión.' }
  if (!f.concept) return { error: 'El concepto es obligatorio.' }
  if (!(STATUSES as readonly string[]).includes(f.payment_status))
    return { error: 'Estado de pago no válido.' }
  if (!(CATEGORIES as readonly string[]).includes(f.category))
    return { error: 'Categoría no válida.' }

  const amountCents = parseEurosToCents(f.amount)
  if (amountCents === null) return { error: 'Importe no válido.' }

  return {
    row: {
      provider_id: f.provider_id,
      community_id: f.community_id,
      issue_date: f.issue_date,
      due_date: f.due_date,
      concept: f.concept,
      amount_cents: amountCents,
      payment_status: f.payment_status,
      category: f.category,
      invoice_number: f.invoice_number || null,
    },
  }
}

export async function createExpense(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { row, error } = buildRow(parseFields(formData))
  if (error) return { ok: false, error }

  const sb = createClient()
  const { error: dbError } = await sb.from('provider_expenses').insert(row!)
  if (dbError) return { ok: false, error: 'No se pudo crear el gasto.' }

  revalidatePath('/proveedores')
  return { ok: true }
}

export async function updateExpense(
  id: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { row, error } = buildRow(parseFields(formData))
  if (error) return { ok: false, error }

  const sb = createClient()
  const { error: dbError } = await sb
    .from('provider_expenses')
    .update(row!)
    .eq('id', id)
  if (dbError) return { ok: false, error: 'No se pudo guardar el gasto.' }

  revalidatePath('/proveedores')
  return { ok: true }
}

export async function deleteExpense(id: string): Promise<ActionResult> {
  const sb = createClient()
  const { error: dbError } = await sb
    .from('provider_expenses')
    .delete()
    .eq('id', id)
  if (dbError) return { ok: false, error: 'No se pudo borrar el gasto.' }

  revalidatePath('/proveedores')
  return { ok: true }
}

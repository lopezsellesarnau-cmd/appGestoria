import { createClient } from './supabase/server'
import type { Community } from '@/types/comunidades'
import type { Owner } from '@/types/propietarios'
import type { Provider, ProviderExpense } from '@/types/proveedores'
import type { Receipt } from '@/types/recibos'

// ---- Communities ----

export async function getCommunities(): Promise<Community[]> {
  const sb = createClient()
  const { data, error } = await sb
    .from('communities')
    .select('id, name, municipality')
    .order('name')
  if (error) throw error
  return data as Community[]
}

export async function getCommunity(id: string): Promise<Community | null> {
  const sb = createClient()
  const { data, error } = await sb
    .from('communities')
    .select('id, name, municipality')
    .eq('id', id)
    .single()
  if (error) return null
  return data as Community
}

// ---- Owners ----

export async function getOwners(communityId?: string): Promise<Owner[]> {
  const sb = createClient()
  let query = sb
    .from('owners')
    .select('id, display_name, unit_reference, community_id')
    .order('display_name')
  if (communityId) query = query.eq('community_id', communityId)
  const { data, error } = await query
  if (error) throw error
  return data.map((r) => ({
    id: r.id,
    displayName: r.display_name,
    unitReference: r.unit_reference,
    communityId: r.community_id,
  }))
}

export async function getOwner(id: string): Promise<Owner | null> {
  const sb = createClient()
  const { data, error } = await sb
    .from('owners')
    .select('id, display_name, unit_reference, community_id')
    .eq('id', id)
    .single()
  if (error) return null
  return {
    id: data.id,
    displayName: data.display_name,
    unitReference: data.unit_reference,
    communityId: data.community_id,
  }
}

// ---- Receipts ----

export async function getReceipts(filters?: {
  communityId?: string
  ownerId?: string
  statusIn?: string[]
}): Promise<Receipt[]> {
  const sb = createClient()
  let query = sb
    .from('receipts')
    .select(
      'id, receipt_number, type, owner_id, community_id, issue_date, due_date, period_label, concept, amount_cents, status',
    )
    .order('issue_date', { ascending: false })
  if (filters?.communityId) query = query.eq('community_id', filters.communityId)
  if (filters?.ownerId) query = query.eq('owner_id', filters.ownerId)
  if (filters?.statusIn) query = query.in('status', filters.statusIn)
  const { data, error } = await query
  if (error) throw error
  return data.map((r) => ({
    id: r.id,
    receiptNumber: r.receipt_number,
    type: r.type,
    ownerId: r.owner_id,
    communityId: r.community_id,
    issueDate: r.issue_date,
    dueDate: r.due_date,
    periodLabel: r.period_label,
    concept: r.concept,
    amountCents: r.amount_cents,
    status: r.status,
  }))
}

// ---- Providers ----

export async function getProviders(communityId?: string): Promise<Provider[]> {
  const sb = createClient()
  let query = sb
    .from('providers')
    .select('id, business_name, tax_id, community_id, is_active')
    .order('business_name')
  if (communityId) query = query.eq('community_id', communityId)
  const { data, error } = await query
  if (error) throw error
  return data.map((r) => ({
    id: r.id,
    businessName: r.business_name,
    taxId: r.tax_id,
    communityId: r.community_id,
    isActive: r.is_active,
  }))
}

export async function getProvider(id: string): Promise<Provider | null> {
  const sb = createClient()
  const { data, error } = await sb
    .from('providers')
    .select('id, business_name, tax_id, community_id, is_active')
    .eq('id', id)
    .single()
  if (error) return null
  return {
    id: data.id,
    businessName: data.business_name,
    taxId: data.tax_id,
    communityId: data.community_id,
    isActive: data.is_active,
  }
}

export async function getProviderExpenses(filters?: {
  communityId?: string
  providerId?: string
}): Promise<ProviderExpense[]> {
  const sb = createClient()
  let query = sb
    .from('provider_expenses')
    .select(
      'id, provider_id, community_id, issue_date, due_date, concept, amount_cents, payment_status, category, invoice_number',
    )
    .order('issue_date', { ascending: false })
  if (filters?.communityId) query = query.eq('community_id', filters.communityId)
  if (filters?.providerId) query = query.eq('provider_id', filters.providerId)
  const { data, error } = await query
  if (error) throw error
  return data.map((r) => ({
    id: r.id,
    providerId: r.provider_id,
    communityId: r.community_id,
    issueDate: r.issue_date,
    dueDate: r.due_date,
    concept: r.concept,
    amountCents: r.amount_cents,
    paymentStatus: r.payment_status,
    category: r.category,
    invoiceNumber: r.invoice_number ?? undefined,
  }))
}

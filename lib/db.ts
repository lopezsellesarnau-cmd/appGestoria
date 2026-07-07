import { createClient } from './supabase/server'
import type { Community } from '@/types/comunidades'
import type { Owner } from '@/types/propietarios'
import type { Provider, ProviderExpense } from '@/types/proveedores'
import type { Receipt } from '@/types/recibos'
import type { Contact } from '@/types/contactos'
import type {
  Tracking,
  TrackingType,
  TrackingEvent,
  SentEmail,
} from '@/types/incidencias'

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

// ---- Contacts ----

function mapContact(r: {
  id: string
  name: string
  email: string
  type: Contact['type']
  community_id: string | null
  provider_id: string | null
}): Contact {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    type: r.type,
    communityId: r.community_id,
    providerId: r.provider_id,
  }
}

export async function getContacts(): Promise<Contact[]> {
  const sb = createClient()
  const { data, error } = await sb
    .from('contacts')
    .select('id, name, email, type, community_id, provider_id')
    .order('name')
  if (error) throw error
  return data.map(mapContact)
}

export async function getContact(id: string): Promise<Contact | null> {
  const sb = createClient()
  const { data, error } = await sb
    .from('contacts')
    .select('id, name, email, type, community_id, provider_id')
    .eq('id', id)
    .single()
  if (error) return null
  return mapContact(data)
}

// ---- Tracking types ----

export async function getTrackingTypes(): Promise<TrackingType[]> {
  const sb = createClient()
  const { data, error } = await sb
    .from('tracking_types')
    .select('id, name, slug, threshold_days')
    .order('name')
  if (error) throw error
  return data.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    thresholdDays: r.threshold_days,
  }))
}

// ---- Trackings ----

const TRACKING_COLS =
  'id, external_ref, tracking_type_id, contact_id, community_id, status, last_response_at, reminder_count, notes, created_at, updated_at'

function mapTracking(r: Record<string, any>): Tracking {
  return {
    id: r.id,
    externalRef: r.external_ref,
    trackingTypeId: r.tracking_type_id,
    contactId: r.contact_id,
    communityId: r.community_id,
    status: r.status,
    lastResponseAt: r.last_response_at,
    reminderCount: r.reminder_count,
    notes: r.notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

export async function getTrackings(filters?: {
  communityId?: string
  trackingTypeId?: string
  status?: string
}): Promise<Tracking[]> {
  const sb = createClient()
  let query = sb
    .from('trackings')
    .select(TRACKING_COLS)
    .order('created_at', { ascending: false })
  if (filters?.communityId) query = query.eq('community_id', filters.communityId)
  if (filters?.trackingTypeId)
    query = query.eq('tracking_type_id', filters.trackingTypeId)
  if (filters?.status) query = query.eq('status', filters.status)
  const { data, error } = await query
  if (error) throw error
  return data.map(mapTracking)
}

export async function getTracking(id: string): Promise<Tracking | null> {
  const sb = createClient()
  const { data, error } = await sb
    .from('trackings')
    .select(TRACKING_COLS)
    .eq('id', id)
    .single()
  if (error) return null
  return mapTracking(data)
}

export async function getTrackingEvents(
  trackingId: string,
): Promise<TrackingEvent[]> {
  const sb = createClient()
  const { data, error } = await sb
    .from('tracking_events')
    .select('id, tracking_id, event_type, description, created_at')
    .eq('tracking_id', trackingId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map((r) => ({
    id: r.id,
    trackingId: r.tracking_id,
    eventType: r.event_type,
    description: r.description,
    createdAt: r.created_at,
  }))
}

export async function getSentEmails(trackingId: string): Promise<SentEmail[]> {
  const sb = createClient()
  const { data, error } = await sb
    .from('sent_emails')
    .select('id, tracking_id, to_email, subject, status, sent_at, error_message')
    .eq('tracking_id', trackingId)
    .order('sent_at', { ascending: false })
  if (error) throw error
  return data.map((r) => ({
    id: r.id,
    trackingId: r.tracking_id,
    toEmail: r.to_email,
    subject: r.subject,
    status: r.status,
    sentAt: r.sent_at,
    errorMessage: r.error_message,
  }))
}

export type TrackingStatus = "pending" | "responded" | "closed" | "overdue";

export type TrackingEventType =
  | "created"
  | "status_changed"
  | "reminder_sent"
  | "response_received"
  | "note_added"
  | "closed";

export type EmailStatus = "sent" | "failed" | "bounced";

export interface TrackingType {
  id: string;
  name: string;
  slug: string;
  thresholdDays: number;
}

export interface Tracking {
  id: string;
  externalRef: string;
  trackingTypeId: string;
  contactId: string;
  communityId: string;
  status: TrackingStatus;
  lastResponseAt: string | null;
  reminderCount: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingEvent {
  id: string;
  trackingId: string;
  eventType: TrackingEventType;
  description: string | null;
  createdAt: string;
}

export interface SentEmail {
  id: string;
  trackingId: string;
  toEmail: string;
  subject: string;
  status: EmailStatus;
  sentAt: string;
  errorMessage: string | null;
}

export const TRACKING_STATUS_LABELS: Record<TrackingStatus, string> = {
  pending: "Pendiente",
  responded: "Respondido",
  closed: "Cerrado",
  overdue: "Vencido",
};

export const TRACKING_EVENT_LABELS: Record<TrackingEventType, string> = {
  created: "Creado",
  status_changed: "Estado cambiado",
  reminder_sent: "Recordatorio enviado",
  response_received: "Respuesta recibida",
  note_added: "Nota añadida",
  closed: "Cerrado",
};

export const EMAIL_STATUS_LABELS: Record<EmailStatus, string> = {
  sent: "Enviado",
  failed: "Fallido",
  bounced: "Rebotado",
};

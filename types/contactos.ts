export type ContactType = "provider" | "agent";

export interface Contact {
  id: string;
  name: string;
  email: string;
  type: ContactType;
  communityId: string | null;
  providerId: string | null;
}

export const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  provider: "Proveedor",
  agent: "Agente",
};

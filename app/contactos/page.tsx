import { MainContent } from "@/components/layout/main-content";
import {
  ContactosTable,
  ContactRow,
} from "@/components/contactos/contactos-table";
import { getContacts, getCommunities, getProviders } from "@/lib/db";

export default async function ContactosPage() {
  const [contacts, communities, providers] = await Promise.all([
    getContacts(),
    getCommunities(),
    getProviders(),
  ]);

  const communityNameMap = Object.fromEntries(
    communities.map((c) => [c.id, c.name]),
  );
  const providerNameMap = Object.fromEntries(
    providers.map((p) => [p.id, p.businessName]),
  );

  const rows: ContactRow[] = contacts.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    type: c.type,
    communityId: c.communityId,
    providerId: c.providerId,
    communityName: c.communityId
      ? (communityNameMap[c.communityId] ?? "")
      : "",
    providerName: c.providerId ? (providerNameMap[c.providerId] ?? "") : "",
  }));

  const communityOptions = communities.map((c) => ({ id: c.id, name: c.name }));
  const providerOptions = providers.map((p) => ({
    id: p.id,
    businessName: p.businessName,
  }));

  return (
    <MainContent title="Contactos">
      <ContactosTable
        rows={rows}
        communities={communityOptions}
        providers={providerOptions}
      />
    </MainContent>
  );
}

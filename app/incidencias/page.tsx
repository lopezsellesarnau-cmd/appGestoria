import { MainContent } from "@/components/layout/main-content";
import {
  TrackingWorkspace,
  TrackingRow,
} from "@/components/incidencias/tracking-workspace";
import {
  getTrackings,
  getTrackingTypes,
  getContacts,
  getCommunities,
} from "@/lib/db";

export default async function IncidenciasPage() {
  const [trackings, trackingTypes, contacts, communities] = await Promise.all([
    getTrackings(),
    getTrackingTypes(),
    getContacts(),
    getCommunities(),
  ]);

  const typeNameMap = Object.fromEntries(trackingTypes.map((t) => [t.id, t.name]));
  const contactNameMap = Object.fromEntries(contacts.map((c) => [c.id, c.name]));
  const communityNameMap = Object.fromEntries(
    communities.map((c) => [c.id, c.name]),
  );

  const rows: TrackingRow[] = trackings.map((t) => ({
    id: t.id,
    externalRef: t.externalRef,
    trackingTypeId: t.trackingTypeId,
    typeName: typeNameMap[t.trackingTypeId] ?? "—",
    contactName: contactNameMap[t.contactId] ?? "—",
    communityId: t.communityId,
    communityName: communityNameMap[t.communityId] ?? "—",
    status: t.status,
    reminderCount: t.reminderCount,
    lastResponseAt: t.lastResponseAt,
    createdAt: t.createdAt,
  }));

  return (
    <MainContent title="Incidencias">
      <TrackingWorkspace
        rows={rows}
        trackingTypes={trackingTypes.map((t) => ({ id: t.id, name: t.name }))}
        contacts={contacts.map((c) => ({ id: c.id, name: c.name }))}
        communities={communities.map((c) => ({ id: c.id, name: c.name }))}
      />
    </MainContent>
  );
}

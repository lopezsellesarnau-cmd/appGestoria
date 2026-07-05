import { MainContent } from "@/components/layout/main-content";
import { PropietariosTable, OwnerRow } from "@/components/propietarios/propietarios-table";
import { getCommunities, getOwners, getReceipts } from "@/lib/db";

export default async function PropietariosPage() {
  const [communities, owners, pendingReceipts] = await Promise.all([
    getCommunities(),
    getOwners(),
    getReceipts({ statusIn: ['pending', 'claimed', 'judicial'] }),
  ]);

  const communityNameMap = Object.fromEntries(communities.map((c) => [c.id, c.name]));

  const rows: OwnerRow[] = owners.map((owner) => {
    const ownerPending = pendingReceipts.filter((r) => r.ownerId === owner.id);
    const totalDebt = ownerPending.reduce((sum, r) => sum + r.amountCents, 0);
    return {
      id: owner.id,
      displayName: owner.displayName,
      unitReference: owner.unitReference,
      communityName: communityNameMap[owner.communityId] ?? owner.communityId,
      pendingCount: ownerPending.length,
      totalDebt,
      hasDebt: ownerPending.length > 0,
    };
  });

  return (
    <MainContent title="Propietarios">
      <PropietariosTable rows={rows} />
    </MainContent>
  );
}

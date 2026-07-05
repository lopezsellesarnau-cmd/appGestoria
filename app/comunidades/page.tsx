import { MainContent } from "@/components/layout/main-content";
import { ComunidadesTable, CommunityRow } from "@/components/comunidades/comunidades-table";
import { getCommunities, getOwners, getReceipts } from "@/lib/db";

export default async function ComunidadesPage() {
  const [communities, owners, pendingReceipts] = await Promise.all([
    getCommunities(),
    getOwners(),
    getReceipts({ statusIn: ['pending', 'claimed', 'judicial'] }),
  ]);

  const rows: CommunityRow[] = communities.map((c) => {
    const ownerCount = owners.filter((o) => o.communityId === c.id).length;
    const pendingCount = pendingReceipts.filter((r) => r.communityId === c.id).length;
    return {
      id: c.id,
      name: c.name,
      municipality: c.municipality,
      ownerCount,
      pendingCount,
      hasPending: pendingCount > 0,
    };
  });

  return (
    <MainContent title="Comunidades">
      <ComunidadesTable rows={rows} />
    </MainContent>
  );
}

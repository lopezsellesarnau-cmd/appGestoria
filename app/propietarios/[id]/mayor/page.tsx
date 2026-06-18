import { notFound } from 'next/navigation';
import { MainContent } from '@/components/layout/main-content';
import { OwnerLedger } from '@/components/recibos/owner-ledger';
import { PROPIETARIOS } from '@/data/propietarios';
import { COMUNIDADES } from '@/data/comunidades';
import { RECIBOS } from '@/data/recibos';

interface OwnerLedgerPageProps {
  params: Promise<{ id: string }>;
}

export default async function OwnerLedgerPage({ params }: OwnerLedgerPageProps) {
  const { id } = await params;
  const owner = PROPIETARIOS.find((p) => p.id === id);

  if (!owner) {
    notFound();
  }

  const community = COMUNIDADES.find((c) => c.id === owner.communityId);
  const ownerReceipts = RECIBOS.filter((r) => r.ownerId === id);

  return (
    <MainContent title={`Mayor de ${owner.displayName}`}>
      <OwnerLedger
        owner={owner}
        community={community}
        receipts={ownerReceipts}
      />
    </MainContent>
  );
}

import { notFound } from 'next/navigation';
import { MainContent } from '@/components/layout/main-content';
import { OwnerLedger } from '@/components/recibos/owner-ledger';
import { getOwner, getCommunity, getReceipts } from '@/lib/db';

interface OwnerLedgerPageProps {
  params: Promise<{ id: string }>;
}

export default async function OwnerLedgerPage({ params }: OwnerLedgerPageProps) {
  const { id } = await params;

  const owner = await getOwner(id);
  if (!owner) notFound();

  const [community, receipts] = await Promise.all([
    getCommunity(owner.communityId),
    getReceipts({ ownerId: id }),
  ]);

  return (
    <MainContent title={`Mayor de ${owner.displayName}`}>
      <OwnerLedger owner={owner} community={community ?? undefined} receipts={receipts} />
    </MainContent>
  );
}

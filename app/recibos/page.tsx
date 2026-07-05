import { MainContent } from '@/components/layout/main-content';
import { ReceiptWorkspace } from '@/components/recibos/receipt-workspace';
import { getCommunities, getOwners, getReceipts } from '@/lib/db';

export default async function RecibosPage() {
  const [receipts, comunidades, propietarios] = await Promise.all([
    getReceipts(),
    getCommunities(),
    getOwners(),
  ]);

  return (
    <MainContent title="Recibos">
      <ReceiptWorkspace
        receipts={receipts}
        comunidades={comunidades}
        propietarios={propietarios}
      />
    </MainContent>
  );
}

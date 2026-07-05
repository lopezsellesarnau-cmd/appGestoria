import { MainContent } from "@/components/layout/main-content";
import { DebtorWorkspace } from "@/components/deudores/debtor-workspace";
import { getCommunities, getOwners, getReceipts } from "@/lib/db";

export default async function DeudoresPage() {
  const [owners, receipts, communities] = await Promise.all([
    getOwners(),
    getReceipts({ statusIn: ['pending', 'claimed', 'judicial'] }),
    getCommunities(),
  ]);

  return (
    <MainContent title="Deudores">
      <DebtorWorkspace
        owners={owners}
        receipts={receipts}
        communities={communities}
      />
    </MainContent>
  );
}

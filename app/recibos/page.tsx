import { MainContent } from '@/components/layout/main-content';
import { ReceiptWorkspace } from '@/components/recibos/receipt-workspace';
import { RECIBOS } from '@/data/recibos';
import { COMUNIDADES } from '@/data/comunidades';
import { PROPIETARIOS } from '@/data/propietarios';

export default function RecibosPage() {
  return (
    <MainContent title="Recibos">
      <ReceiptWorkspace
        receipts={RECIBOS}
        comunidades={COMUNIDADES}
        propietarios={PROPIETARIOS}
      />
    </MainContent>
  );
}

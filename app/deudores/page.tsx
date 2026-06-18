import { MainContent } from "@/components/layout/main-content";
import { DebtorWorkspace } from "@/components/deudores/debtor-workspace";
import { PROPIETARIOS } from "@/data/propietarios";
import { RECIBOS } from "@/data/recibos";
import { COMUNIDADES } from "@/data/comunidades";

export default function DeudoresPage() {
	return (
		<MainContent title="Deudores">
			<DebtorWorkspace
				owners={PROPIETARIOS}
				receipts={RECIBOS}
				communities={COMUNIDADES}
			/>
		</MainContent>
	);
}

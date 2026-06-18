import { MainContent } from "@/components/layout/main-content";
import { ProviderWorkspace } from "@/components/proveedores/provider-workspace";
import { PROVEEDORES } from "@/data/proveedores";
import { GASTOS } from "@/data/proveedores";
import { COMUNIDADES } from "@/data/comunidades";

export default function ProveedoresPage() {
	return (
		<MainContent title="Proveedores">
			<ProviderWorkspace
				providers={PROVEEDORES}
				expenses={GASTOS}
				communities={COMUNIDADES}
			/>
		</MainContent>
	);
}

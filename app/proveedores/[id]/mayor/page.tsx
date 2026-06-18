import { notFound } from "next/navigation";
import { MainContent } from "@/components/layout/main-content";
import { ProviderLedger } from "@/components/proveedores/provider-ledger";
import { PROVEEDORES } from "@/data/proveedores";
import { GASTOS } from "@/data/proveedores";
import { COMUNIDADES } from "@/data/comunidades";

interface ProviderLedgerPageProps {
	params: Promise<{ id: string }>;
}

export default async function ProviderLedgerPage({
	params,
}: ProviderLedgerPageProps) {
	const { id } = await params;
	const provider = PROVEEDORES.find((p) => p.id === id);

	if (!provider) {
		notFound();
	}

	const communityNameMap = COMUNIDADES.reduce(
		(acc, c) => {
			acc[c.id] = c.name;
			return acc;
		},
		{} as Record<string, string>,
	);

	const providerExpenses = GASTOS.filter((g) => g.providerId === id);

	return (
		<MainContent title={`Mayor de ${provider.businessName}`}>
			<ProviderLedger
				provider={provider}
				expenses={providerExpenses}
				communityNames={communityNameMap}
				communityOptions={COMUNIDADES.map((c) => ({
					id: c.id,
					name: c.name,
				}))}
			/>
		</MainContent>
	);
}

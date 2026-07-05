import { notFound } from "next/navigation";
import { MainContent } from "@/components/layout/main-content";
import { ProviderLedger } from "@/components/proveedores/provider-ledger";
import { getProvider, getProviderExpenses, getCommunities } from "@/lib/db";

interface ProviderLedgerPageProps {
	params: Promise<{ id: string }>;
}

export default async function ProviderLedgerPage({
	params,
}: ProviderLedgerPageProps) {
	const { id } = await params;

	const provider = await getProvider(id);
	if (!provider) {
		notFound();
	}

	const [communities, providerExpenses] = await Promise.all([
		getCommunities(),
		getProviderExpenses({ providerId: id }),
	]);

	const communityNameMap = communities.reduce(
		(acc, c) => {
			acc[c.id] = c.name;
			return acc;
		},
		{} as Record<string, string>,
	);

	return (
		<MainContent title={`Mayor de ${provider.businessName}`}>
			<ProviderLedger
				provider={provider}
				expenses={providerExpenses}
				communityNames={communityNameMap}
				communityOptions={communities.map((c) => ({
					id: c.id,
					name: c.name,
				}))}
			/>
		</MainContent>
	);
}

import { MainContent } from "@/components/layout/main-content";
import { ProviderWorkspace } from "@/components/proveedores/provider-workspace";
import { getCommunities, getProviders, getProviderExpenses } from "@/lib/db";

export default async function ProveedoresPage() {
  const [providers, expenses, communities] = await Promise.all([
    getProviders(),
    getProviderExpenses(),
    getCommunities(),
  ]);

  return (
    <MainContent title="Proveedores">
      <ProviderWorkspace
        providers={providers}
        expenses={expenses}
        communities={communities}
      />
    </MainContent>
  );
}

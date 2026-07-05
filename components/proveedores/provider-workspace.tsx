"use client";

import { useState, useMemo } from "react";
import { Provider, ProviderExpense } from "@/types/proveedores";
import { Community } from "@/types/comunidades";
import { ProviderFilters, ProviderFiltersState } from "./provider-filters";
import { ProviderTable } from "./provider-table";
import { ProviderFormDialog } from "./provider-form-dialog";
import { ExpenseFormDialog } from "./expense-form-dialog";
import { filterExpenses } from "@/lib/proveedores/filter-logic";

const DEFAULT_FILTERS: ProviderFiltersState = {
	communityId: "",
	providerId: "",
	category: "all",
	status: "all",
	dateFrom: "",
	dateTo: "",
};

interface ProviderWorkspaceProps {
	providers: Provider[];
	expenses: ProviderExpense[];
	communities: Community[];
}

export function ProviderWorkspace({
	providers,
	expenses,
	communities,
}: ProviderWorkspaceProps) {
	const [filters, setFilters] = useState<ProviderFiltersState>(DEFAULT_FILTERS);

	const providerNameMap = useMemo(
		() =>
			providers.reduce(
				(acc, p) => {
					acc[p.id] = p.businessName;
					return acc;
				},
				{} as Record<string, string>,
			),
		[providers],
	);

	const communityNameMap = useMemo(
		() =>
			communities.reduce(
				(acc, c) => {
					acc[c.id] = c.name;
					return acc;
				},
				{} as Record<string, string>,
			),
		[communities],
	);

	const filteredExpenses = useMemo(
		() => filterExpenses(expenses, filters) as ProviderExpense[],
		[expenses, filters],
	);

	const communityOptions = communities.map((c) => ({ id: c.id, name: c.name }));
	const providerOptions = providers.map((p) => ({
		id: p.id,
		businessName: p.businessName,
	}));

	return (
		<div className="flex flex-col">
			<div className="mb-4 flex items-center justify-end gap-2">
				<ProviderFormDialog communities={communityOptions} />
				<ExpenseFormDialog
					providers={providerOptions}
					communities={communityOptions}
				/>
			</div>
			<ProviderFilters
				filters={filters}
				onFilterChange={setFilters}
				communityOptions={communityOptions}
				providerOptions={providerOptions}
			/>
			<ProviderTable
				expenses={filteredExpenses}
				providerNames={providerNameMap}
				communityNames={communityNameMap}
				providerOptions={providerOptions}
				communityOptions={communityOptions}
			/>
		</div>
	);
}

"use client";

import { useState, useMemo } from "react";
import { Owner } from "@/types/propietarios";
import { Receipt } from "@/types/recibos";
import { Community } from "@/types/comunidades";
import { DebtorFilters, DebtorFiltersState } from "./debtor-filters";
import { DebtorTable, DebtorRow } from "./debtor-table";
import { calculateOwnerDebt } from "@/lib/propietarios/debt-logic";
import { generateCSV, downloadCSV } from "@/lib/csv/export";

const DEFAULT_FILTERS: DebtorFiltersState = {
	communityId: "",
	type: "all",
};

interface DebtorWorkspaceProps {
	owners: Owner[];
	receipts: Receipt[];
	communities: Community[];
}

export function DebtorWorkspace({
	owners,
	receipts,
	communities,
}: DebtorWorkspaceProps) {
	const [filters, setFilters] = useState<DebtorFiltersState>(DEFAULT_FILTERS);

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

	const debtors = useMemo(() => {
		const ownerReceiptMap = new Map<string, Receipt[]>();

		for (const receipt of receipts) {
			if (!ownerReceiptMap.has(receipt.ownerId)) {
				ownerReceiptMap.set(receipt.ownerId, []);
			}
			ownerReceiptMap.get(receipt.ownerId)!.push(receipt);
		}

		const result: DebtorRow[] = [];

		for (const owner of owners) {
			const ownerReceipts = ownerReceiptMap.get(owner.id) ?? [];
			const debt = calculateOwnerDebt(ownerReceipts);

			if (debt.count === 0) continue;

			result.push({
				ownerId: owner.id,
				ownerName: owner.displayName,
				communityId: owner.communityId,
				communityName: communityNameMap[owner.communityId] ?? owner.communityId,
				unitReference: owner.unitReference,
				totalPending: debt.totalPending,
				totalJudicial: debt.totalJudicial,
				receiptCount: debt.count,
				oldestPendingDays: debt.oldestPendingDays,
			});
		}

		return result;
	}, [owners, receipts, communityNameMap]);

	const filteredDebtors = useMemo(() => {
		return debtors.filter((d) => {
			if (filters.communityId && d.communityId !== filters.communityId) {
				return false;
			}
			if (filters.type === "judicial" && d.totalJudicial === 0) {
				return false;
			}
			if (filters.type === "no-judicial" && d.totalJudicial > 0) {
				return false;
			}
			return true;
		});
	}, [debtors, filters]);

	const handleExportCSV = () => {
		const headers = [
			"Propietario",
			"Comunidad",
			"Unidad",
			"Deuda total (€)",
			"Deuda judicial (€)",
			"Nº Recibos pendientes",
			"Antigüedad (días)",
		];
		const columns = [
			"ownerName",
			"communityName",
			"unitReference",
			"totalPending",
			"totalJudicial",
			"receiptCount",
			"oldestPendingDays",
		];

		const rows = filteredDebtors.map((d) => ({
			...d,
			totalPending: (d.totalPending / 100).toFixed(2),
			totalJudicial: (d.totalJudicial / 100).toFixed(2),
		}));

		const csv = generateCSV(headers, columns, rows);
		downloadCSV(csv, `deudores-${new Date().toISOString().split("T")[0]}`);
	};

	return (
		<div className="space-y-4">
			<DebtorFilters
				filters={filters}
				onFilterChange={setFilters}
				communityOptions={communities.map((c) => ({ id: c.id, name: c.name }))}
				onExportCSV={handleExportCSV}
			/>
			<DebtorTable debtors={filteredDebtors} />
		</div>
	);
}

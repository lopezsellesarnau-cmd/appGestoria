"use client";

import { FormSelect } from "@/components/ui/form-select";
import { Button } from "@/components/ui/button";

export type DebtorFilterType = "all" | "judicial" | "no-judicial";

export interface DebtorFiltersState {
	communityId: string;
	type: DebtorFilterType;
}

interface DebtorFiltersProps {
	filters: DebtorFiltersState;
	onFilterChange: (filters: DebtorFiltersState) => void;
	communityOptions: { id: string; name: string }[];
	onExportCSV: () => void;
}

const TYPE_OPTIONS = [
	{ value: "all", label: "Todos" },
	{ value: "judicial", label: "Con deuda judicial" },
	{ value: "no-judicial", label: "Sin deuda judicial" },
];

export function DebtorFilters({
	filters,
	onFilterChange,
	communityOptions,
	onExportCSV,
}: DebtorFiltersProps) {
	const handleChange = (field: keyof DebtorFiltersState, value: string) => {
		onFilterChange({ ...filters, [field]: value });
	};

	return (
		<div
			className="mb-4 flex flex-wrap items-end gap-4 rounded-lg border bg-white p-4"
			style={{ borderColor: "var(--border)" }}
		>
			<div className="flex flex-col gap-1.5">
				<label className="text-xs font-medium text-muted-foreground">Comunidad</label>
				<FormSelect
					value={filters.communityId}
					onChange={(e) => handleChange("communityId", e.target.value)}
					className="w-[200px]"
				>
					<option value="">Todas</option>
					{communityOptions.map((c) => (
						<option key={c.id} value={c.id}>
							{c.name}
						</option>
					))}
				</FormSelect>
			</div>

			<div className="flex flex-col gap-1.5">
				<label className="text-xs font-medium text-muted-foreground">Tipo</label>
				<FormSelect
					value={filters.type}
					onChange={(e) => handleChange("type", e.target.value)}
					className="w-[220px]"
				>
					{TYPE_OPTIONS.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</FormSelect>
			</div>

			<div className="ml-auto">
				<Button variant="outline" onClick={onExportCSV}>
					Exportar CSV
				</Button>
			</div>
		</div>
	);
}

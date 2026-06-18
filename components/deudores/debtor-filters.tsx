"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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

	const communityDisplay = filters.communityId
		? communityOptions.find((c) => c.id === filters.communityId)?.name ?? "Comunidad"
		: "Todas";
	const typeDisplay = TYPE_OPTIONS.find((o) => o.value === filters.type)?.label ?? "Tipo";

	return (
		<div className="flex gap-4 items-end flex-wrap pb-4">
			<div className="space-y-1.5">
				<label className="text-xs font-medium text-muted-foreground">Comunidad</label>
				<Select
					value={filters.communityId}
					onValueChange={(value) => handleChange("communityId", value ?? "")}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue>{communityDisplay}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">Todas</SelectItem>
						{communityOptions.map((c) => (
							<SelectItem key={c.id} value={c.id}>
								{c.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-1.5">
				<label className="text-xs font-medium text-muted-foreground">Tipo</label>
				<Select
					value={filters.type}
					onValueChange={(value) => handleChange("type", value ?? "all")}
				>
					<SelectTrigger className="w-[200px]">
						<SelectValue>{typeDisplay}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{TYPE_OPTIONS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex-1" />

			<Button variant="outline" onClick={onExportCSV}>
				Exportar CSV
			</Button>
		</div>
	);
}

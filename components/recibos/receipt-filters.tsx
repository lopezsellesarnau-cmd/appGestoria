"use client";

import { ReceiptType, ReceiptStatus } from "@/types/recibos";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ReceiptFiltersState {
  type: ReceiptType | "all";
  communityId: string;
  ownerId: string;
  status: ReceiptStatus | "all";
  dateFrom: string;
  dateTo: string;
}

interface ReceiptFiltersProps {
  filters: ReceiptFiltersState;
  onFilterChange: (filters: ReceiptFiltersState) => void;
  communityOptions: { id: string; name: string }[];
  ownerOptions: { id: string; displayName: string }[];
  onExportCSV: () => void;
}

const TYPE_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "ordinary", label: "Ordinario" },
  { value: "extraordinary", label: "Extraordinario" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "paid", label: "Pagado" },
  { value: "pending", label: "Pendiente" },
  { value: "claimed", label: "Reclamado" },
  { value: "judicial", label: "Judicial" },
];

export function ReceiptFilters({
  filters,
  onFilterChange,
  communityOptions,
  ownerOptions,
  onExportCSV,
}: ReceiptFiltersProps) {
  const handleChange = (field: keyof ReceiptFiltersState, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const typeDisplay = TYPE_OPTIONS.find((o) => o.value === filters.type)?.label ?? "Tipo";
  const statusDisplay = STATUS_OPTIONS.find((o) => o.value === filters.status)?.label ?? "Estado";
  const communityDisplay = filters.communityId
    ? communityOptions.find((c) => c.id === filters.communityId)?.name ?? "Comunidad"
    : "Todas";
  const ownerDisplay = filters.ownerId
    ? ownerOptions.find((o) => o.id === filters.ownerId)?.displayName ?? "Propietario"
    : "Todos";

  return (
    <div className="flex gap-4 items-end flex-wrap pb-4">
      {/* Type Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Tipo</label>
        <Select
          value={filters.type}
          onValueChange={(value) => handleChange("type", (value ?? "all") as ReceiptType | "all")}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue>{typeDisplay}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Community Filter */}
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

      {/* Owner Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Propietario</label>
        <Select
          value={filters.ownerId}
          onValueChange={(value) => handleChange("ownerId", value ?? "")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>{ownerDisplay}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {ownerOptions.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Estado</label>
        <Select
          value={filters.status}
          onValueChange={(value) => handleChange("status", (value ?? "all") as ReceiptStatus | "all")}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue>{statusDisplay}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date From */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Desde</label>
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => handleChange("dateFrom", e.target.value)}
          className="w-[150px]"
        />
      </div>

      {/* Date To */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Hasta</label>
        <Input
          type="date"
          value={filters.dateTo}
          onChange={(e) => handleChange("dateTo", e.target.value)}
          className="w-[150px]"
        />
      </div>

      <div className="flex-1" />

      <Button variant="outline" onClick={onExportCSV}>
        Exportar CSV
      </Button>
    </div>
  );
}

"use client";

import {
  ProviderExpenseCategory,
  ProviderExpenseStatus,
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
} from "@/types/proveedores";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ProviderFiltersState {
  communityId: string;
  providerId: string;
  category: ProviderExpenseCategory | "all";
  status: ProviderExpenseStatus | "all";
  dateFrom: string;
  dateTo: string;
}

interface ProviderFiltersProps {
  filters: ProviderFiltersState;
  onFilterChange: (filters: ProviderFiltersState) => void;
  communityOptions: { id: string; name: string }[];
  providerOptions: { id: string; businessName: string }[];
}

export function ProviderFilters({
  filters,
  onFilterChange,
  communityOptions,
  providerOptions,
}: ProviderFiltersProps) {
  const handleChange = (field: keyof ProviderFiltersState, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const categoryDisplay = CATEGORY_OPTIONS.find((o) => o.value === filters.category)?.label ?? "Categoría";
  const statusDisplay = STATUS_OPTIONS.find((o) => o.value === filters.status)?.label ?? "Estado";
  const communityDisplay = filters.communityId
    ? communityOptions.find((c) => c.id === filters.communityId)?.name ?? "Comunidad"
    : "Todas";
  const providerDisplay = filters.providerId
    ? providerOptions.find((p) => p.id === filters.providerId)?.businessName ?? "Proveedor"
    : "Todos";

  return (
    <div className="flex gap-4 items-end flex-wrap pb-4">
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

      {/* Provider Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Proveedor</label>
        <Select
          value={filters.providerId}
          onValueChange={(value) => handleChange("providerId", value ?? "")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>{providerDisplay}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {providerOptions.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.businessName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Categoría</label>
        <Select
          value={filters.category}
          onValueChange={(value) => handleChange("category", (value ?? "all") as ProviderExpenseCategory | "all")}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue>{categoryDisplay}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Estado</label>
        <Select
          value={filters.status}
          onValueChange={(value) => handleChange("status", (value ?? "all") as ProviderExpenseStatus | "all")}
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
    </div>
  );
}

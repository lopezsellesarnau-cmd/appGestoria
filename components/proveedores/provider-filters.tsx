"use client";

import {
  ProviderExpenseCategory,
  ProviderExpenseStatus,
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
} from "@/types/proveedores";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/form-select";

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

  return (
    <div
      className="mb-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border bg-white p-4 sm:grid-cols-3 lg:grid-cols-6"
      style={{ borderColor: "var(--border)" }}
    >
      <Field label="Comunidad">
        <FormSelect
          value={filters.communityId}
          onChange={(e) => handleChange("communityId", e.target.value)}
        >
          <option value="">Todas</option>
          {communityOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </FormSelect>
      </Field>

      <Field label="Proveedor">
        <FormSelect
          value={filters.providerId}
          onChange={(e) => handleChange("providerId", e.target.value)}
        >
          <option value="">Todos</option>
          {providerOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.businessName}
            </option>
          ))}
        </FormSelect>
      </Field>

      <Field label="Categoría">
        <FormSelect
          value={filters.category}
          onChange={(e) => handleChange("category", e.target.value)}
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </FormSelect>
      </Field>

      <Field label="Estado">
        <FormSelect
          value={filters.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </FormSelect>
      </Field>

      <Field label="Desde">
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => handleChange("dateFrom", e.target.value)}
        />
      </Field>

      <Field label="Hasta">
        <Input
          type="date"
          value={filters.dateTo}
          onChange={(e) => handleChange("dateTo", e.target.value)}
        />
      </Field>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

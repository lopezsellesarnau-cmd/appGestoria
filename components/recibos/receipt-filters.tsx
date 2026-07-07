"use client";

import { ReceiptType, ReceiptStatus } from "@/types/recibos";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/ui/form-select";

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

  return (
    <div
      className="mb-4 rounded-lg border bg-white p-4"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-6">
        <Field label="Tipo">
          <FormSelect
            value={filters.type}
            onChange={(e) => handleChange("type", e.target.value)}
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </FormSelect>
        </Field>

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

        <Field label="Propietario">
          <FormSelect
            value={filters.ownerId}
            onChange={(e) => handleChange("ownerId", e.target.value)}
          >
            <option value="">Todos</option>
            {ownerOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.displayName}
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

      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={onExportCSV}>
          Exportar CSV
        </Button>
      </div>
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

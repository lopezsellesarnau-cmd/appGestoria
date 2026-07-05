"use client";

import { useState, useMemo } from "react";
import { Receipt, ReceiptType, ReceiptStatus } from "@/types/recibos";
import { Community } from "@/types/comunidades";
import { Owner } from "@/types/propietarios";
import { ReceiptFilters, ReceiptFiltersState } from "./receipt-filters";
import { ReceiptTable } from "./receipt-table";
import { ReceiptFormDialog } from "./receipt-form-dialog";
import { generateCSV, downloadCSV } from "@/lib/csv/export";

const DEFAULT_FILTERS: ReceiptFiltersState = {
  type: "all",
  communityId: "",
  ownerId: "",
  status: "all",
  dateFrom: "",
  dateTo: "",
};

interface ReceiptWorkspaceProps {
  receipts: Receipt[];
  comunidades: Community[];
  propietarios: Owner[];
}

export function ReceiptWorkspace({
  receipts,
  comunidades,
  propietarios,
}: ReceiptWorkspaceProps) {
  const [filters, setFilters] = useState<ReceiptFiltersState>(DEFAULT_FILTERS);

  const ownerNameMap = useMemo(
    () =>
      propietarios.reduce(
        (acc, o) => {
          acc[o.id] = o.displayName;
          return acc;
        },
        {} as Record<string, string>,
      ),
    [propietarios],
  );

  const communityNameMap = useMemo(
    () =>
      comunidades.reduce(
        (acc, c) => {
          acc[c.id] = c.name;
          return acc;
        },
        {} as Record<string, string>,
      ),
    [comunidades],
  );

  const filteredReceipts = useMemo(() => {
    return receipts.filter((receipt) => {
      if (filters.type !== "all" && receipt.type !== filters.type) {
        return false;
      }
      if (filters.communityId && receipt.communityId !== filters.communityId) {
        return false;
      }
      if (filters.ownerId && receipt.ownerId !== filters.ownerId) {
        return false;
      }
      if (filters.status !== "all" && receipt.status !== filters.status) {
        return false;
      }
      if (filters.dateFrom && receipt.issueDate < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && receipt.issueDate > filters.dateTo) {
        return false;
      }
      return true;
    });
  }, [receipts, filters]);

  const handleExportCSV = () => {
    const headers = [
      "Nº Recibo",
      "Tipo",
      "Propietario",
      "Comunidad",
      "Fecha emisión",
      "Fecha vencimiento",
      "Período",
      "Concepto",
      "Importe (€)",
      "Estado",
    ];
    const columns = [
      "receiptNumber",
      "type",
      "ownerId",
      "communityId",
      "issueDate",
      "dueDate",
      "periodLabel",
      "concept",
      "amountCents",
      "status",
    ];

    const rows = filteredReceipts.map((r) => ({
      ...r,
      type: r.type === "ordinary" ? "Ordinario" : "Extraordinario",
      amountCents: (r.amountCents / 100).toFixed(2),
      status:
        r.status === "paid"
          ? "Pagado"
          : r.status === "pending"
            ? "Pendiente"
            : r.status === "claimed"
              ? "Reclamado"
              : "Judicial",
    }));

    const csv = generateCSV(headers, columns, rows);
    downloadCSV(csv, `recibos-${new Date().toISOString().split("T")[0]}`);
  };

  const ownerOptions = propietarios.map((o) => ({
    id: o.id,
    displayName: o.displayName,
  }));

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-end">
        <ReceiptFormDialog owners={ownerOptions} />
      </div>
      <ReceiptFilters
        filters={filters}
        onFilterChange={setFilters}
        communityOptions={comunidades.map((c) => ({ id: c.id, name: c.name }))}
        ownerOptions={ownerOptions}
        onExportCSV={handleExportCSV}
      />
      <ReceiptTable
        receipts={filteredReceipts}
        ownerNames={ownerNameMap}
        communityNames={communityNameMap}
        ownerOptions={ownerOptions}
      />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Provider,
  ProviderExpense,
  CATEGORY_LABELS,
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
} from "@/types/proveedores";
import { ExpenseStatusChip } from "./expense-status-chip";
import { filterExpenses } from "@/lib/proveedores/filter-logic";
import { ProviderFiltersState } from "./provider-filters";
import { formatCentsToEuros, formatDate } from "@/lib/utils";
import { FormSelect } from "@/components/ui/form-select";
import { Input } from "@/components/ui/input";
import styles from "./provider-ledger.module.css";

const DEFAULT_FILTERS: ProviderFiltersState = {
  communityId: "",
  providerId: "",
  category: "all",
  status: "all",
  dateFrom: "",
  dateTo: "",
};

interface ProviderLedgerProps {
  provider: Provider;
  expenses: ProviderExpense[];
  communityNames: Record<string, string>;
  communityOptions: { id: string; name: string }[];
}

export function ProviderLedger({
  provider,
  expenses,
  communityNames,
  communityOptions,
}: ProviderLedgerProps) {
  const [filters, setFilters] = useState<ProviderFiltersState>(DEFAULT_FILTERS);

  const filteredExpenses = useMemo(() => {
    return filterExpenses(
      expenses,
      { ...filters, providerId: provider.id },
    ) as ProviderExpense[];
  }, [expenses, filters, provider.id]);

  const uniqueCommunityNames = useMemo(() => {
    return Array.from(
      new Set(expenses.map((e) => communityNames[e.communityId] ?? e.communityId)),
    ).join(", ");
  }, [expenses, communityNames]);

  const totals = useMemo(() => {
    return filteredExpenses.reduce(
      (acc, e) => ({
        total: acc.total + e.amountCents,
        paid: acc.paid + (e.paymentStatus === "paid" ? e.amountCents : 0),
        pending:
          acc.pending +
          (e.paymentStatus === "pending" || e.paymentStatus === "overdue"
            ? e.amountCents
            : 0),
      }),
      { total: 0, paid: 0, pending: 0 },
    );
  }, [filteredExpenses]);

  const handleFilterChange = (
    field: keyof ProviderFiltersState,
    value: string,
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const categoryDisplay =
    CATEGORY_OPTIONS.find((o) => o.value === filters.category)?.label ??
    "Categoría";
  const statusDisplay =
    STATUS_OPTIONS.find((o) => o.value === filters.status)?.label ?? "Estado";
  const communityDisplay = filters.communityId
    ? communityOptions.find((c) => c.id === filters.communityId)?.name ??
      "Comunidad"
    : "Todas";

  return (
    <div className={styles.ledger}>
      <div className={styles.header}>
        <div className={styles.providerInfo}>
          <h2 className={styles.providerName}>{provider.businessName}</h2>
          <p className={styles.taxIdRef}>CIF: {provider.taxId}</p>
          {uniqueCommunityNames && (
            <p className={styles.communityRef}>
              Comunidades: {uniqueCommunityNames}
            </p>
          )}
        </div>
        <Link href="/proveedores" className={styles.backLink}>
          ← Volver a Proveedores
        </Link>
      </div>

      <div className={styles.filtersBar}>
        {/* Community Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Comunidad
          </label>
          <FormSelect
            value={filters.communityId}
            onChange={(e) => handleFilterChange("communityId", e.target.value)}
            className="w-[180px]"
          >
            <option value="">Todas</option>
            {communityOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </FormSelect>
        </div>

        {/* Category Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Categoría
          </label>
          <FormSelect
            value={filters.category}
            onChange={(e) =>
              handleFilterChange(
                "category",
                e.target.value as ProviderFiltersState["category"],
              )
            }
            className="w-[160px]"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </FormSelect>
        </div>

        {/* Status Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Estado
          </label>
          <FormSelect
            value={filters.status}
            onChange={(e) =>
              handleFilterChange(
                "status",
                e.target.value as ProviderFiltersState["status"],
              )
            }
            className="w-[140px]"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </FormSelect>
        </div>

        {/* Date From */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Desde
          </label>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            className="w-[150px]"
          />
        </div>

        {/* Date To */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Hasta</label>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            className="w-[150px]"
          />
        </div>
      </div>

      <div className={styles.totalsBar}>
        <div className={styles.totalItem}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.totalValue}>
            {formatCentsToEuros(totals.total)}
          </span>
        </div>
        <div className={styles.totalItem}>
          <span className={styles.totalLabel}>Pagado</span>
          <span className={`${styles.totalValue} ${styles.paid}`}>
            {formatCentsToEuros(totals.paid)}
          </span>
        </div>
        <div className={styles.totalItem}>
          <span className={styles.totalLabel}>Pendiente</span>
          <span className={`${styles.totalValue} ${styles.pending}`}>
            {formatCentsToEuros(totals.pending)}
          </span>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {filteredExpenses.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay gastos registrados para este proveedor.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Factura</th>
                <th>Comunidad</th>
                <th>Concepto</th>
                <th>Categoría</th>
                <th>Fecha emisión</th>
                <th>Fecha vencimiento</th>
                <th className={styles.amountCol}>Importe</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense, index) => (
                <tr
                  key={expense.id}
                  className={index % 2 === 1 ? styles.zebra : ""}
                >
                  <td>{expense.invoiceNumber ?? expense.id}</td>
                  <td>
                    {communityNames[expense.communityId] ??
                      expense.communityId}
                  </td>
                  <td className={styles.concept}>{expense.concept}</td>
                  <td>
                    {CATEGORY_LABELS[expense.category] ?? expense.category}
                  </td>
                  <td>{formatDate(expense.issueDate)}</td>
                  <td>{formatDate(expense.dueDate)}</td>
                  <td className={`${styles.amountCol} ${styles.amount}`}>
                    {formatCentsToEuros(expense.amountCents)}
                  </td>
                  <td>
                    <ExpenseStatusChip status={expense.paymentStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

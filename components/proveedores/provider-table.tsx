import Link from "next/link";
import { ProviderExpense, CATEGORY_LABELS } from "@/types/proveedores";
import { ExpenseStatusChip } from "./expense-status-chip";
import { ExpenseFormDialog } from "./expense-form-dialog";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { deleteExpense } from "@/app/proveedores/expense-actions";
import { formatCentsToEuros, formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProviderTableProps {
  expenses: ProviderExpense[];
  providerNames: Record<string, string>;
  communityNames: Record<string, string>;
  providerOptions: { id: string; businessName: string }[];
  communityOptions: { id: string; name: string }[];
}

export function ProviderTable({
  expenses,
  providerNames,
  communityNames,
  providerOptions,
  communityOptions,
}: ProviderTableProps) {
  if (expenses.length === 0) {
    return (
      <div
        className="text-center py-12 text-muted-foreground border rounded-lg"
        style={{ backgroundColor: "#ffffff", borderColor: "var(--border)" }}
      >
        <p>No se encontraron gastos con los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <div
      className="border rounded-lg overflow-hidden"
      style={{ borderColor: "var(--border)", backgroundColor: "#ffffff" }}
    >
      <Table>
        <TableHeader>
          <TableRow
            className="border-b"
            style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}
          >
            <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
              Factura
            </TableHead>
            <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
              Proveedor
            </TableHead>
            <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
              Comunidad
            </TableHead>
            <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
              Concepto
            </TableHead>
            <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
              Categoría
            </TableHead>
            <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
              Fecha emisión
            </TableHead>
            <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
              Fecha vencimiento
            </TableHead>
            <TableHead className="font-heading text-right font-semibold uppercase text-xs tracking-wider h-11">
              Importe
            </TableHead>
            <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
              Estado
            </TableHead>
            <TableHead className="font-heading text-right font-semibold uppercase text-xs tracking-wider h-11">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow
              key={expense.id}
              className="border-b transition-colors hover:bg-muted/50"
              style={{ borderColor: "var(--border)" }}
            >
              <TableCell className="py-3 font-mono text-sm">
                {expense.invoiceNumber ?? expense.id}
              </TableCell>
              <TableCell className="py-3">
                <Link
                  href={`/proveedores/${expense.providerId}/mayor`}
                  className="font-medium hover:underline"
                  style={{ color: "#1e3648" }}
                >
                  {providerNames[expense.providerId] ?? expense.providerId}
                </Link>
              </TableCell>
              <TableCell className="py-3">
                {communityNames[expense.communityId] ?? expense.communityId}
              </TableCell>
              <TableCell className="py-3 max-w-[200px] truncate">
                {expense.concept}
              </TableCell>
              <TableCell className="py-3">
                {CATEGORY_LABELS[expense.category] ?? expense.category}
              </TableCell>
              <TableCell className="py-3 text-sm text-muted-foreground">
                {formatDate(expense.issueDate)}
              </TableCell>
              <TableCell className="py-3 text-sm text-muted-foreground">
                {formatDate(expense.dueDate)}
              </TableCell>
              <TableCell className="py-3 text-right tabular-nums font-medium">
                {formatCentsToEuros(expense.amountCents)}
              </TableCell>
              <TableCell className="py-3">
                <ExpenseStatusChip status={expense.paymentStatus} />
              </TableCell>
              <TableCell className="py-3">
                <div className="flex items-center justify-end gap-1">
                  <ExpenseFormDialog
                    providers={providerOptions}
                    communities={communityOptions}
                    expense={{
                      id: expense.id,
                      providerId: expense.providerId,
                      communityId: expense.communityId,
                      issueDate: expense.issueDate,
                      dueDate: expense.dueDate,
                      concept: expense.concept,
                      amountCents: expense.amountCents,
                      paymentStatus: expense.paymentStatus,
                      category: expense.category,
                      invoiceNumber: expense.invoiceNumber,
                    }}
                  />
                  <ConfirmDeleteDialog
                    title="Borrar gasto"
                    name={expense.concept}
                    onConfirm={() => deleteExpense(expense.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import Link from "next/link";
import { Receipt } from "@/types/recibos";
import { StatusChip } from "./status-chip";
import { ReceiptFormDialog } from "./receipt-form-dialog";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { deleteReceipt } from "@/app/recibos/actions";
import { formatCentsToEuros, formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ReceiptTableProps {
  receipts: Receipt[];
  ownerNames: Record<string, string>;
  communityNames: Record<string, string>;
  ownerOptions: { id: string; displayName: string }[];
}

export function ReceiptTable({
  receipts,
  ownerNames,
  communityNames,
  ownerOptions,
}: ReceiptTableProps) {
  if (receipts.length === 0) {
    return (
      <div
        className="text-center py-12 text-muted-foreground border rounded-lg"
        style={{ backgroundColor: "#ffffff", borderColor: "var(--border)" }}
      >
        <p>No se encontraron recibos con los filtros seleccionados.</p>
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
              Nº Recibo
            </TableHead>
            <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
              Tipo
            </TableHead>
            <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
              Propietario
            </TableHead>
            <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
              Comunidad
            </TableHead>
            <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
              Concepto
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
          {receipts.map((receipt) => (
            <TableRow
              key={receipt.id}
              className="border-b transition-colors hover:bg-muted/50"
              style={{ borderColor: "var(--border)" }}
            >
              <TableCell className="py-3 font-mono text-sm">
                {receipt.receiptNumber}
              </TableCell>
              <TableCell className="py-3">
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor:
                      receipt.type === "ordinary" ? "#0d9488/10" : "#d97706/10",
                    color:
                      receipt.type === "ordinary" ? "#0d9488" : "#d97706",
                  }}
                >
                  {receipt.type === "ordinary" ? "Ord." : "Extraord."}
                </span>
              </TableCell>
              <TableCell className="py-3">
                <Link
                  href={`/propietarios/${receipt.ownerId}/mayor`}
                  className="font-medium hover:underline"
                  style={{ color: "#1e3648" }}
                >
                  {ownerNames[receipt.ownerId] ?? receipt.ownerId}
                </Link>
              </TableCell>
              <TableCell className="py-3">
                {communityNames[receipt.communityId] ?? receipt.communityId}
              </TableCell>
              <TableCell className="py-3 max-w-[200px] truncate">
                {receipt.concept}
              </TableCell>
              <TableCell className="py-3 text-sm text-muted-foreground">
                {formatDate(receipt.issueDate)}
              </TableCell>
              <TableCell className="py-3 text-sm text-muted-foreground">
                {formatDate(receipt.dueDate)}
              </TableCell>
              <TableCell className="py-3 text-right tabular-nums font-medium">
                {formatCentsToEuros(receipt.amountCents)}
              </TableCell>
              <TableCell className="py-3">
                <StatusChip status={receipt.status} />
              </TableCell>
              <TableCell className="py-3">
                <div className="flex items-center justify-end gap-1">
                  <ReceiptFormDialog
                    owners={ownerOptions}
                    receipt={{
                      id: receipt.id,
                      receiptNumber: receipt.receiptNumber,
                      type: receipt.type,
                      ownerId: receipt.ownerId,
                      issueDate: receipt.issueDate,
                      dueDate: receipt.dueDate,
                      periodLabel: receipt.periodLabel,
                      concept: receipt.concept,
                      amountCents: receipt.amountCents,
                      status: receipt.status,
                    }}
                  />
                  <ConfirmDeleteDialog
                    title="Borrar recibo"
                    name={receipt.receiptNumber}
                    onConfirm={() => deleteReceipt(receipt.id)}
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

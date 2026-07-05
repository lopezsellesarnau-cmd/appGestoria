"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/form-select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { ReceiptType, ReceiptStatus } from "@/types/recibos";
import { centsToEurosInput } from "@/lib/utils";
import {
  createReceipt,
  updateReceipt,
  type ActionResult,
} from "@/app/recibos/actions";

const TYPE_LABELS: Record<ReceiptType, string> = {
  ordinary: "Ordinario",
  extraordinary: "Extraordinario",
};

const STATUS_LABELS: Record<ReceiptStatus, string> = {
  paid: "Pagado",
  pending: "Pendiente",
  claimed: "Reclamado",
  judicial: "Judicial",
};

export interface ReceiptFormValues {
  id: string;
  receiptNumber: string;
  type: ReceiptType;
  ownerId: string;
  issueDate: string;
  dueDate: string;
  periodLabel: string;
  concept: string;
  amountCents: number;
  status: ReceiptStatus;
}

interface ReceiptFormDialogProps {
  owners: { id: string; displayName: string }[];
  receipt?: ReceiptFormValues;
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear recibo"}
    </Button>
  );
}

export function ReceiptFormDialog({ owners, receipt }: ReceiptFormDialogProps) {
  const isEdit = Boolean(receipt);
  const [open, setOpen] = useState(false);

  const action = isEdit ? updateReceipt.bind(null, receipt!.id) : createReceipt;
  const [state, formAction] = useFormState<ActionResult | null, FormData>(
    action,
    null,
  );

  useEffect(() => {
    if (state?.ok) setOpen(false);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isEdit ? (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Editar recibo"
          onClick={() => setOpen(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo recibo
        </Button>
      )}
      <DialogContent className="max-w-lg">
        <DialogTitle>{isEdit ? "Editar recibo" : "Nuevo recibo"}</DialogTitle>
        <DialogDescription>
          La comunidad se asigna automáticamente según el propietario.
        </DialogDescription>

        <form action={formAction} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="receipt_number" className="text-sm font-medium">
                Nº recibo
              </label>
              <Input
                id="receipt_number"
                name="receipt_number"
                defaultValue={receipt?.receiptNumber}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="type" className="text-sm font-medium">
                Tipo
              </label>
              <FormSelect
                id="type"
                name="type"
                defaultValue={receipt?.type ?? "ordinary"}
                required
              >
                {(Object.keys(TYPE_LABELS) as ReceiptType[]).map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABELS[t]}
                  </option>
                ))}
              </FormSelect>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="owner_id" className="text-sm font-medium">
              Propietario
            </label>
            <FormSelect
              id="owner_id"
              name="owner_id"
              defaultValue={receipt?.ownerId ?? ""}
              required
            >
              <option value="" disabled>
                Selecciona un propietario…
              </option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.displayName}
                </option>
              ))}
            </FormSelect>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="issue_date" className="text-sm font-medium">
                Fecha emisión
              </label>
              <Input
                id="issue_date"
                name="issue_date"
                type="date"
                defaultValue={receipt?.issueDate}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="due_date" className="text-sm font-medium">
                Fecha vencimiento
              </label>
              <Input
                id="due_date"
                name="due_date"
                type="date"
                defaultValue={receipt?.dueDate}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="period_label" className="text-sm font-medium">
                Período
              </label>
              <Input
                id="period_label"
                name="period_label"
                placeholder="Enero 2026"
                defaultValue={receipt?.periodLabel}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="amount" className="text-sm font-medium">
                Importe (€)
              </label>
              <Input
                id="amount"
                name="amount"
                inputMode="decimal"
                placeholder="0,00"
                defaultValue={
                  receipt ? centsToEurosInput(receipt.amountCents) : ""
                }
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="concept" className="text-sm font-medium">
              Concepto
            </label>
            <Input
              id="concept"
              name="concept"
              defaultValue={receipt?.concept}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="status" className="text-sm font-medium">
              Estado
            </label>
            <FormSelect
              id="status"
              name="status"
              defaultValue={receipt?.status ?? "pending"}
              required
            >
              {(Object.keys(STATUS_LABELS) as ReceiptStatus[]).map((st) => (
                <option key={st} value={st}>
                  {STATUS_LABELS[st]}
                </option>
              ))}
            </FormSelect>
          </div>

          {state && !state.ok && (
            <p className="text-sm" style={{ color: "#c0392b" }}>
              {state.error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              }
            />
            <SubmitButton isEdit={isEdit} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

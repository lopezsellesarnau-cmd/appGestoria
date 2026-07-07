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
import {
  ProviderExpenseCategory,
  ProviderExpenseStatus,
  CATEGORY_LABELS,
} from "@/types/proveedores";
import { centsToEurosInput } from "@/lib/utils";
import {
  createExpense,
  updateExpense,
  type ActionResult,
} from "@/app/proveedores/expense-actions";

const STATUS_LABELS: Record<ProviderExpenseStatus, string> = {
  paid: "Pagado",
  pending: "Pendiente",
  overdue: "Vencido",
};

export interface ExpenseFormValues {
  id: string;
  providerId: string;
  communityId: string;
  issueDate: string;
  dueDate: string;
  concept: string;
  amountCents: number;
  paymentStatus: ProviderExpenseStatus;
  category: ProviderExpenseCategory;
  invoiceNumber?: string;
}

interface ExpenseFormDialogProps {
  providers: { id: string; businessName: string }[];
  communities: { id: string; name: string }[];
  expense?: ExpenseFormValues;
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear gasto"}
    </Button>
  );
}

export function ExpenseFormDialog({
  providers,
  communities,
  expense,
}: ExpenseFormDialogProps) {
  const isEdit = Boolean(expense);
  const [open, setOpen] = useState(false);

  const action = isEdit ? updateExpense.bind(null, expense!.id) : createExpense;
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
          aria-label="Editar gasto"
          onClick={() => setOpen(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo gasto
        </Button>
      )}
      <DialogContent className="max-w-lg">
        <DialogTitle>{isEdit ? "Editar gasto" : "Nuevo gasto"}</DialogTitle>
        <DialogDescription>
          Datos de la factura del proveedor.
        </DialogDescription>

        <form action={formAction} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="provider_id" className="text-sm font-medium">
                Proveedor
              </label>
              <FormSelect
                id="provider_id"
                name="provider_id"
                defaultValue={expense?.providerId ?? ""}
                required
              >
                <option value="" disabled>
                  Selecciona…
                </option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.businessName}
                  </option>
                ))}
              </FormSelect>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="community_id" className="text-sm font-medium">
                Comunidad
              </label>
              <FormSelect
                id="community_id"
                name="community_id"
                defaultValue={expense?.communityId ?? ""}
                required
              >
                <option value="" disabled>
                  Selecciona…
                </option>
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </FormSelect>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="concept" className="text-sm font-medium">
              Concepto
            </label>
            <Input
              id="concept"
              name="concept"
              defaultValue={expense?.concept}
              required
            />
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
                defaultValue={expense?.issueDate}
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
                defaultValue={expense?.dueDate}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                  expense ? centsToEurosInput(expense.amountCents) : ""
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="invoice_number" className="text-sm font-medium">
                Nº factura (opcional)
              </label>
              <Input
                id="invoice_number"
                name="invoice_number"
                defaultValue={expense?.invoiceNumber ?? ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="category" className="text-sm font-medium">
                Categoría
              </label>
              <FormSelect
                id="category"
                name="category"
                defaultValue={expense?.category ?? ""}
                required
              >
                <option value="" disabled>
                  Selecciona…
                </option>
                {(
                  Object.keys(CATEGORY_LABELS) as ProviderExpenseCategory[]
                ).map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="payment_status" className="text-sm font-medium">
                Estado
              </label>
              <FormSelect
                id="payment_status"
                name="payment_status"
                defaultValue={expense?.paymentStatus ?? "pending"}
                required
              >
                {(
                  Object.keys(STATUS_LABELS) as ProviderExpenseStatus[]
                ).map((st) => (
                  <option key={st} value={st}>
                    {STATUS_LABELS[st]}
                  </option>
                ))}
              </FormSelect>
            </div>
          </div>

          {state && !state.ok && (
            <p className="text-sm text-destructive">
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

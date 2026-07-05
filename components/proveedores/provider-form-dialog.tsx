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
  createProvider,
  updateProvider,
  type ActionResult,
} from "@/app/proveedores/actions";

export interface ProviderFormValues {
  id: string;
  businessName: string;
  taxId: string;
  communityId: string;
  isActive: boolean;
}

interface ProviderFormDialogProps {
  communities: { id: string; name: string }[];
  provider?: ProviderFormValues;
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear proveedor"}
    </Button>
  );
}

export function ProviderFormDialog({
  communities,
  provider,
}: ProviderFormDialogProps) {
  const isEdit = Boolean(provider);
  const [open, setOpen] = useState(false);

  const action = isEdit
    ? updateProvider.bind(null, provider!.id)
    : createProvider;
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
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <Pencil className="h-4 w-4" />
          Editar
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo proveedor
        </Button>
      )}
      <DialogContent>
        <DialogTitle>
          {isEdit ? "Editar proveedor" : "Nuevo proveedor"}
        </DialogTitle>
        <DialogDescription>Datos del proveedor.</DialogDescription>

        <form action={formAction} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="business_name" className="text-sm font-medium">
              Nombre comercial
            </label>
            <Input
              id="business_name"
              name="business_name"
              defaultValue={provider?.businessName}
              autoFocus
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tax_id" className="text-sm font-medium">
              CIF / NIF
            </label>
            <Input
              id="tax_id"
              name="tax_id"
              defaultValue={provider?.taxId}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="community_id" className="text-sm font-medium">
              Comunidad
            </label>
            <FormSelect
              id="community_id"
              name="community_id"
              defaultValue={provider?.communityId ?? ""}
              required
            >
              <option value="" disabled>
                Selecciona una comunidad…
              </option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </FormSelect>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={provider ? provider.isActive : true}
              className="h-4 w-4"
            />
            Activo
          </label>

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

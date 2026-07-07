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
  createOwner,
  updateOwner,
  type ActionResult,
} from "@/app/propietarios/actions";

export interface OwnerFormValues {
  id: string;
  displayName: string;
  unitReference: string;
  communityId: string;
}

interface OwnerFormDialogProps {
  communities: { id: string; name: string }[];
  owner?: OwnerFormValues;
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear propietario"}
    </Button>
  );
}

export function OwnerFormDialog({ communities, owner }: OwnerFormDialogProps) {
  const isEdit = Boolean(owner);
  const [open, setOpen] = useState(false);

  const action = isEdit ? updateOwner.bind(null, owner!.id) : createOwner;
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
          aria-label={`Editar ${owner!.displayName}`}
          onClick={() => setOpen(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo propietario
        </Button>
      )}
      <DialogContent>
        <DialogTitle>
          {isEdit ? "Editar propietario" : "Nuevo propietario"}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Modifica los datos del propietario."
            : "Introduce los datos del nuevo propietario."}
        </DialogDescription>

        <form action={formAction} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="display_name" className="text-sm font-medium">
              Nombre
            </label>
            <Input
              id="display_name"
              name="display_name"
              defaultValue={owner?.displayName}
              autoFocus
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="unit_reference" className="text-sm font-medium">
              Unidad
            </label>
            <Input
              id="unit_reference"
              name="unit_reference"
              defaultValue={owner?.unitReference}
              placeholder="1ºA"
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
              defaultValue={owner?.communityId ?? ""}
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

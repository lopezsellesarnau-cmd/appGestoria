"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  createCommunity,
  updateCommunity,
  type ActionResult,
} from "@/app/comunidades/actions";

export interface CommunityFormValues {
  id: string;
  name: string;
  municipality: string;
}

interface CommunityFormDialogProps {
  /** Si se pasa, el diálogo edita esa comunidad; si no, crea una nueva. */
  community?: CommunityFormValues;
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear comunidad"}
    </Button>
  );
}

export function CommunityFormDialog({ community }: CommunityFormDialogProps) {
  const isEdit = Boolean(community);
  const [open, setOpen] = useState(false);

  const action = isEdit
    ? updateCommunity.bind(null, community!.id)
    : createCommunity;
  const [state, formAction] = useFormState<ActionResult | null, FormData>(
    action,
    null,
  );

  // Cierra el diálogo cuando la acción termina con éxito.
  useEffect(() => {
    if (state?.ok) setOpen(false);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isEdit ? (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Editar ${community!.name}`}
          onClick={() => setOpen(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Nueva comunidad
        </Button>
      )}
      <DialogContent>
        <DialogTitle>
          {isEdit ? "Editar comunidad" : "Nueva comunidad"}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Modifica los datos de la comunidad."
            : "Introduce los datos de la nueva comunidad."}
        </DialogDescription>

        <form action={formAction} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Nombre
            </label>
            <Input
              id="name"
              name="name"
              defaultValue={community?.name}
              placeholder="Comunidad Residencial…"
              autoFocus
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="municipality" className="text-sm font-medium">
              Municipio
            </label>
            <Input
              id="municipality"
              name="municipality"
              defaultValue={community?.municipality}
              placeholder="Valencia"
              required
            />
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

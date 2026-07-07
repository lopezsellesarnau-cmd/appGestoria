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
  createTracking,
  updateTracking,
  type ActionResult,
} from "@/app/incidencias/actions";

export interface TrackingFormValues {
  id: string;
  externalRef: string;
  trackingTypeId: string;
  contactId: string;
  communityId: string;
  notes: string | null;
}

interface TrackingFormDialogProps {
  trackingTypes: { id: string; name: string }[];
  contacts: { id: string; name: string }[];
  communities: { id: string; name: string }[];
  tracking?: TrackingFormValues;
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending
        ? "Guardando…"
        : isEdit
          ? "Guardar cambios"
          : "Crear seguimiento"}
    </Button>
  );
}

export function TrackingFormDialog({
  trackingTypes,
  contacts,
  communities,
  tracking,
}: TrackingFormDialogProps) {
  const isEdit = Boolean(tracking);
  const [open, setOpen] = useState(false);

  const action = isEdit
    ? updateTracking.bind(null, tracking!.id)
    : createTracking;
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
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Pencil className="h-4 w-4" />
          Editar
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Nueva incidencia
        </Button>
      )}
      <DialogContent className="max-w-lg">
        <DialogTitle>
          {isEdit ? "Editar seguimiento" : "Nueva incidencia"}
        </DialogTitle>
        <DialogDescription>
          Seguimiento de un presupuesto de proveedor o un siniestro con agente.
        </DialogDescription>

        <form action={formAction} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="external_ref" className="text-sm font-medium">
              Referencia externa
            </label>
            <Input
              id="external_ref"
              name="external_ref"
              placeholder="Nº de siniestro, código de presupuesto…"
              defaultValue={tracking?.externalRef}
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="tracking_type_id" className="text-sm font-medium">
                Tipo
              </label>
              <FormSelect
                id="tracking_type_id"
                name="tracking_type_id"
                defaultValue={tracking?.trackingTypeId ?? ""}
                required
              >
                <option value="" disabled>
                  Selecciona…
                </option>
                {trackingTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
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
                defaultValue={tracking?.communityId ?? ""}
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
            <label htmlFor="contact_id" className="text-sm font-medium">
              Contacto
            </label>
            <FormSelect
              id="contact_id"
              name="contact_id"
              defaultValue={tracking?.contactId ?? ""}
              required
            >
              <option value="" disabled>
                Selecciona un contacto…
              </option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </FormSelect>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="notes" className="text-sm font-medium">
              Notas (opcional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={tracking?.notes ?? ""}
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
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

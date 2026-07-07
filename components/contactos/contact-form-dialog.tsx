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
import { ContactType, CONTACT_TYPE_LABELS } from "@/types/contactos";
import {
  createContact,
  updateContact,
  type ActionResult,
} from "@/app/contactos/actions";

export interface ContactFormValues {
  id: string;
  name: string;
  email: string;
  type: ContactType;
  communityId: string | null;
  providerId: string | null;
}

interface ContactFormDialogProps {
  communities: { id: string; name: string }[];
  providers: { id: string; businessName: string }[];
  contact?: ContactFormValues;
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear contacto"}
    </Button>
  );
}

export function ContactFormDialog({
  communities,
  providers,
  contact,
}: ContactFormDialogProps) {
  const isEdit = Boolean(contact);
  const [open, setOpen] = useState(false);

  const action = isEdit ? updateContact.bind(null, contact!.id) : createContact;
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
          aria-label={`Editar ${contact!.name}`}
          onClick={() => setOpen(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo contacto
        </Button>
      )}
      <DialogContent>
        <DialogTitle>
          {isEdit ? "Editar contacto" : "Nuevo contacto"}
        </DialogTitle>
        <DialogDescription>
          Persona que recibe los emails de seguimiento.
        </DialogDescription>

        <form action={formAction} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Nombre
            </label>
            <Input
              id="name"
              name="name"
              defaultValue={contact?.name}
              autoFocus
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={contact?.email}
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
              defaultValue={contact?.type ?? ""}
              required
            >
              <option value="" disabled>
                Selecciona…
              </option>
              {(Object.keys(CONTACT_TYPE_LABELS) as ContactType[]).map((t) => (
                <option key={t} value={t}>
                  {CONTACT_TYPE_LABELS[t]}
                </option>
              ))}
            </FormSelect>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="community_id" className="text-sm font-medium">
                Comunidad (opcional)
              </label>
              <FormSelect
                id="community_id"
                name="community_id"
                defaultValue={contact?.communityId ?? ""}
              >
                <option value="">—</option>
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="provider_id" className="text-sm font-medium">
                Proveedor (opcional)
              </label>
              <FormSelect
                id="provider_id"
                name="provider_id"
                defaultValue={contact?.providerId ?? ""}
              >
                <option value="">—</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.businessName}
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

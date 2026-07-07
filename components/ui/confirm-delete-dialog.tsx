"use client";

import { useState, useTransition } from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type DeleteResult = { ok: true } | { ok: false; error: string };

interface ConfirmDeleteDialogProps {
  /** Texto del título, p. ej. "Borrar propietario". */
  title: string;
  /** Nombre del elemento a borrar (se muestra en negrita). */
  name: string;
  /** Acción de borrado; recibe el control tras confirmar. */
  onConfirm: () => Promise<DeleteResult>;
}

export function ConfirmDeleteDialog({
  title,
  name,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const res = await onConfirm();
      if (res.ok) setOpen(false);
      else setError(res.error);
    });
  }

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label={`${title}: ${name}`}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        }
      />
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <AlertDialog.Popup
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-white p-6 shadow-lg outline-none transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0"
          style={{ borderColor: "var(--border)" }}
        >
          <AlertDialog.Title
            className="text-lg font-semibold"
            style={{ color: "#1a1a2e" }}
          >
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-1 text-sm text-muted-foreground">
            ¿Seguro que quieres borrar <strong>{name}</strong>? Esta acción no se
            puede deshacer.
          </AlertDialog.Description>

          {error && (
            <p className="mt-3 text-sm">
              {error}
            </p>
          )}

          <div className="mt-5 flex justify-end gap-2">
            <AlertDialog.Close
              render={
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              }
            />
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirm}
              disabled={pending}
            >
              {pending ? "Borrando…" : "Borrar"}
            </Button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

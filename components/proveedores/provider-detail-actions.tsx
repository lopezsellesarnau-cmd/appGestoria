"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  ProviderFormDialog,
  type ProviderFormValues,
} from "./provider-form-dialog";
import { deleteProvider } from "@/app/proveedores/actions";

interface ProviderDetailActionsProps {
  provider: ProviderFormValues;
  communities: { id: string; name: string }[];
}

export function ProviderDetailActions({
  provider,
  communities,
}: ProviderDetailActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const res = await deleteProvider(provider.id);
      if (res.ok) {
        setOpen(false);
        router.push("/proveedores");
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <ProviderFormDialog communities={communities} provider={provider} />

      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Trigger
          render={
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
              Borrar
            </Button>
          }
        />
        <AlertDialog.Portal>
          <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
          <AlertDialog.Popup
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-white p-6 shadow-lg outline-none"
            style={{ borderColor: "var(--border)" }}
          >
            <AlertDialog.Title
              className="text-lg font-semibold"
              style={{ color: "#1a1a2e" }}
            >
              Borrar proveedor
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-1 text-sm text-muted-foreground">
              ¿Seguro que quieres borrar <strong>{provider.businessName}</strong>?
              Esta acción no se puede deshacer.
            </AlertDialog.Description>

            {error && (
              <p className="mt-3 text-sm" style={{ color: "#c0392b" }}>
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
                onClick={handleDelete}
                disabled={pending}
              >
                {pending ? "Borrando…" : "Borrar"}
              </Button>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/form-select";
import {
  TrackingFormDialog,
  type TrackingFormValues,
} from "./tracking-form-dialog";
import {
  TrackingStatus,
  TRACKING_STATUS_LABELS,
} from "@/types/incidencias";
import {
  registerResponse,
  changeStatus,
  addNote,
  deleteTracking,
} from "@/app/incidencias/actions";

interface TrackingDetailActionsProps {
  tracking: TrackingFormValues;
  status: TrackingStatus;
  trackingTypes: { id: string; name: string }[];
  contacts: { id: string; name: string }[];
  communities: { id: string; name: string }[];
}

const STATUSES: TrackingStatus[] = [
  "pending",
  "responded",
  "closed",
  "overdue",
];

export function TrackingDetailActions({
  tracking,
  status,
  trackingTypes,
  contacts,
  communities,
}: TrackingDetailActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error ?? "Error");
    });
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const res = await deleteTracking(tracking.id);
      if (res.ok) router.push("/incidencias");
      else setError(res.error);
    });
  }

  function handleAddNote() {
    if (!note.trim()) return;
    setError(null);
    startTransition(async () => {
      const res = await addNote(tracking.id, note);
      if (res.ok) setNote("");
      else setError(res.error);
    });
  }

  return (
    <div
      className="rounded-lg border p-4 space-y-4"
      style={{ borderColor: "var(--border)", backgroundColor: "#ffffff" }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => run(() => registerResponse(tracking.id))}
        >
          <Check className="h-4 w-4" />
          Registrar respuesta
        </Button>

        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted-foreground">Estado:</span>
          <FormSelect
            value={status}
            disabled={pending}
            onChange={(e) =>
              run(() =>
                changeStatus(tracking.id, e.target.value as TrackingStatus),
              )
            }
            className="w-[150px]"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {TRACKING_STATUS_LABELS[s]}
              </option>
            ))}
          </FormSelect>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <TrackingFormDialog
            trackingTypes={trackingTypes}
            contacts={contacts}
            communities={communities}
            tracking={tracking}
          />
          <Button
            variant="destructive"
            size="sm"
            disabled={pending}
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            Borrar
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Añadir una nota al historial…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddNote();
            }
          }}
        />
        <Button
          variant="outline"
          size="sm"
          disabled={pending || !note.trim()}
          onClick={handleAddNote}
        >
          Añadir nota
        </Button>
      </div>

      {error && (
        <p className="text-sm" style={{ color: "#c0392b" }}>
          {error}
        </p>
      )}
    </div>
  );
}

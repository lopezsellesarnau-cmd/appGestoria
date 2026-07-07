"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FormSelect } from "@/components/ui/form-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrackingStatus,
  TRACKING_STATUS_LABELS,
} from "@/types/incidencias";
import { formatDate } from "@/lib/utils";
import { TrackingFormDialog } from "./tracking-form-dialog";

const STATUS_VARIANT: Record<
  TrackingStatus,
  "warning" | "success" | "outline" | "destructive"
> = {
  pending: "warning",
  responded: "success",
  closed: "outline",
  overdue: "destructive",
};

export interface TrackingRow {
  id: string;
  externalRef: string;
  trackingTypeId: string;
  typeName: string;
  contactName: string;
  communityId: string;
  communityName: string;
  status: TrackingStatus;
  reminderCount: number;
  lastResponseAt: string | null;
  createdAt: string;
}

interface TrackingWorkspaceProps {
  rows: TrackingRow[];
  trackingTypes: { id: string; name: string }[];
  contacts: { id: string; name: string }[];
  communities: { id: string; name: string }[];
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Todos los estados" },
  { value: "pending", label: "Pendiente" },
  { value: "responded", label: "Respondido" },
  { value: "closed", label: "Cerrado" },
  { value: "overdue", label: "Vencido" },
];

export function TrackingWorkspace({
  rows,
  trackingTypes,
  contacts,
  communities,
}: TrackingWorkspaceProps) {
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [communityFilter, setCommunityFilter] = useState("");

  const typeOptions = useMemo(
    () => [{ id: "", name: "Todos los tipos" }, ...trackingTypes],
    [trackingTypes],
  );
  const communityOptions = useMemo(
    () => [{ id: "", name: "Todas las comunidades" }, ...communities],
    [communities],
  );

  const filtered = rows.filter((r) => {
    if (typeFilter && r.trackingTypeId !== typeFilter) return false;
    if (statusFilter && r.status !== statusFilter) return false;
    if (communityFilter && r.communityId !== communityFilter) return false;
    return true;
  });

  const labelFor = (opts: { id: string; name: string }[], id: string) =>
    opts.find((o) => o.id === id)?.name ?? opts[0].name;

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center flex-wrap">
        <FormSelect
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-[190px]"
        >
          {typeOptions.map((o) => (
            <option key={o.id || "all"} value={o.id}>
              {o.name}
            </option>
          ))}
        </FormSelect>

        <FormSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-[180px]"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label}
            </option>
          ))}
        </FormSelect>

        <FormSelect
          value={communityFilter}
          onChange={(e) => setCommunityFilter(e.target.value)}
          className="w-[200px]"
        >
          {communityOptions.map((o) => (
            <option key={o.id || "all"} value={o.id}>
              {o.name}
            </option>
          ))}
        </FormSelect>

        <div className="ml-auto">
          <TrackingFormDialog
            trackingTypes={trackingTypes}
            contacts={contacts}
            communities={communities}
          />
        </div>
      </div>

      <div
        className="border rounded-lg overflow-hidden"
        style={{ borderColor: "var(--border)", backgroundColor: "#ffffff" }}
      >
        <Table>
          <TableHeader>
            <TableRow
              className="border-b"
              style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}
            >
              <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
                Referencia
              </TableHead>
              <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
                Tipo
              </TableHead>
              <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
                Contacto
              </TableHead>
              <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
                Comunidad
              </TableHead>
              <TableHead className="font-heading text-center font-semibold uppercase text-xs tracking-wider h-11">
                Recordatorios
              </TableHead>
              <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
                Última respuesta
              </TableHead>
              <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
                Estado
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No hay incidencias con estos filtros.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow
                  key={r.id}
                  className="border-b transition-colors hover:bg-muted/50"
                  style={{ borderColor: "var(--border)" }}
                >
                  <TableCell className="py-3">
                    <Link
                      href={`/incidencias/${r.id}`}
                      className="font-medium hover:underline"
                      style={{ color: "#1e3648" }}
                    >
                      {r.externalRef}
                    </Link>
                  </TableCell>
                  <TableCell className="py-3">{r.typeName}</TableCell>
                  <TableCell className="py-3">{r.contactName}</TableCell>
                  <TableCell className="py-3">{r.communityName}</TableCell>
                  <TableCell className="py-3 text-center tabular-nums">
                    {r.reminderCount}
                  </TableCell>
                  <TableCell className="py-3 text-sm text-muted-foreground">
                    {r.lastResponseAt ? formatDate(r.lastResponseAt) : "—"}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant={STATUS_VARIANT[r.status]}>
                      {TRACKING_STATUS_LABELS[r.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

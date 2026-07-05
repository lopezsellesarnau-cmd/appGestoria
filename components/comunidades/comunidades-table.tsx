"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { CommunityFormDialog } from "./community-form-dialog";
import { DeleteCommunityDialog } from "./delete-community-dialog";

type StatusFilter = "all" | "has-pending" | "ok";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "has-pending", label: "Con pendientes" },
  { value: "ok", label: "Al día" },
];

export interface CommunityRow {
  id: string;
  name: string;
  municipality: string;
  ownerCount: number;
  pendingCount: number;
  hasPending: boolean;
}

interface ComunidadesTableProps {
  rows: CommunityRow[];
}

export function ComunidadesTable({ rows }: ComunidadesTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [statusDisplay, setStatusDisplay] = useState("Todos");

  const filtered = rows.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.municipality.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (statusFilter === "has-pending" && !c.hasPending) return false;
    if (statusFilter === "ok" && c.hasPending) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre o municipio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val as StatusFilter);
            setStatusDisplay(STATUS_OPTIONS.find((o) => o.value === val)?.label ?? "Estado");
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>{statusDisplay}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto">
          <CommunityFormDialog />
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
                Nombre
              </TableHead>
              <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
                Municipio
              </TableHead>
              <TableHead className="font-heading text-center font-semibold uppercase text-xs tracking-wider h-11">
                Nº Propietarios
              </TableHead>
              <TableHead className="font-heading text-center font-semibold uppercase text-xs tracking-wider h-11">
                Estado
              </TableHead>
              <TableHead className="font-heading text-right font-semibold uppercase text-xs tracking-wider h-11">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  No hay comunidades registradas.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow
                  key={c.id}
                  className="border-b transition-colors hover:bg-muted/50"
                  style={{ borderColor: "var(--border)" }}
                >
                  <TableCell className="py-3">
                    <Link
                      href={`/comunidades/${c.id}`}
                      className="font-medium hover:underline"
                      style={{ color: "#1e3648" }}
                    >
                      {c.name}
                    </Link>
                  </TableCell>
                  <TableCell className="py-3 text-foreground">{c.municipality}</TableCell>
                  <TableCell className="py-3 text-center tabular-nums">{c.ownerCount}</TableCell>
                  <TableCell className="py-3 text-center">
                    <Badge variant={c.hasPending ? "warning" : "success"}>
                      {c.hasPending ? "Pendiente" : "Al día"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center justify-end gap-1">
                      <CommunityFormDialog
                        community={{
                          id: c.id,
                          name: c.name,
                          municipality: c.municipality,
                        }}
                      />
                      <DeleteCommunityDialog id={c.id} name={c.name} />
                    </div>
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

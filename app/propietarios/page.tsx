"use client";

import { useState } from "react";
import Link from "next/link";
import { MainContent } from "@/components/layout/main-content";
import { PROPIETARIOS } from "@/data/propietarios";
import { COMUNIDADES } from "@/data/comunidades";
import { RECIBOS } from "@/data/recibos";
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
import { formatCentsToEuros } from "@/lib/utils";

export default function PropietariosPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "has-debt" | "ok">("all");
  const [statusDisplay, setStatusDisplay] = useState("Todos");

  const STATUS_OPTIONS = [
    { value: "all", label: "Todos" },
    { value: "has-debt", label: "Con deuda" },
    { value: "ok", label: "Al día" },
  ];

  const propietariosWithStats = PROPIETARIOS.map((owner) => {
    const ownerReceipts = RECIBOS.filter((r) => r.ownerId === owner.id);
    const pendingReceipts = ownerReceipts.filter((r) => r.status !== "paid");
    const totalDebt = pendingReceipts.reduce((sum, r) => sum + r.amountCents, 0);
    const community = COMUNIDADES.find((c) => c.id === owner.communityId);

    return {
      ...owner,
      communityName: community?.name ?? owner.communityId,
      pendingCount: pendingReceipts.length,
      totalDebt,
      hasDebt: pendingReceipts.length > 0,
    };
  });

  const filteredPropietarios = propietariosWithStats.filter((owner) => {
    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !owner.displayName.toLowerCase().includes(searchLower) &&
        !owner.unitReference.toLowerCase().includes(searchLower) &&
        !owner.communityName.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    if (statusFilter === "has-debt" && !owner.hasDebt) {
      return false;
    }
    if (statusFilter === "ok" && owner.hasDebt) {
      return false;
    }

    return true;
  });

  return (
    <MainContent title="Propietarios">
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex gap-4 items-center flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre, unidad o comunidad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val as typeof statusFilter);
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
        </div>

        {/* Table */}
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
                  Unidad
                </TableHead>
                <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
                  Comunidad
                </TableHead>
                <TableHead className="font-heading text-center font-semibold uppercase text-xs tracking-wider h-11">
                  Recibos pendientes
                </TableHead>
                <TableHead className="font-heading text-right font-semibold uppercase text-xs tracking-wider h-11">
                  Deuda total
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPropietarios.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No hay propietarios registrados.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPropietarios.map((owner) => (
                  <TableRow
                    key={owner.id}
                    className="border-b transition-colors hover:bg-muted/50"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <TableCell className="py-3">
                      <Link
                        href={`/propietarios/${owner.id}/mayor`}
                        className="font-medium hover:underline"
                        style={{ color: "#1e3648" }}
                      >
                        {owner.displayName}
                      </Link>
                    </TableCell>
                    <TableCell className="py-3">{owner.unitReference}</TableCell>
                    <TableCell className="py-3">{owner.communityName}</TableCell>
                    <TableCell className="py-3 text-center">
                      {owner.pendingCount > 0 ? (
                        <Badge variant="warning">{owner.pendingCount}</Badge>
                      ) : (
                        <Badge variant="success">0</Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-3 text-right tabular-nums font-medium">
                      <span style={{ color: owner.hasDebt ? "#e11d48" : "#0d9488" }}>
                        {formatCentsToEuros(owner.totalDebt)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainContent>
  );
}

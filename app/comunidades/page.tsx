"use client";

import { useState } from "react";
import Link from "next/link";
import { MainContent } from "@/components/layout/main-content";
import { COMUNIDADES } from "@/data/comunidades";
import { PROPIETARIOS } from "@/data/propietarios";
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

export default function ComunidadesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "has-pending" | "ok">("all");
  const [statusDisplay, setStatusDisplay] = useState("Todos");

  const STATUS_OPTIONS = [
    { value: "all", label: "Todos" },
    { value: "has-pending", label: "Con pendientes" },
    { value: "ok", label: "Al día" },
  ];

  const comunidadesWithStats = COMUNIDADES.map((community) => {
    const communityOwners = PROPIETARIOS.filter(
      (p) => p.communityId === community.id
    );
    const communityReceipts = RECIBOS.filter(
      (r) => r.communityId === community.id
    );
    const pendingReceipts = communityReceipts.filter((r) => r.status !== "paid");

    return {
      ...community,
      ownerCount: communityOwners.length,
      pendingCount: pendingReceipts.length,
      hasPending: pendingReceipts.length > 0,
    };
  });

  const filteredComunidades = comunidadesWithStats.filter((community) => {
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !community.name.toLowerCase().includes(searchLower) &&
        !community.municipality.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    // Status filter
    if (statusFilter === "has-pending" && !community.hasPending) {
      return false;
    }
    if (statusFilter === "ok" && community.hasPending) {
      return false;
    }

    return true;
  });

  return (
    <MainContent title="Comunidades">
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex gap-4 items-center flex-wrap">
          {/* Search */}
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
                  Municipio
                </TableHead>
                <TableHead className="font-heading text-center font-semibold uppercase text-xs tracking-wider h-11">
                  Nº Propietarios
                </TableHead>
                <TableHead className="font-heading text-center font-semibold uppercase text-xs tracking-wider h-11">
                  Estado
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComunidades.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No hay comunidades registradas.
                  </TableCell>
                </TableRow>
              ) : (
                filteredComunidades.map((community) => (
                  <TableRow
                    key={community.id}
                    className="border-b transition-colors hover:bg-muted/50"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <TableCell className="py-3">
                      <Link
                        href={`/comunidades/${community.id}`}
                        className="font-medium hover:underline"
                        style={{ color: "#1e3648" }}
                      >
                        {community.name}
                      </Link>
                    </TableCell>
                    <TableCell className="py-3 text-foreground">
                      {community.municipality}
                    </TableCell>
                    <TableCell className="py-3 text-center tabular-nums">
                      {community.ownerCount}
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <Badge
                        variant={community.hasPending ? "warning" : "success"}
                      >
                        {community.hasPending ? "Pendiente" : "Al día"}
                      </Badge>
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

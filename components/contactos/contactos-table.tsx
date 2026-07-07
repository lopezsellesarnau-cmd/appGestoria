"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { ContactType, CONTACT_TYPE_LABELS } from "@/types/contactos";
import { ContactFormDialog } from "./contact-form-dialog";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { deleteContact } from "@/app/contactos/actions";

export interface ContactRow {
  id: string;
  name: string;
  email: string;
  type: ContactType;
  communityId: string | null;
  providerId: string | null;
  communityName: string;
  providerName: string;
}

interface ContactosTableProps {
  rows: ContactRow[];
  communities: { id: string; name: string }[];
  providers: { id: string; businessName: string }[];
}

export function ContactosTable({
  rows,
  communities,
  providers,
}: ContactosTableProps) {
  const [search, setSearch] = useState("");

  const filtered = rows.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="ml-auto">
          <ContactFormDialog communities={communities} providers={providers} />
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
                Email
              </TableHead>
              <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
                Tipo
              </TableHead>
              <TableHead className="font-heading font-semibold uppercase text-xs tracking-wider h-11">
                Vinculado a
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
                  No hay contactos registrados.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow
                  key={c.id}
                  className="border-b transition-colors hover:bg-muted/50"
                  style={{ borderColor: "var(--border)" }}
                >
                  <TableCell className="py-3 font-medium">{c.name}</TableCell>
                  <TableCell className="py-3 text-muted-foreground">
                    {c.email}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant={c.type === "agent" ? "warning" : "success"}>
                      {CONTACT_TYPE_LABELS[c.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-sm text-muted-foreground">
                    {c.providerName || c.communityName || "—"}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center justify-end gap-1">
                      <ContactFormDialog
                        communities={communities}
                        providers={providers}
                        contact={{
                          id: c.id,
                          name: c.name,
                          email: c.email,
                          type: c.type,
                          communityId: c.communityId,
                          providerId: c.providerId,
                        }}
                      />
                      <ConfirmDeleteDialog
                        title="Borrar contacto"
                        name={c.name}
                        onConfirm={() => deleteContact(c.id)}
                      />
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

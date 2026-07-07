"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/auth/actions";

export function Topbar() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/buscar?q=${encodeURIComponent(q)}`);
  }

  return (
    <header
      className="sticky top-3 z-40 flex items-center justify-between px-6 h-16 rounded-[10px] border bg-white"
      style={{ borderColor: "rgba(212,212,212,0.94)" }}
    >
      {/* Search */}
      <form
        onSubmit={onSearchSubmit}
        className="flex items-center gap-3 flex-1 max-w-md"
      >
        <Search className="w-4 h-4 shrink-0" style={{ color: "#5a5a6e" }} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar comunidades, propietarios, recibos..."
          className="flex-1 bg-transparent py-2 text-sm outline-none"
          style={{ color: "#1a1a2e" }}
        />
      </form>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium" style={{ color: "#5a5a6e" }}>
          {email ?? "Admin"}
        </span>
        <form action={logout}>
          <button
            type="submit"
            title="Cerrar sesión"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-neutral-100"
            style={{ color: "#5a5a6e" }}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </form>
      </div>
    </header>
  );
}

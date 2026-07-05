"use client";

import { useEffect, useState } from "react";
import { LogOut, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/auth/actions";

export function Topbar() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-8 h-[60px]"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <Search className="w-4 h-4 shrink-0" style={{ color: "#5a5a6e" }} />
        <input
          type="search"
          placeholder="Buscar comunidades, propietarios, recibos..."
          className="flex-1 bg-transparent py-2 text-sm outline-none"
          style={{ color: "#1a1a2e" }}
          readOnly
        />
      </div>

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

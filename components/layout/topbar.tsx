"use client";

import { Search } from "lucide-react";

export function Topbar() {
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
        <span
          className="text-sm font-medium"
          style={{ color: "#5a5a6e" }}
        >
          Admin
        </span>
      </div>
    </header>
  );
}

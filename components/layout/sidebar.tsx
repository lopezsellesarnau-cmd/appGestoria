"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Receipt,
  Truck,
  TriangleAlert,
  Siren,
  Contact,
  type LucideIcon,
} from "lucide-react";
import { NAV_SECTIONS } from "@/data/navigation";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  "/": LayoutDashboard,
  "/comunidades": Building2,
  "/propietarios": Users,
  "/recibos": Receipt,
  "/proveedores": Truck,
  "/deudores": TriangleAlert,
  "/incidencias": Siren,
  "/contactos": Contact,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="sticky top-3 h-[calc(100vh-1.5rem)] overflow-y-auto flex flex-col shrink-0 rounded-[10px]"
      style={{ backgroundColor: "var(--sidebar)", width: "var(--sidebar-width)" }}
    >
      {/* Logo */}
      <div className="px-5 py-5">
        <span className="text-[15px] font-semibold tracking-tight text-white">
          Fincas Pro
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_SECTIONS.map((section) => {
          const isActive =
            pathname === section.href ||
            (section.href !== "/" && pathname.startsWith(section.href));
          const Icon = ICONS[section.href] ?? LayoutDashboard;

          return (
            <Link
              key={section.href}
              href={section.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-opacity",
                  isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100",
                )}
              />
              {section.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

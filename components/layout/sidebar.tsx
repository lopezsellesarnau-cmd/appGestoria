"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_SECTIONS } from "@/data/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="sticky top-0 h-screen overflow-y-auto flex flex-col shrink-0"
      style={{ backgroundColor: "#0f1a24", width: "var(--sidebar-width)" }}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <span
          className="text-lg font-bold tracking-tight"
          style={{ color: "#ffffff" }}
        >
          Fincas Pro
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3">
        {NAV_SECTIONS.map((section) => {
          const isActive = pathname === section.href ||
            (section.href !== "/" && pathname.startsWith(section.href));

          return (
            <Link
              key={section.label}
              href={section.href}
              className="block px-6 py-2.5 text-sm font-medium transition-all border-l-3"
              style={{
                color: isActive ? "#ffffff" : "#94a3b8",
                backgroundColor: isActive ? "#1e3648" : "transparent",
                borderLeftColor: isActive ? "#1e3648" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "#ffffff";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#94a3b8";
                }
              }}
            >
              {section.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

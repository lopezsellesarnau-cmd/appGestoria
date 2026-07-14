"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Auth pages render standalone, without the sidebar/topbar chrome.
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/auth")
  ) {
    return <>{children}</>;
  }

  return (
    <div
      className="flex min-h-screen gap-3 p-3"
      style={{ backgroundColor: "#f0f0f0" }}
    >
      <Sidebar />
      <div className="flex flex-1 flex-col gap-3 min-w-0">
        <Topbar />
        <main className="flex-1 pb-3">{children}</main>
      </div>
    </div>
  );
}

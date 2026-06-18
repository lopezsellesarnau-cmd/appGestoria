"use client";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 p-6 lg:p-8" style={{ backgroundColor: "#f8f7f4" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

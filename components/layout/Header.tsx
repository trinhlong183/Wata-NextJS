"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
  return (
    <header className="h-16 bg-white border-b flex items-center px-4 shadow-sm justify-between sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <div className="hidden sm:block">
          <h1 className="text-xl font-semibold text-slate-800">
            Next.js Rendering
          </h1>
          <p className="text-xs text-slate-500">Connected to NestJS API topic 1</p>
        </div>
      </div>
    </header>
  );
}

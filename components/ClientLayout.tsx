"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
  { href: "/stats", label: "Statistiques" },
  { href: "/comptes", label: "Comptes" }
];

export function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex md:w-64 flex-col border-r border-slate-800 bg-slate-950/70 backdrop-blur">
        <div className="px-6 py-4 border-b border-slate-800">
          <span className="text-lg font-semibold tracking-tight">
            Budget Planner
          </span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
                pathname === item.href
                  ? "bg-primary-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800 md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-md border border-slate-700 hover:bg-slate-800 px-2 py-1"
            >
              <span className="sr-only">Menu</span>
              <span className="w-5 h-0.5 bg-slate-200 mb-1 block" />
              <span className="w-5 h-0.5 bg-slate-200 mb-1 block" />
              <span className="w-5 h-0.5 bg-slate-200 block" />
            </button>
            <span className="font-semibold">Budget Planner</span>
          </div>
          <div className="hidden md:block" />
          <div className="text-xs text-slate-400">
            Gestion de budget personnel
          </div>
        </header>

        {open && (
          <div className="md:hidden border-b border-slate-800 bg-slate-950">
            <nav className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
                    pathname === item.href
                      ? "bg-primary-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        <main className="flex-1 px-4 py-4 md:px-8 md:py-6">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
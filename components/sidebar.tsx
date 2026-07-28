"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KeyRound, LayoutDashboard, LogOut, Orbit } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/licenses", label: "Licenças", icon: KeyRound },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col overflow-hidden bg-ink text-white md:flex">
        <div className="absolute -right-20 top-24 h-52 w-52 rounded-full bg-sand-500/10 blur-3xl" />
        <div className="relative flex h-24 items-center gap-3 border-b border-white/10 px-7">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-sand-500 text-white shadow-lg shadow-black/20"><Orbit size={21} /></span>
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/45">Admin</p><p className="text-lg font-semibold tracking-tight">Limbus Ops</p></div>
        </div>
        <nav className="relative flex flex-1 flex-col gap-2 px-4 py-8">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link key={href} href={href} className={cn("focus-ring group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 hover:bg-white/[0.06] hover:text-white", active && "bg-white text-ink hover:bg-white hover:text-ink")}>
                <Icon size={18} strokeWidth={1.8} />{label}{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sand-500" />}
              </Link>
            );
          })}
        </nav>
        <div className="relative border-t border-white/10 p-4">
          <button className="focus-ring flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/50 hover:bg-white/[0.06] hover:text-white"><LogOut size={18} />Sair</button>
        </div>
      </aside>
      <nav className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-around rounded-2xl border border-white/10 bg-ink/95 p-2 text-white shadow-2xl backdrop-blur md:hidden">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return <Link key={href} href={href} className={cn("focus-ring flex min-w-[96px] flex-col items-center gap-1 rounded-xl px-4 py-2 text-[11px] font-medium text-white/55", active && "bg-white text-ink")}><Icon size={18} />{label}</Link>;
        })}
        <button className="focus-ring flex min-w-[72px] flex-col items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-medium text-white/55"><LogOut size={18} />Sair</button>
      </nav>
    </>
  );
}

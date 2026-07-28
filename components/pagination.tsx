import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({ page, totalPages, search }: { page: number; totalPages: number; search: string }) {
  if (totalPages <= 1) return null;
  const href = (target: number) => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    params.set("page", String(target));
    return `/licenses?${params.toString()}`;
  };
  return (
    <div className="mt-6 flex items-center justify-between">
      <p className="text-xs font-medium text-black/40">Página {page} de {totalPages}</p>
      <div className="flex gap-2">
        <Link aria-disabled={page <= 1} tabIndex={page <= 1 ? -1 : undefined} href={page > 1 ? href(page - 1) : "#"} className={cn("focus-ring inline-flex h-10 items-center gap-1 rounded-xl border bg-white px-3 text-xs font-semibold", page <= 1 && "pointer-events-none opacity-40")}><ChevronLeft size={15} />Anterior</Link>
        <Link aria-disabled={page >= totalPages} tabIndex={page >= totalPages ? -1 : undefined} href={page < totalPages ? href(page + 1) : "#"} className={cn("focus-ring inline-flex h-10 items-center gap-1 rounded-xl border bg-white px-3 text-xs font-semibold", page >= totalPages && "pointer-events-none opacity-40")}>Próxima<ChevronRight size={15} /></Link>
      </div>
    </div>
  );
}

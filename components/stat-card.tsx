import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-black/[0.055] text-ink",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-red-50 text-red-700",
  sand: "bg-sand-50 text-sand-600",
  orange: "bg-orange-50 text-orange-700",
};

export function StatCard({ label, value, icon: Icon, tone = "neutral", delay = 0 }: { label: string; value: number; icon: LucideIcon; tone?: keyof typeof tones; delay?: number }) {
  return (
    <article className="panel animate-rise p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6" style={{ animationDelay: `${delay}ms` }}>
      <div className="mb-8 flex items-start justify-between gap-4">
        <p className="max-w-32 text-xs font-semibold uppercase leading-5 tracking-[0.14em] text-black/45">{label}</p>
        <span className={cn("grid h-10 w-10 place-items-center rounded-xl", tones[tone])}><Icon size={19} strokeWidth={1.8} /></span>
      </div>
      <p className="text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">{value.toLocaleString("pt-BR")}</p>
    </article>
  );
}

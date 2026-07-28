import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-5 border-b border-black/[0.07] pb-7 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div className="animate-rise">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-sand-600">{eyebrow}</p>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl lg:text-[44px] lg:leading-[1.05]">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-sm leading-6 text-black/50 sm:text-base">{description}</p>}
      </div>
      {action && <div className="shrink-0 animate-rise [animation-delay:100ms]">{action}</div>}
    </header>
  );
}

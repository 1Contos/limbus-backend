import { ArrowUpRight, Download, PackageCheck } from "lucide-react";

export function DownloadCard() {
  return (
    <section className="relative mt-8 overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-2xl sm:p-8 lg:p-10">
      <div className="absolute -right-10 -top-28 h-72 w-72 rounded-full border border-white/10" /><div className="absolute -right-24 -top-12 h-72 w-72 rounded-full border border-white/5" />
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4 sm:gap-5"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-sand-100 sm:h-14 sm:w-14"><PackageCheck size={25} /></span><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-sand-400">Download</p><h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Extensão Limbus</h2><p className="mt-2 text-sm text-white/50">Baixe sempre a versão mais recente.</p></div></div>
        <a href="#" className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sand-500 px-5 py-3.5 text-sm font-semibold text-white hover:bg-sand-400 active:scale-[0.98] sm:w-auto"><Download size={17} />Baixar Extensão<ArrowUpRight size={16} /></a>
      </div>
    </section>
  );
}

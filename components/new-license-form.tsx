"use client";

import { type FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, Loader2 } from "lucide-react";
import { createLicense } from "@/app/actions";

export function NewLicenseForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await createLicense({
        ownerEmail: String(form.get("ownerEmail") ?? ""),
        plan: String(form.get("plan")) as "free" | "pro",
        credits: Number(form.get("credits")),
        expiresAt: String(form.get("expiresAt") ?? ""),
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.push("/licenses");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="panel mx-auto max-w-2xl overflow-hidden">
      <div className="border-b border-black/[0.06] bg-[#faf9f6] px-5 py-5 sm:px-8">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-sand-100 text-sand-600"><KeyRound size={19} /></span><div><h2 className="font-semibold text-ink">Dados da licença</h2><p className="mt-0.5 text-xs text-black/40">A chave segura é gerada automaticamente.</p></div></div>
      </div>
      <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-8">
        <label className="sm:col-span-2"><span className="mb-2 block text-xs font-semibold text-ink">Email do Dono <span className="font-normal text-black/35">(opcional)</span></span><input name="ownerEmail" type="email" autoComplete="email" placeholder="cliente@empresa.com" className="focus-ring h-12 w-full rounded-xl border bg-white px-4 text-sm placeholder:text-black/25 focus:border-sand-500" /></label>
        <label><span className="mb-2 block text-xs font-semibold text-ink">Plano</span><select name="plan" defaultValue="free" className="focus-ring h-12 w-full rounded-xl border bg-white px-4 text-sm focus:border-sand-500"><option value="free">Free</option><option value="pro">Pro</option></select></label>
        <label><span className="mb-2 block text-xs font-semibold text-ink">Créditos</span><input name="credits" type="number" required min="0" max="1000000" defaultValue="100" className="focus-ring h-12 w-full rounded-xl border bg-white px-4 text-sm focus:border-sand-500" /></label>
        <label className="sm:col-span-2"><span className="mb-2 block text-xs font-semibold text-ink">Expiração <span className="font-normal text-black/35">(opcional)</span></span><input name="expiresAt" type="date" className="focus-ring h-12 w-full rounded-xl border bg-white px-4 text-sm focus:border-sand-500" /></label>
        {error && <div className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>}
      </div>
      <div className="flex flex-col-reverse gap-3 border-t border-black/[0.06] bg-[#faf9f6] px-5 py-5 sm:flex-row sm:justify-end sm:px-8">
        <button type="button" onClick={() => router.back()} className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-5 py-3 text-sm font-semibold text-black/55 hover:text-ink"><ArrowLeft size={16} />Cancelar</button>
        <button type="submit" disabled={isPending} className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-sand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sand-600 disabled:cursor-not-allowed disabled:opacity-60">{isPending ? <Loader2 className="animate-spin" size={17} /> : <KeyRound size={17} />}Gerar Licença</button>
      </div>
    </form>
  );
}

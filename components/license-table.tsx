"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Ban, Check, KeyRound, Pencil, Save, Trash2, X } from "lucide-react";
import type { License } from "@/db/schema";
import { deleteLicense, updateLicense } from "@/app/actions";
import { cn, formatDate } from "@/lib/utils";

const badgeStyles = {
  free: "bg-black/[0.06] text-black/55",
  pro: "bg-amber-100 text-amber-800",
  livre: "bg-emerald-50 text-emerald-700",
  vinculado: "bg-blue-50 text-blue-700",
  ativa: "bg-emerald-50 text-emerald-700",
  banida: "bg-red-50 text-red-700",
};

function Badge({ value }: { value: keyof typeof badgeStyles }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", badgeStyles[value])}>{value}</span>;
}

export function LicenseTable({ licenses }: { licenses: License[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutate = (operation: () => Promise<{ success: boolean; error?: string }>) => {
    setError(null);
    startTransition(async () => {
      const result = await operation();
      if (!result.success) {
        setError(result.error ?? "Não foi possível concluir a operação.");
        return;
      }
      setEditingId(null);
      router.refresh();
    });
  };

  if (licenses.length === 0) {
    return (
      <div className="panel flex min-h-72 flex-col items-center justify-center px-6 text-center">
        <span className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-sand-50 text-sand-600"><KeyRound size={23} /></span>
        <h2 className="text-lg font-semibold text-ink">Nenhuma licença encontrada</h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-black/45">Gere uma nova licença ou ajuste os termos usados na busca.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>}
      <div className={cn("panel overflow-hidden", isPending && "opacity-70")}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-[#faf9f6] text-[10px] font-bold uppercase tracking-[0.16em] text-black/40">
              <tr><th className="px-5 py-4">Chave</th><th className="px-5 py-4">Dono / Email</th><th className="px-5 py-4">Plano</th><th className="px-5 py-4">Créditos</th><th className="px-5 py-4">Dispositivo</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Expiração</th><th className="px-5 py-4 text-right">Ações</th></tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              {licenses.map((license) => {
                const editing = editingId === license.id;
                return (
                  <tr key={license.id} className="group transition hover:bg-sand-50/50">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-ink">{license.id}</td>
                    <td className="px-5 py-4">
                      {editing ? <input form={`edit-${license.id}`} name="ownerEmail" type="email" defaultValue={license.ownerEmail ?? ""} className="focus-ring h-9 w-48 rounded-lg border bg-white px-3 text-xs" placeholder="Sem proprietário" /> : <span className="text-sm text-black/60">{license.ownerEmail || "—"}</span>}
                    </td>
                    <td className="px-5 py-4"><Badge value={license.plan} /></td>
                    <td className="px-5 py-4">
                      {editing ? <input form={`edit-${license.id}`} name="credits" type="number" min="0" max="1000000" defaultValue={license.credits} className="focus-ring h-9 w-24 rounded-lg border bg-white px-3 text-xs" /> : <span className="text-sm font-semibold text-ink">{license.credits.toLocaleString("pt-BR")}</span>}
                    </td>
                    <td className="px-5 py-4"><Badge value={license.deviceStatus} /></td>
                    <td className="px-5 py-4"><Badge value={license.status} /></td>
                    <td className="px-5 py-4 text-xs text-black/50">{formatDate(license.expiresAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1.5">
                        {editing ? (
                          <>
                            <form id={`edit-${license.id}`} action={(formData) => mutate(() => updateLicense(license.id, { ownerEmail: String(formData.get("ownerEmail") ?? ""), credits: Number(formData.get("credits")) }))}>
                              <button disabled={isPending} className="focus-ring grid h-9 w-9 place-items-center rounded-lg bg-ink text-white hover:bg-black disabled:opacity-40" title="Salvar"><Save size={15} /></button>
                            </form>
                            <button onClick={() => setEditingId(null)} className="focus-ring grid h-9 w-9 place-items-center rounded-lg border bg-white text-black/50 hover:text-ink" title="Cancelar"><X size={15} /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setEditingId(license.id)} className="focus-ring grid h-9 w-9 place-items-center rounded-lg border bg-white text-black/50 hover:border-sand-400 hover:text-sand-600" title="Editar"><Pencil size={15} /></button>
                            <button disabled={isPending} onClick={() => mutate(() => updateLicense(license.id, { status: license.status === "ativa" ? "banida" : "ativa" }))} className={cn("focus-ring grid h-9 w-9 place-items-center rounded-lg border bg-white disabled:opacity-40", license.status === "ativa" ? "text-red-600 hover:bg-red-50" : "text-emerald-600 hover:bg-emerald-50")} title={license.status === "ativa" ? "Banir" : "Ativar"}>{license.status === "ativa" ? <Ban size={15} /> : <Check size={15} />}</button>
                            <button disabled={isPending} onClick={() => { if (window.confirm(`Excluir a licença ${license.id}?`)) mutate(() => deleteLicense(license.id)); }} className="focus-ring grid h-9 w-9 place-items-center rounded-lg border bg-white text-black/35 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-40" title="Excluir"><Trash2 size={15} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="px-1 text-xs text-black/35 md:hidden">Deslize a tabela para ver todas as colunas.</p>
    </div>
  );
}

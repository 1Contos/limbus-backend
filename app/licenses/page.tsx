import Link from "next/link";
import { Plus } from "lucide-react";
import { getLicenses } from "@/app/actions";
import { LicenseTable } from "@/components/license-table";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import { SearchForm } from "@/components/search-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Licenças" };

export default async function LicensesPage({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const search = searchParams.q?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.page) || 1);
  const result = await getLicenses(search, page);
  return (
    <>
      <PageHeader eyebrow="Licenças" title="Gerencie chaves, créditos e status." description="Controle o ciclo completo de cada licença emitida para a operação Limbus." action={<Link href="/licenses/new" className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sand-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sand-500/20 hover:bg-sand-600 active:scale-[0.98] sm:w-auto"><Plus size={18} />Gerar Nova Licença</Link>} />
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><SearchForm defaultValue={search} /><p className="text-xs font-medium text-black/40">{result.total.toLocaleString("pt-BR")} licença{result.total === 1 ? "" : "s"}</p></div>
      {!result.success && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{result.error}</div>}
      <LicenseTable licenses={result.data} />
      <Pagination page={result.page} totalPages={result.totalPages} search={search} />
    </>
  );
}

import { AlertTriangle, Ban, CheckCircle2, Coins, KeyRound } from "lucide-react";
import { getStats } from "@/app/actions";
import { DownloadCard } from "@/components/download-card";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const result = await getStats();
  const stats = result.data;
  return (
    <>
      <PageHeader eyebrow="Dashboard" title="Visão geral do licenciamento do Limbus" description="Acompanhe a saúde das licenças, o consumo de créditos e vencimentos em um só lugar." />
      {!result.success && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{result.error}</div>}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total de Licenças" value={stats.total} icon={KeyRound} delay={40} />
        <StatCard label="Licenças Ativas" value={stats.active} icon={CheckCircle2} tone="green" delay={80} />
        <StatCard label="Licenças Banidas" value={stats.banned} icon={Ban} tone="red" delay={120} />
        <StatCard label="Créditos Restantes" value={stats.credits} icon={Coins} tone="sand" delay={160} />
        <StatCard label="Expirando em Breve" value={stats.expiring} icon={AlertTriangle} tone="orange" delay={200} />
      </section>
      <DownloadCard />
    </>
  );
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <div className="panel mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center"><p className="text-xs font-bold uppercase tracking-[0.3em] text-sand-600">Erro 404</p><h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">Página não encontrada</h1><p className="mt-3 text-sm text-black/45">O endereço acessado não existe no Limbus Ops.</p><Link href="/dashboard" className="focus-ring mt-8 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white"><ArrowLeft size={16} />Voltar ao dashboard</Link></div>;
}

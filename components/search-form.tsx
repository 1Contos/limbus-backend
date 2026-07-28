import { Search } from "lucide-react";

export function SearchForm({ defaultValue }: { defaultValue: string }) {
  return (
    <form action="/licenses" className="relative w-full sm:max-w-md">
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35" size={18} />
      <input type="search" name="q" defaultValue={defaultValue} placeholder="Buscar por chave ou email..." className="focus-ring h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm text-ink shadow-sm placeholder:text-black/30 focus:border-sand-500" />
    </form>
  );
}

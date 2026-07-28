export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-10 border-b pb-8"><div className="mb-3 h-3 w-24 rounded bg-black/10" /><div className="h-10 max-w-2xl rounded-xl bg-black/10" /></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-48 rounded-2xl bg-black/[0.06]" />)}</div>
      <div className="mt-8 h-44 rounded-3xl bg-black/10" />
    </div>
  );
}

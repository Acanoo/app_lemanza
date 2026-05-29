export function VehicleSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-white shadow-soft">
      <div className="aspect-[4/3] rounded-t-lg bg-slate-200" />
      <div className="space-y-3 p-5">
        <div className="h-7 w-32 rounded bg-slate-200" />
        <div className="h-5 w-48 rounded bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-4/5 rounded bg-slate-200" />
      </div>
    </div>
  );
}

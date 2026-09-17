export default function PropertyGridSkeleton({ detail = false }) {
  return <div role="status" aria-label={detail ? "Loading property details" : "Loading properties"} className="mx-auto grid max-w-5xl gap-5">
    <span className="sr-only">Loading…</span>
    {(detail ? [1] : [1, 2, 3, 4, 5, 6]).map((id) => <div key={id} aria-hidden="true" className="grid animate-pulse gap-6 rounded-[24px] bg-white p-5 motion-reduce:animate-none sm:grid-cols-[.8fr_1.2fr]">
      <div className="h-64 rounded-2xl bg-sage/60" />
      <div className="space-y-5 py-4"><div className="h-7 w-3/4 rounded bg-sage/60" /><div className="h-4 w-1/2 rounded bg-sage/40" /><div className="h-9 w-1/3 rounded bg-sage/60" /><div className="h-16 rounded bg-sage/40" /></div>
    </div>)}
  </div>;
}

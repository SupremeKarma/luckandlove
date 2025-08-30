export default function GlobalLoading() {
  return (
    <div className="container-app py-12">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border p-4 space-y-3">
            <div className="skeleton h-32 w-full rounded-xl" />
            <div className="skeleton h-4 w-2/3" />
            <div className="skeleton h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}


export function CardSkeleton() {
  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="skeleton h-32 w-full rounded-xl" />
      <div className="skeleton h-4 w-2/3" />
      <div className="skeleton h-4 w-1/3" />
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="table-wrap">
      <div className="grid gap-2 p-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="skeleton h-10 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

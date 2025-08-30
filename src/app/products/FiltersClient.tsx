
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";


export default function FiltersClient({
  categories = [],
}: {
  categories?: string[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = React.useState(params.get("q") ?? "");
  const [cat, setCat] = React.useState(params.get("category") ?? "");
  const debouncedQ = useDebouncedValue(q, 350);

  React.useEffect(() => {
    const sp = new URLSearchParams(params.toString());
    if (debouncedQ) sp.set("q", debouncedQ); else sp.delete("q");
    if (cat) sp.set("category", cat); else sp.delete("category");
    sp.set("page", "1"); // reset pagination on filter change
    router.replace(`/products?${sp.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, cat, router]);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="w-64">
        <Input placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <Select value={cat} onValueChange={setCat}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All categories</SelectItem>
          {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

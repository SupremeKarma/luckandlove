
"use client";

import * as React from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardSkeleton } from "@/components/ui/skeletons";

type Shop = {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  rating?: number | null;
  delivery_time_minutes?: number | null;
  delivery_fee?: number | null;
};

function mapShopRow(r: any): Shop {
  return {
    id: r.id,
    name: r.name ?? "",
    description: r.description ?? null,
    image_url: r.image_url ?? null,
    rating: typeof r.rating === "number" ? r.rating : null,
    delivery_time_minutes: typeof r.delivery_time_minutes === "number" ? r.delivery_time_minutes : null,
    delivery_fee: r.delivery_fee != null ? Number(r.delivery_fee) : null,
  };
}

export default function WholesalePage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [shops, setShops] = React.useState<Shop[]>([]);
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState<"recommended" | "fee" | "time" | "rating">("recommended");

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("shops")
        .select("id, name, description, image_url, rating, delivery_time_minutes, delivery_fee, category")
        .eq("category", "Wholesale")
        .order("name", { ascending: true });

      if (!mounted) return;
      if (error) {
        setError("Could not load wholesale shops.");
        setShops([]);
      } else {
        setShops((data ?? []).map(mapShopRow));
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = React.useMemo(() => {
    const byQuery = shops.filter((s) =>
      `${s.name} ${s.description ?? ""}`.toLowerCase().includes(q.toLowerCase())
    );
    switch (sort) {
      case "fee":
        return [...byQuery].sort((a, b) => (a.delivery_fee ?? Infinity) - (b.delivery_fee ?? Infinity));
      case "time":
        return [...byQuery].sort(
          (a, b) => (a.delivery_time_minutes ?? Infinity) - (b.delivery_time_minutes ?? Infinity)
        );
      case "rating":
        return [...byQuery].sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
      default:
        return byQuery;
    }
  }, [shops, q, sort]);

  return (
    <div className="container-app py-6 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold">Wholesale</h1>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-64">
            <Input placeholder="Search wholesale shops…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={sort} onValueChange={(v: any) => setSort(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="fee">Lowest delivery fee</SelectItem>
              <SelectItem value="time">Fastest delivery</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && (
        <div className="card-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && <div className="text-sm text-red-500">{error}</div>}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border p-8 text-center text-sm text-muted-foreground">
              No wholesale shops match your search.
            </div>
          ) : (
            <div className="card-grid">
              {filtered.map((s) => (
                <Link key={s.id} href={`/shop/${s.id}`} className="block rounded-2xl border hover:bg-muted/30 transition-colors">
                  <Card className="rounded-2xl overflow-hidden border-0">
                    <CardHeader>
                      <CardTitle className="text-base">{s.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {s.image_url ? (
                        <img src={s.image_url} alt={s.name} className="h-36 w-full object-cover rounded-xl" />
                      ) : (
                        <div className="h-36 w-full rounded-xl bg-muted" />
                      )}
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {s.description ?? "Wholesale supplier"}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-3">
                        <span>{s.rating != null ? `⭐ ${s.rating.toFixed(1)}` : "No rating"}</span>
                        <span>•</span>
                        <span>
                          {s.delivery_time_minutes != null ? `${s.delivery_time_minutes} min` : "—"}
                        </span>
                        <span>•</span>
                        <span>
                          {s.delivery_fee != null ? `NPR ${s.delivery_fee.toFixed(2)} fee` : "Free"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

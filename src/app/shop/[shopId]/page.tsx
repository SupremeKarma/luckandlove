"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ShopPage() {
  const { shopId } = useParams<{ shopId: string }>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [shop, setShop] = React.useState<any>(null);
  const [products, setProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    let mounted = true;
    const supabase = getSupabase();
    (async () => {
      setLoading(true);
      setError(null);
      const [shopRes, prodRes] = await Promise.all([
        supabase.from("shops").select("*").eq("id", shopId).maybeSingle(),
        supabase.from("products").select("id,name,price,image_url,stock,category").eq("shop_id", shopId).order("created_at",{ascending:false})
      ]);
      if (!mounted) return;
      if (shopRes.error || !shopRes.data) {
        setError("Could not load shop."); setShop(null); setProducts([]); setLoading(false); return;
      }
      setShop(shopRes.data);
      setProducts(prodRes.data ?? []);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [shopId]);

  if (loading) return <div className="container-app py-6 text-sm text-muted-foreground">Loading…</div>;
  if (error || !shop) return <div className="container-app py-6 text-sm text-red-500">{error ?? "Not found"}</div>;

  return (
    <div className="container-app py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{shop.name}</h1>
        <Link href="/wholesale" className="text-sm text-muted-foreground hover:text-foreground">Back to Wholesale</Link>
      </div>

      <Card className="rounded-2xl overflow-hidden">
        <CardHeader><CardTitle className="text-sm text-muted-foreground">Products</CardTitle></CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-sm text-muted-foreground">No products yet.</div>
          ) : (
            <div className="card-grid">
              {products.map((p) => (
                <div key={p.id} className="rounded-2xl border p-3 space-y-2">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-32 w-full object-cover rounded-xl" />
                  ) : (
                    <div className="h-32 w-full rounded-xl bg-muted" />
                  )}
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">NPR {Number(p.price).toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

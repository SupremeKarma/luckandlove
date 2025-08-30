import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const PAGE_SIZE = 24;

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; page?: string };
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, key);

  const q = (searchParams.q ?? "").trim();
  const category = (searchParams.category ?? "").trim();
  const page = Math.max(1, Number(searchParams.page || 1));

  let query = supabase.from("products").select("id,name,price,image_url,category", { count: "exact" });
  if (q) query = query.ilike("name", `%${q}%`);
  if (category) query = query.eq("category", category);

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const { data, count } = await query.order("created_at", { ascending: false }).range(from, to);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  
  const createPageURL = (params: Record<string, string>) => {
    const search = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => search.set(key, value));
    return `/products?${search.toString()}`;
  }

  return (
    <div className="container-app py-6 space-y-4">
       <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">Zenith Store</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Discover exclusive products, curated just for you. Your next favorite item is just a click away.</p>
      </div>

      {/* Optional: render filters/search using client components that sync to the URL */}

      {(!data || data.length === 0) ? (
        <div className="rounded-2xl border p-8 text-center text-sm text-muted-foreground">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} className="rounded-2xl border p-3 hover:bg-muted/30 transition-colors group">
              <div className="h-48 rounded-xl bg-muted overflow-hidden relative">
                {p.image_url ? 
                    <Image src={p.image_url} alt={p.name ?? ''} fill className="w-full h-full object-cover" /> 
                    : null
                }
              </div>
              <div className="mt-3 text-sm font-medium truncate">{p.name}</div>
              <div className="text-xs text-muted-foreground">
                {p.category ?? "—"} · NPR {Number(p.price).toFixed(2)}
              </div>
            </Link>
          ))}
        </div>
      )}

       {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-8">
            <Button asChild variant="outline" disabled={page <= 1}>
                <Link href={createPageURL({ page: String(page-1) })}>Prev</Link>
            </Button>
            <div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
             <Button asChild variant="outline" disabled={page >= totalPages}>
                <Link href={createPageURL({ page: String(page+1) })}>Next</Link>
            </Button>
        </div>
      )}
    </div>
  );
}

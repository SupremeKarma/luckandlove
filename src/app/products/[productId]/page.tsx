
// Server Component: can export generateStaticParams (no "use client")
import { Suspense } from 'react';
import { createClient } from "@supabase/supabase-js";
import ProductClientPage from "./ProductClientPage";

export async function generateStaticParams() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    if (!url || !key) return [];
    const supabase = createClient(url, key);
    const { data } = await supabase
      .from("products")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(50);
    return (data ?? []).map((p) => ({ productId: p.id }));
  } catch {
    return [];
  }
}

export default function Page({ params }: { params: { productId: string } }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductClientPage />
        </Suspense>
    )
}

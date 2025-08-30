
// Server Component: can export generateStaticParams (no "use client")
import ProductClientPage from "./ProductClientPage";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { productId: string } }): Promise<Metadata> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    if (!url || !key) return { title: "Product" };
    const supabase = createClient(url, key);
    const { data } = await supabase.from("products").select("name").eq("id", params.productId).maybeSingle();
    const title = data?.name ? `${data.name} · Product` : "Product";
    return { title };
  } catch {
    return { title: "Product" };
  }
}

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
  return <ProductClientPage productId={params.productId} />;
}

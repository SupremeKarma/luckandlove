import ProductClientPage from "./ProductClientPage";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    if (!url || !key) return [];
    const supabase = createClient(url, key);
    const { data } = await supabase.from("products").select("id").order("created_at",{ascending:false}).limit(50);
    return (data ?? []).map((p) => ({ productId: p.id }));
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: { productId: string } }): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, key);
  const { data } = await supabase
    .from("products")
    .select("name, description, image_url, price, category, created_at")
    .eq("id", params.productId)
    .maybeSingle();

  const title = data?.name ? `${data.name} · Products` : "Product";
  const description = data?.description ?? "Product details";
  const canonical = `${base}/products/${params.productId}`;
  const images = data?.image_url ? [data.image_url] : [];

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title, description, url: canonical, type: "product", images,
    },
    twitter: {
      card: "summary_large_image", title, description, images,
    },
  };
}

export default async function Page({ params }: { params: { productId: string } }) {
  // Fetch minimal data for JSON-LD (server)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, key);
  const { data } = await supabase
    .from("products")
    .select("id, name, description, image_url, price, stock")
    .eq("id", params.productId)
    .maybeSingle();

  return (
    <>
      {data ? (
        <ProductJsonLd
          id={`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/products/${data.id}`}
          name={data.name}
          description={data.description}
          image={data.image_url}
          price={Number(data.price)}
          currency={(process.env.STRIPE_CURRENCY || "USD").toUpperCase()}
          availability={data.stock && data.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"}
        />
      ) : null}
      <ProductClientPage productId={params.productId} />
    </>
  );
}

import ProductClientPage from "./ProductClientPage";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
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

  const ogUrl = new URL(`${process.env.NEXT_PUBLIC_SITE_URL || base}/api/og`);
  ogUrl.searchParams.set("title", data?.name ?? "Product");
  if (data?.price) ogUrl.searchParams.set("price", `${Number(data.price).toFixed(2)} ${(process.env.STRIPE_CURRENCY||"USD").toUpperCase()}`);
  if (data?.image_url) ogUrl.searchParams.set("img", data.image_url);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { 
        title,
        description,
        url: canonical,
        type: "product",
        images: [{ url: ogUrl.toString(), width: 1200, height: 630 }],
     },
    twitter: {
      card: "summary_large_image", 
      title, 
      description, 
      images: [ogUrl.toString()],
    },
  };
}

export default async function Page({ params }: { params: { productId: string } }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
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
        <>
            <ProductJsonLd
                id={`${base}/products/${data.id}`}
                name={data.name}
                description={data.description}
                image={data.image_url}
                price={Number(data.price)}
                currency={(process.env.STRIPE_CURRENCY || "USD").toUpperCase()}
                availability={data.stock && data.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"}
            />
             <BreadcrumbJsonLd
                items={[
                    { name: "Home", url: `${base}/` },
                    { name: "Products", url: `${base}/products` },
                    { name: data.name, url: `${base}/products/${data.id}` },
                ]}
            />
        </>
      ) : null}
      <ProductClientPage productId={params.productId} />
    </>
  );
}

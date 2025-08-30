
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 3600;

import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

function xmlEscape(s: string | null) {
  if (s === null) return '';
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const supabase = getServerSupabase();

  const [prods, shops] = await Promise.all([
    supabase.from("products").select("id, updated_at").order("updated_at",{ascending:false}).limit(1000),
    supabase.from("shops").select("id, created_at").order("created_at",{ascending:false}).limit(1000),
  ]);

  const urls: { loc: string; lastmod?: string; priority?: number }[] = [
    { loc: `${base}/`, priority: 1.0 },
    { loc: `${base}/products`, priority: 0.9 },
    { loc: `${base}/wholesale`, priority: 0.8 },
    { loc: `${base}/food-delivery`, priority: 0.7 },
    { loc: `${base}/gaming`, priority: 0.6 },
    { loc: `${base}/rentals`, priority: 0.5 },
  ];

  (prods.data ?? []).forEach(p => {
    urls.push({
      loc: `${base}/products/${p.id}`,
      lastmod: p.updated_at ?? undefined,
      priority: 0.8,
    });
  });

  (shops.data ?? []).forEach(s => {
    urls.push({
      loc: `${base}/shop/${s.id}`,
      lastmod: s.created_at ?? undefined,
      priority: 0.6,
    });
  });

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u => (
      `  <url>\n` +
      `    <loc>${xmlEscape(u.loc)}</loc>\n` +
      (u.lastmod ? `    <lastmod>${new Date(u.lastmod).toISOString()}</lastmod>\n` : ``) +
      (u.priority ? `    <priority>${u.priority.toFixed(1)}</priority>\n` : ``) +
      `  </url>\n`
    )).join("") +
    `</urlset>`;

  return new NextResponse(body, { headers: { "Content-Type": "application/xml" }});
}

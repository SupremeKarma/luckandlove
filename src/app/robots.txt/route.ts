import { NextResponse } from "next/server";

export const revalidate = 3600;

export function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return new NextResponse(
`User-agent: *
Allow: /
Sitemap: ${base}/sitemap.xml
`, { headers: { "Content-Type": "text/plain" }});
}

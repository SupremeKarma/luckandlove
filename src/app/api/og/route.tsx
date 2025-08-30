export const runtime = "edge";

import { ImageResponse } from "@vercel/og";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Luck&Love";
  const price = searchParams.get("price");
  const img = searchParams.get("img");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          background: "#0b1220",
          color: "#e6eefc",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ flex: 1, padding: 40, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
          <div style={{ fontSize: 28, opacity: 0.8 }}>
            {price ? `Only ${price}` : "Shop the latest"}
          </div>
          <div style={{ fontSize: 22, opacity: 0.6 }}>luckandlove.store</div>
        </div>
        <div style={{ width: 540, height: "100%", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#10192e,#0b1220)" }} />
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt="" width={540} height={630} style={{ objectFit: "cover" }} />
          ) : null}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

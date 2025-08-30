import { NextResponse } from "next/server";
import { render } from "@react-email/components";
import ReceiptEmail from "@/emails/ReceiptEmail";

export async function GET() {
  const html = render(
    ReceiptEmail({
      orderId: "demo-order-123",
      email: "customer@example.com",
      createdAt: new Date().toISOString(),
      items: [
        { name: "Demo Product A", qty: 2, unit_price: 12.00, line_total: 24.00 },
        { name: "Demo Product B", qty: 1, unit_price: 5.00, line_total: 5.00 },
      ],
      subtotal: 29.00,
      tax: 0,
      shipping: 1.50,
      total: 30.50,
      currency: "USD",
      shippingAddress: {
        name: "Demo Customer",
        line1: "123 Demo Street",
        city: "Kathmandu",
        state: "",
        postal_code: "44600",
        country: "NP",
      },
    })
  );
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

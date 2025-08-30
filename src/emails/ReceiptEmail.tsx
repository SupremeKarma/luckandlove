import * as React from "react";
import {
  Html, Head, Preview, Body, Container, Section, Text, Hr,
} from "@react-email/components";

type Item = { name: string; qty: number; unit_price: number; line_total: number };
type Address = {
  name?: string; phone?: string; line1?: string; line2?: string;
  city?: string; state?: string; postal_code?: string; country?: string;
};

export default function ReceiptEmail(props: {
  orderId: string;
  email: string;
  createdAt: string;
  items: Item[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  shippingAddress?: Address | null;
}) {
  const {
    orderId, email, createdAt, items, subtotal, tax, shipping, total, currency, shippingAddress,
  } = props;

  const money = (n: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(n || 0));

  return (
    <Html>
      <Head />
      <Preview>Receipt for order {orderId.slice(0, 8)}… — {money(total)}</Preview>
      <Body style={{ backgroundColor: "#0b1220", color: "#e6eefc", fontFamily: "Inter, Arial, sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "24px" }}>
          <Section style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Thanks for your purchase!</Text>
            <Text style={{ fontSize: 12, color: "#92a0b6", marginTop: 4 }}>
              Order {orderId} · {new Date(createdAt).toLocaleString()} · {email}
            </Text>
          </Section>

          <Section style={{ background: "#10192e", padding: 16, borderRadius: 12 }}>
            {items.map((i, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ fontSize: 14, margin: 0, maxWidth: 380, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {i.name} × {i.qty}
                </Text>
                <Text style={{ fontSize: 14, margin: 0 }}>{money(i.line_total)}</Text>
              </div>
            ))}
            <Hr style={{ borderColor: "#1d2942", margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#a6b3c8" }}>
              <Text style={{ margin: 0 }}>Subtotal</Text><Text style={{ margin: 0 }}>{money(subtotal)}</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#a6b3c8" }}>
              <Text style={{ margin: 0 }}>Tax</Text><Text style={{ margin: 0 }}>{money(tax)}</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#a6b3c8" }}>
              <Text style={{ margin: 0 }}>Shipping</Text><Text style={{ margin: 0 }}>{money(shipping)}</Text>
            </div>
            <Hr style={{ borderColor: "#1d2942", margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
              <Text style={{ margin: 0 }}>Total</Text><Text style={{ margin: 0 }}>{money(total)}</Text>
            </div>
          </Section>

          <Section style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 12, color: "#92a0b6", margin: 0 }}>Shipping to</Text>
            <Text style={{ fontSize: 13, margin: "4px 0 0 0" }}>
              {shippingAddress?.name ?? "—"}<br />
              {shippingAddress?.line1 ?? ""} {shippingAddress?.line2 ?? ""}<br />
              {shippingAddress?.city ?? ""} {shippingAddress?.state ?? ""} {shippingAddress?.postal_code ?? ""}<br />
              {shippingAddress?.country ?? ""}
              {shippingAddress?.phone ? <><br />{shippingAddress.phone}</> : null}
            </Text>
          </Section>

          <Section style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 12, color: "#92a0b6" }}>
              If you have questions, just reply to this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

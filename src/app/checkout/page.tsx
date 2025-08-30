
"use client";

import * as React from "react";
import { useCart } from "@/context/cart-context";
import { createCheckoutSession } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { profile } = useAuth();
  const [email, setEmail] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    if (profile?.email) {
      setEmail(profile.email);
    }
  }, [profile]);

  const onPay = async () => {
    setBusy(true);
    setErr(null);
    try {
      const payload = {
        email,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          qty: i.quantity, // Match CartItem type
        })),
      };
      const res = await createCheckoutSession(payload);
      if (res.checkoutUrl) {
        clearCart();
        window.location.href = res.checkoutUrl;
      } else {
        clearCart();
        alert(`Order created: ${res.orderId}`);
      }
    } catch (e: any) {
      setErr(e?.message || "Checkout failed");
    } finally {
      setBusy(false);
    }
  };
  
    if (items.length === 0 && !busy) {
        return (
          <div className="container mx-auto px-4 py-24 text-center">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">You can't checkout without any items!</p>
            <Button asChild>
              <Link href="/products">Go Shopping</Link>
            </Button>
          </div>
        );
    }

  return (
    <div className="container-app py-6 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold">Checkout</h1>

      <Card className="rounded-2xl">
        <CardHeader><CardTitle className="text-sm text-muted-foreground">Your items</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {items.length === 0 ? (
            <div className="text-sm text-muted-foreground">Your cart is empty.</div>
          ) : (
            <>
              <ul className="space-y-2">
                {items.map((i) => (
                  <li key={`${i.productId}:${i.variantId}`} className="flex items-center justify-between text-sm">
                    <span className="truncate">{i.name} × {i.quantity}</span>
                    <span>NPR {Number(i.quantity * i.price).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-sm font-medium">Subtotal</div>
                <div className="text-sm">NPR {Number(subtotal).toFixed(2)}</div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader><CardTitle className="text-sm text-muted-foreground">Contact</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Email for receipt" value={email} onChange={(e) => setEmail(e.target.value)} />
          {err && <div className="text-sm text-red-500">{err}</div>}
          <div className="flex gap-2">
            <Button disabled={busy || items.length === 0 || !email} onClick={onPay}>
              {busy ? "Processing…" : "Pay with card"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

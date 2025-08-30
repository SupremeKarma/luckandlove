
"use client";

import * as React from "react";
import { useCart } from "@/context/cart-context";
import { createCheckoutSession } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Label } from "@/components/ui/label";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { profile } = useAuth();
  const [email, setEmail] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const [address, setAddress] = React.useState({
    name: "", phone: "",
    line1: "", line2: "",
    city: "", state: "", postal_code: "", country: "NP",
  });
  
  React.useEffect(() => {
    if (profile?.email) {
      setEmail(profile.email);
    }
     if (profile?.full_name) {
      setAddress(prev => ({...prev, name: profile.full_name!}));
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
          qty: i.quantity,
        })),
        address,
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
        <CardHeader><CardTitle className="text-sm text-muted-foreground">Shipping Address</CardTitle></CardHeader>
        <CardContent className="space-y-3">
           <div className="grid gap-2">
             <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Full name" value={address.name} onChange={(e)=>setAddress({...address, name: e.target.value})} />
           </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" placeholder="Phone" value={address.phone} onChange={(e)=>setAddress({...address, phone: e.target.value})}/>
              </div>
               <div className="grid gap-2">
                <Label htmlFor="line1">Address line 1</Label>
                <Input id="line1" placeholder="Address line 1" value={address.line1} onChange={(e)=>setAddress({...address, line1: e.target.value})}/>
              </div>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="line2">Address line 2 (optional)</Label>
                <Input id="line2" placeholder="Address line 2" value={address.line2} onChange={(e)=>setAddress({...address, line2: e.target.value})}/>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
               <div className="grid gap-2">
                 <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="City" value={address.city} onChange={(e)=>setAddress({...address, city: e.target.value})}/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State/Province</Label>
                <Input id="state" placeholder="State/Province" value={address.state} onChange={(e)=>setAddress({...address, state: e.target.value})}/>
              </div>
               <div className="grid gap-2">
                 <Label htmlFor="postal_code">Postal code</Label>
                <Input id="postal_code" placeholder="Postal code" value={address.postal_code} onChange={(e)=>setAddress({...address, postal_code: e.target.value})}/>
              </div>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="Country code (e.g., NP, US)" value={address.country} onChange={(e)=>setAddress({...address, country: e.target.value.toUpperCase()})}/>
             </div>
        </CardContent>
      </Card>


      <Card className="rounded-2xl">
        <CardHeader><CardTitle className="text-sm text-muted-foreground">Contact & Payment</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Email for receipt" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
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


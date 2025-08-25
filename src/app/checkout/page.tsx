
'use client';

import { useCart } from '@/context/cart-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CheckoutButton from '@/components/CheckoutButton';
import EsewaButton from '@/components/EsewaButton';
import KhaltiButton from '@/components/KhaltiButton';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();
  const shipping = 5.00;
  const tax = cartTotal * 0.1;
  const total = cartTotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">You have nothing in your cart to check out.</p>
        <Button asChild>
            <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-2xl font-bold mb-6">Order Summary</h1>
          <Card>
            <CardContent className="p-6 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name} (x{item.quantity})</p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>${cartTotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p>${shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Tax (10%)</p>
                <p>${tax.toFixed(2)}</p>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-6">Payment Details</h1>
          <Card>
            <CardHeader>
              <CardTitle>Choose a Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Select your preferred payment option below.</p>
              <CheckoutButton />
              <EsewaButton />
              <KhaltiButton />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


'use client';

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import type { CartItem } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export default function Cart({ cartItems, onUpdateQuantity, onRemoveItem }: CartProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = 0.1; // 10% tax
  const tax = subtotal * taxRate;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingBag size={64} className="mx-auto mb-6 text-muted-foreground" />
        <h1 className="text-3xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Your Shopping Cart</h1>
        <p className="text-muted-foreground mt-2">Review your items and proceed to checkout.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-card">
                   <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base mb-1 truncate">{item.name}</h3>
                   <div className="flex items-center text-sm text-muted-foreground">
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                   <div className="flex items-center mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </Button>
                    <span className="w-12 text-center font-medium" aria-label={`Quantity: ${item.quantity}`}>
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                       aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col items-end justify-between h-full">
                   <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                   <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-500" : ""}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button asChild className="w-full" size="lg">
                <Link href="/checkout">
                  <CreditCard size={16} className="mr-2"/>
                  Proceed to Checkout
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

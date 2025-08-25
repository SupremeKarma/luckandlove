
'use client';

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import type { CartItem } from "@/lib/types";
import Link from "next/link";

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export default function Cart({ cartItems, onUpdateQuantity, onRemoveItem }: CartProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-hero py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              <span className="gradient-text">Shopping</span>
              <span className="neon-text ml-3">Cart</span>
            </h1>
            
            <Card className="max-w-md mx-auto mt-12 bg-card/50 border-primary/30">
              <CardContent className="text-center py-12">
                <ShoppingBag size={64} className="mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Start exploring our futuristic marketplace
                </p>
                <Button variant="neon" asChild>
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Shopping</span>
            <span className="neon-text ml-3">Cart</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Review your quantum selections
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="bg-card/50 border-primary/20 hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
                      <Badge variant="secondary" className="bg-primary/20">
                        {item.category}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                      
                      <div className="text-lg font-bold gradient-text">
                        ${item.price}
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4 bg-primary/20" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-primary/30"
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      >
                        <Minus size={14} />
                      </Button>
                      
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-primary/30"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                    
                    <div className="text-xl font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-card/50 border-primary/30 sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl neon-text">Order Summary</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-400" : ""}>
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  {shipping > 0 && subtotal < 50 && (
                    <p className="text-sm text-muted-foreground">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                </div>
                
                <Separator className="bg-primary/20" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="gradient-text">${total.toFixed(2)}</span>
                </div>
                
                <div className="space-y-3 pt-4">
                  <Link href="/checkout" passHref>
                    <Button variant="hero" className="w-full" size="lg">
                      <CreditCard size={16} />
                      Proceed to Checkout
                    </Button>
                  </Link>
                  
                  <Button variant="cyber" className="w-full" asChild>
                    <Link href="/">Continue Shopping</Link>
                  </Button>
                </div>
                
                {/* Security Badge */}
                <div className="text-center pt-4">
                  <Badge variant="outline" className="border-green-400/30 text-green-400">
                    🔒 Quantum Secured Checkout
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

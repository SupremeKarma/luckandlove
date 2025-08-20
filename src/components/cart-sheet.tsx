'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { Separator } from './ui/separator';

export function CartSheet() {
  const { cartItems, removeFromCart, updateQuantity, cartCount, cartTotal } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-6 w-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {cartCount}
            </span>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({cartCount})</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartItems.length > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto pr-4">
              <div className="flex flex-col gap-6 py-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                       <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                        data-ai-hint="product image"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                           onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-5 w-5 text-gray-500 hover:text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <SheetFooter className="mt-4">
              <div className="w-full space-y-4">
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300" />
            <h2 className="text-xl font-semibold">Your cart is empty</h2>
            <p className="text-gray-500">Add some products to get started.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

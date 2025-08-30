
'use client';

import type { CartItem, Product, ProductVariant } from '@/lib/types';
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('cart', []);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    setCartItems((prevItems) => {
      // A cart item is unique by product ID and variant ID
      const cartItemId = `${product.id}-${variant.id}`;
      const existingItem = prevItems.find((item) => `${item.id}-${item.variant.id}` === cartItemId);

      if (existingItem) {
        return prevItems.map((item) =>
          `${item.id}-${item.variant.id}` === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      const newCartItem: CartItem = {
          ...product,
          price: variant.sale_price ?? variant.price,
          variant,
          quantity,
      };

      return [...prevItems, newCartItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => `${item.id}-${item.variant.id}` !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
     if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          `${item.id}-${item.variant.id}` === cartItemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.variant.sale_price ?? item.variant.price;
    return total + price * item.quantity;
  }, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartTotal,
  };
  
  if (!isMounted) {
    return (
        <CartContext.Provider value={{ cartItems: [], addToCart: () => {}, removeFromCart: () => {}, updateQuantity: () => {}, cartCount: 0, cartTotal: 0 }}>
            {children}
        </CartContext.Provider>
    );
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

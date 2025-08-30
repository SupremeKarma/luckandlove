'use client';

import type { Product, ProductVariant, CartItem } from '@/lib/types';
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('zenithCart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      localStorage.removeItem('zenithCart');
    } finally {
        setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('zenithCart', JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const addToCart = (product: Product, quantity = 1, variant?: ProductVariant) => {
    setCartItems((prevCart) => {
      const selectedVariant = variant || product.variants?.[0];
      if (!selectedVariant) {
        throw new Error("Product variant not available.");
      }

      const existingItem = prevCart.find((item) => item.id === product.id && item.variant.id === selectedVariant.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id && item.variant.id === selectedVariant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      const price = (selectedVariant.sale_price ?? selectedVariant.price) / 100;
      
      return [...prevCart, { ...product, quantity, price, variant: selectedVariant }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = isMounted ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;
  const cartTotal = isMounted ? cartItems.reduce((total, item) => total + item.price * item.quantity, 0) : 0;


  const value = { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal };

  if (!isMounted) {
    const dummyContext: CartContextType = {
      cartItems: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      cartCount: 0,
      cartTotal: 0,
    };
     return <CartContext.Provider value={dummyContext}>{children}</CartContext.Provider>;
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

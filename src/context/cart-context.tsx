'use client';

import type { Product, CartItem } from '@/lib/types';
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
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

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      const variant = product.variants?.[0];
      const price = variant ? (variant.sale_price ?? variant.price) / 100 : product.price;
      
      return [...prevCart, { ...product, quantity, price, variant: variant }];
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
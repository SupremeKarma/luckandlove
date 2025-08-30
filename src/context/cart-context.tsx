
"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { Product, ProductVariant } from "@/lib/types";
import { useLocalStorage } from "@/hooks/use-local-storage";

export type CartItem = {
  productId: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  sku?: string | null;
  imageUrl?: string | null;
};

type CartContextValue = {
  cartItems: CartItem[];
  addToCart: (product: Product, opts?: { variant?: ProductVariant | null; quantity?: number }) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function getDefaultVariant(product: Product): ProductVariant {
  return {
    id: `default:${product.id}`,
    name: "Default",
    price: product.price,
    inventory_quantity: product.stock,
  };
}

function clampQty(desired: number, stock?: number | null) {
  const q = Math.max(1, Math.floor(desired || 1));
  if (typeof stock === "number" && stock >= 0) return Math.max(0, Math.min(q, stock));
  return q;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("cart:v1", []);

  const addToCart: CartContextValue["addToCart"] = (product, opts) => {
    const variant = opts?.variant ?? (product.variants?.[0] ?? getDefaultVariant(product));
    const quantity = clampQty(opts?.quantity ?? 1, variant.inventory_quantity ?? product.stock);

    if (quantity === 0) return;

    setCartItems((prev) => {
      const idx = prev.findIndex((i) => i.productId === product.id && i.variantId === variant.id);
      if (idx !== -1) {
        const next = [...prev];
        const newQty = clampQty(next[idx].quantity + quantity, variant.inventory_quantity ?? product.stock);
        next[idx] = { ...next[idx], quantity: newQty };
        return next;
        }
      return [
        ...prev,
        {
          productId: product.id,
          variantId: variant.id,
          name: variant.name || product.name,
          price: Number(variant.price ?? product.price ?? 0),
          quantity: quantity,
          sku: product.sku ?? null,
          imageUrl: product.imageUrl ?? null,
        },
      ];
    });
  };

  const removeFromCart: CartContextValue["removeFromCart"] = (productId, variantId) => {
    setCartItems((prev) => prev.filter((i) => !(i.productId === productId && i.variantId === variantId)));
  };

  const updateQuantity: CartContextValue["updateQuantity"] = (productId, variantId, qty) => {
    const q = clampQty(qty);
    if (q === 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.productId === productId && i.variantId === variantId ? { ...i, quantity: q } : i))
    );
  };

  const clearCart = () => setCartItems([]);

  const { cartCount, cartTotal } = useMemo(() => {
    const c = cartItems.reduce((n, i) => n + i.quantity, 0);
    const s = cartItems.reduce((n, i) => n + i.quantity * i.price, 0);
    return { cartCount: c, cartTotal: s };
  }, [cartItems]);

  const value: CartContextValue = { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

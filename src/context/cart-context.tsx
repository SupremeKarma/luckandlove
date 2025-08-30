
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
  items: CartItem[]; // Renamed from cartItems
  addToCart: (product: Product, opts?: { variant?: ProductVariant | null; quantity?: number }) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number; // Renamed from cartTotal
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function getDefaultVariant(product: Product): ProductVariant {
  return {
    id: `default:${product.id}`,
    name: "Default",
    price: product.price,
    stock: product.stock,
    product_id: product.id,
    sku: product.sku,
    attributes: null,
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
    const stock = variant.stock ?? product.stock;
    const quantity = clampQty(opts?.quantity ?? 1, stock);

    if (quantity === 0) return;

    setCartItems((prev) => {
      const idx = prev.findIndex((i) => i.productId === product.id && i.variantId === variant.id);
      if (idx !== -1) {
        const next = [...prev];
        const newQty = clampQty(next[idx].quantity + quantity, stock);
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
          imageUrl: product.image_url ?? null,
        },
      ];
    });
  };

  const removeFromCart: CartContextValue["removeFromCart"] = (productId, variantId) => {
    setCartItems((prev) => prev.filter((i) => !(i.productId === productId && i.variantId === variantId)));
  };

  const updateQuantity: CartContextValue["updateQuantity"] = (productId, variantId, qty) => {
    const itemInCart = cartItems.find(i => i.productId === productId && i.variantId === variantId);
    if(!itemInCart) return;

    // This logic is a bit naive without knowing the product stock.
    // For now, let's just clamp to positive numbers.
    const q = Math.max(0, qty);
    if (q === 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.productId === productId && i.variantId === variantId ? { ...i, quantity: q } : i))
    );
  };

  const clearCart = () => setCartItems([]);

  const { cartCount, subtotal } = useMemo(() => {
    const c = cartItems.reduce((n, i) => n + i.quantity, 0);
    const s = cartItems.reduce((n, i) => n + i.quantity * i.price, 0);
    return { cartCount: c, subtotal: s };
  }, [cartItems]);

  const value: CartContextValue = { items: cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, subtotal };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

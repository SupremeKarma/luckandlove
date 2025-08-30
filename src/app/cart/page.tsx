
'use client';

import { useCart } from '@/context/cart-context';
import CartComponent from '@/components/Cart';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  return (
    <CartComponent
      cartItems={cartItems}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeFromCart}
    />
  );
}

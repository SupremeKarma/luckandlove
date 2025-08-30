
'use client';

import { useCart } from '@/context/cart-context';
import CartComponent from '@/components/Cart';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  return (
    <CartComponent
      cartItems={cart}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeFromCart}
    />
  );
}

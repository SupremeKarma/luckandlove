
'use client';
import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export const CartSheet = ({ isCartOpen, setIsCartOpen }: { isCartOpen: boolean, setIsCartOpen: (isOpen: boolean) => void }) => {
  const { toast } = useToast();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  const currency = useMemo(() => cartItems[0]?.price ? '$' : '', [cartItems]);
  const handleCheckout = () => {
    setIsCartOpen(false);
    // Navigate to checkout, router imported from next/navigation
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-card/80 backdrop-blur-xl shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold">Shopping Cart ({cartCount})</h2>
              <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon" className="hover:bg-white/10">
                <X />
              </Button>
            </div>
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                  <ShoppingCartIcon size={48} className="mb-4" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg">
                    <img src={item.imageUrl || 'https://via.placeholder.com/80'} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                    <div className="flex-grow">
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.variant && <p className="text-sm text-muted-foreground">{item.variant.name}</p>}
                      <p className="text-sm text-accent font-bold">
                        {currency}{(item.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center border border-white/20 rounded-md">
                        <Button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} size="sm" variant="ghost" className="px-2 hover:bg-white/10">-</Button>
                        <span className="px-2">{item.quantity}</span>
                        <Button onClick={() => updateQuantity(item.id, item.quantity + 1)} size="sm" variant="ghost" className="px-2 hover:bg-white/10">+</Button>
                      </div>
                      <Button onClick={() => removeFromCart(item.id)} size="sm" variant="link" className="text-destructive hover:text-destructive/80 text-xs p-0 h-auto">Remove</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl font-bold">{currency}{cartTotal.toFixed(2)}</span>
                </div>
                <Button asChild onClick={handleCheckout} className="w-full bg-accent hover:bg-accent/90 py-3 text-base">
                   <Link href="/checkout">
                    Proceed to Checkout
                   </Link>
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

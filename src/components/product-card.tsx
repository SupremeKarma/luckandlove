
'use client';

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCallback, useMemo } from 'react';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const displayVariant = useMemo(() => product.variants && product.variants[0], [product]);
  const hasSale = useMemo(() => displayVariant && displayVariant.sale_price !== null && displayVariant.sale_price !== undefined, [displayVariant]);
  const displayPrice = useMemo(() => {
      if (!displayVariant) return product.price.toFixed(2);
      return hasSale ? (displayVariant.sale_price! / 100).toFixed(2) : (displayVariant.price / 100).toFixed(2)
    }, [product, displayVariant, hasSale]);
  const originalPrice = useMemo(() => {
      if (!displayVariant) return null;
      return hasSale ? (displayVariant.price / 100).toFixed(2) : null
  }, [displayVariant, hasSale]);


  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.variants && product.variants.length > 1) {
      router.push(`/products/${product.id}`);
      return;
    }

    try {
      addToCart(product, { quantity: 1 });
      toast({
        title: "Added to Cart! 🛒",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error: any) {
      toast({
        title: "Error adding to cart",
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [product, addToCart, toast, router]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/products/${product.id}`}>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm glass-card border-0 text-white overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <div className="relative">
            <Image
              src={product.imageUrl || placeholderImage}
              alt={product.name}
              width={400}
              height={300}
              className="w-full h-64 object-cover transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
            {product.ribbon_text && (
              <div className="absolute top-3 left-3 bg-pink-500/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                {product.ribbon_text}
              </div>
            )}
            <div className="absolute top-3 right-3 bg-primary/80 text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-baseline gap-1.5">
              {hasSale && (
                <span className="line-through opacity-70">${originalPrice}</span>
              )}
              <span>${displayPrice}</span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold truncate">{product.name}</h3>
            <p className="text-sm text-muted-foreground h-10 overflow-hidden">{product.subtitle || product.description}</p>
            <Button onClick={handleAddToCart} className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold">
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};


'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Product } from '@/lib/types';

export default function ProductDetailClientPage({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        <div className="relative h-[400px] w-full overflow-hidden rounded-lg md:h-[500px] bg-card p-4">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            className="object-contain"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-4">
            <p className="text-3xl font-semibold text-accent">${product.price.toFixed(2)}</p>
            {product.rating && (
                <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{product.rating}</span>
                    <span className="text-sm text-muted-foreground">(based on user reviews)</span>
                </div>
            )}
          </div>
          <Separator className="my-6" />
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          
          <div className="mt-6 space-y-4">
            <div className="text-sm font-medium">
              Category: <span className="font-normal text-muted-foreground">{product.category}</span>
            </div>
            <div className="text-sm font-medium">
              Availability: <span className={product.stock > 0 ? "text-green-500" : "text-destructive"}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <Button
            size="lg"
            className="mt-8 w-full md:w-auto"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? <ShoppingCart className="mr-2 h-5 w-5" /> : null}
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </div>
  );
}

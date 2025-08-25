'use client';

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
    >
      <Link href={`/products/${product.id}`} className="block">
        <Card className="flex h-full flex-col overflow-hidden transition-all bg-gray-800/50 border-gray-700 hover:border-primary">
          <CardHeader className="p-0">
            <div className="relative aspect-square w-full">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                data-ai-hint="product image"
              />
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col p-4">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold leading-tight">{product.name}</CardTitle>
               <p className="text-sm text-gray-400 mt-1">{product.category}</p>
            </div>
            <p className="mt-4 text-2xl font-bold text-accent">${product.price.toFixed(2)}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button className="w-full" onClick={handleAddToCart} disabled={product.stock === 0}>
              {product.stock > 0 ? <ShoppingCart className="mr-2 h-4 w-4" /> : null}
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}


'use client';

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link href={`/products/${product.id}`} className="block h-full">
        <Card className="group flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10">
          <CardHeader className="p-0">
            <div className="relative aspect-square w-full">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint="product image"
              />
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col p-4">
            <Badge
              variant="outline"
              className="w-fit"
            >
              {product.category}
            </Badge>
            <CardTitle className="mt-2 text-lg leading-tight flex-grow">{product.name}</CardTitle>
            <CardDescription className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {product.description}
            </CardDescription>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold text-accent">${product.price.toFixed(2)}</span>
              {product.rating && (
                <div className="flex items-center space-x-1">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold">{product.rating}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button
              className="w-full"
              variant="default"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              aria-label="Add to cart"
            >
              <ShoppingCart size={16} className="mr-2" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}

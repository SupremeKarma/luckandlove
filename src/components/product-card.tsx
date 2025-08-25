
'use client';

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Link href={`/products/${product.id}`} className="block h-full">
        <Card className="group flex h-full flex-col bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow-cyan overflow-hidden">
          <div className="relative">
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
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 bg-primary/80 text-white"
            >
              {product.category}
            </Badge>
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            )}
          </div>

          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold gradient-text">${product.price.toFixed(2)}</span>
              {product.rating && (
                <div className="flex items-center space-x-1">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span className="text-sm text-muted-foreground">{product.rating}</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0 p-4 flex-grow flex flex-col">
             <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
              {product.description}
            </p>
            <Button
              variant="neon"
              className="w-full mt-auto"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart size={16} />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

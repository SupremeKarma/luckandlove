
'use client';

import Image from 'next/image';
import type { Product, Shop } from '@/lib/types';
import { ProductList } from '@/components/product-list';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, CircleDollarSign } from 'lucide-react';

export default function ShopDetailClientPage({ shop, products }: { shop: Shop, products: Product[] }) {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card className="mb-8 overflow-hidden">
        <div className="relative h-48 md:h-64 w-full">
          <Image
            src={shop.imageUrl}
            alt={shop.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <CardContent className="p-6 relative">
          <div className="absolute -top-12 left-6">
            <div className="relative h-24 w-24 rounded-md border-4 border-background bg-muted overflow-hidden">
              <Image
                src={shop.imageUrl}
                alt={shop.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="pt-14">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{shop.name}</h1>
            <p className="mt-2 text-muted-foreground">{shop.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <Badge variant="outline">{shop.category}</Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-foreground">{shop.rating}</span>
                <span>rating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{shop.deliveryTimeMinutes} min delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CircleDollarSign className="h-4 w-4" />
                <span>${shop.deliveryFee.toFixed(2)} fee</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Products from {shop.name}</h2>
        {products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>This shop has not added any products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

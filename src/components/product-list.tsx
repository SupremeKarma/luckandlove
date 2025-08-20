'use client';

import { ProductCard } from './product-card';
import type { Product } from '@/lib/types';
import { CATEGORIES } from '@/lib/products';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory);


  return (
    <section>
       <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Our Products</h2>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button
            variant={selectedCategory === 'All' ? 'default' : 'secondary'}
            onClick={() => setSelectedCategory('All')}
            className={cn(selectedCategory === 'All' && "bg-accent hover:bg-accent/90")}
          >
            All
          </Button>
          {CATEGORIES.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? 'default' : 'secondary'}
              onClick={() => setSelectedCategory(category.name)}
              className={cn(selectedCategory === category.name && "bg-accent hover:bg-accent/90")}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

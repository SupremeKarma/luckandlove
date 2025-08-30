
import { ProductCard } from './product-card';
import type { Product } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  loading?: boolean;
}

export function ProductList({ products, loading }: ProductListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-16">
        <p>No products available at the moment.</p>
      </div>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}

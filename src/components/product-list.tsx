import { ProductCard } from './product-card';
import type { Product } from '@/lib/types';

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  return (
    <section>
       <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Our Products</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

import { ProductList } from '@/components/product-list';
import { PRODUCTS } from '@/lib/products';
import { Input } from '@/components/ui/input';

export default function Home() {
  // The search functionality will be implemented in a future step.
  // For now, we will display all products.
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
          Welcome to FutureMart
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Discover the future of online shopping.
        </p>
      </div>

       <div className="mb-8 max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Search products..."
            className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
          />
        </div>

      <ProductList products={PRODUCTS} />
    </div>
  );
}

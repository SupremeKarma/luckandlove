import { ProductList } from '@/components/product-list';
import { Separator } from '@/components/ui/separator';
import { PRODUCTS } from '@/lib/products';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
          Welcome to Zenith Commerce
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Discover our curated collection of high-quality products. Built for the modern shopper.
        </p>
      </div>

      <ProductList products={PRODUCTS} />
    </div>
  );
}

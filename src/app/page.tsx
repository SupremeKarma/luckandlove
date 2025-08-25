'use client';

import { useState, useEffect } from 'react';
import { ProductList } from '@/components/product-list';
import type { Product } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { getSupabase } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const supabase = getSupabase();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!supabase) return;
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Error fetching products', error);
      } else {
        const productsData = data.map(p => ({
          ...p,
          imageUrl: p.image_url, // Remap image_url to imageUrl
        })) as Product[]
        setProducts(productsData);
        setFilteredProducts(productsData);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [supabase]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
      product.category.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <ProductList products={filteredProducts} />
      )}
    </div>
  );
}

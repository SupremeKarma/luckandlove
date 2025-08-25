'use client';

import { useSearchParams } from 'next/navigation';
import { ProductList } from '@/components/product-list';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { getSupabase } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

const supabase = getSupabase();

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category');
  const selectedSubcategory = searchParams.get('subcategory');
  const searchTerm = searchParams.get('search');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      let query = supabase.from('products').select('*');

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }
      if (selectedSubcategory) {
        query = query.eq('subcategory', selectedSubcategory);
      }
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } else {
        const productsData = data.map(p => ({
          ...p,
          imageUrl: p.image_url,
        })) as Product[]
        setProducts(productsData);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [selectedCategory, selectedSubcategory, searchTerm]);


  const pageTitle = searchTerm 
    ? `Search Results for "${searchTerm}"`
    : selectedSubcategory 
      ? `${selectedSubcategory}` 
      : selectedCategory 
        ? selectedCategory 
        : 'All Products';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          {pageTitle}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our wide range of products.
        </p>
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
        <>
          <ProductList products={products} />
          {products.length === 0 && (
            <div className="text-center text-muted-foreground mt-8">
              No products found for this selection.
            </div>
          )}
        </>
      )}
    </div>
  );
}

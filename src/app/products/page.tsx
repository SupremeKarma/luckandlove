
'use client';

import { useSearchParams } from 'next/navigation';
import { ProductList } from '@/components/product-list';
import { useEffect, useState, Suspense } from 'react';
import type { Product } from '@/lib/types';
import { getSupabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import type { SupabaseClient } from '@supabase/supabase-js';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  const selectedCategory = searchParams.get('category');
  const selectedSubcategory = searchParams.get('subcategory');
  const searchTerm = searchParams.get('search');

  useEffect(() => {
    try {
      const supabaseClient = getSupabase();
      setSupabase(supabaseClient);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const fetchProducts = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      };
      
      setLoading(true);
      
      try {
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
          throw error;
        }

        if (data) {
          const productsData = data.map(p => ({
            ...p,
            imageUrl: p.image_url,
          })) as Product[]
          setProducts(productsData);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (supabase) {
      fetchProducts();
    }
  }, [supabase, selectedCategory, selectedSubcategory, searchTerm]);


  const pageTitle = searchTerm 
    ? `Search Results for "${searchTerm}"`
    : selectedSubcategory 
      ? `${selectedSubcategory}` 
      : selectedCategory 
        ? selectedCategory 
        : 'All Products';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-2 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
          {pageTitle}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse our collection of high-quality products.
        </p>
      </div>
      
      {loading ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            <div className="text-center text-muted-foreground mt-16">
              <p className="text-xl">No products found for this selection.</p>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductsPageContent />
        </Suspense>
    )
}

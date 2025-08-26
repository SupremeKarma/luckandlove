
'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { getSupabase } from '@/lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductList } from './product-list';

export function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

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
      }

      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(8); // Limit to 8 products for the showcase

        if (error) {
          throw error;
        }

        if (data) {
          const productsData = data.map((p) => ({
            ...p,
            imageUrl: p.image_url,
          })) as Product[];
          setProducts(productsData);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (supabase) {
      fetchProducts();
    }
  }, [supabase]);

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover a selection of our finest products, curated just for you.
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
                <p className="text-xl">No products found.</p>
                <p>Check back later for new arrivals.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

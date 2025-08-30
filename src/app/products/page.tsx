
'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { ProductList } from '@/components/product-list';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { getSupabase } from '@/lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

function ProductsPageContent() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
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
      };
      
      setLoading(true);
      
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            variants:product_variants(*)
          `);

        const { data, error } = await query;
        
        if (error) {
          throw error;
        }

        if (data) {
          const productsData = data.map(p => ({
            ...p,
            name: p.name,
            imageUrl: p.image_url,
            variants: p.variants.map((v: any) => ({
              ...v,
              price: v.price_in_cents,
              sale_price: v.sale_price_in_cents,
              inventory_quantity: v.inventory_quantity
            }))
          })) as Product[]
          setAllProducts(productsData);
        } else {
          setAllProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (supabase) {
      fetchProducts();
    }
  }, [supabase]);


  return (
     <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">Zenith Store</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Discover exclusive products, curated just for you. Your next favorite item is just a click away.</p>
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
          <ProductList products={allProducts} />
          {allProducts.length === 0 && (
            <div className="text-center text-muted-foreground mt-16">
              <p className="text-xl">No products found.</p>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductsPageContent />
        </Suspense>
    )
}

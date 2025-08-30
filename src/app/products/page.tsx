
'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { ProductList } from '@/components/product-list';
import { CardSkeleton } from '@/components/ui/skeletons';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { getSupabase } from '@/lib/supabase';
import { mapProductRow } from '@/lib/types';


function ProductsPageContent() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = getSupabase();
        setLoading(true);
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        if (productsData) {
            setAllProducts(productsData.map(mapProductRow));
        } else {
          setAllProducts([]);
        }
      } catch (err: any) {
        console.error("Error fetching products:", err.message);
        setError("Could not load products.");
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


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
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-destructive mt-16">
          <p className="text-xl">{error}</p>
        </div>
      ) : (
        <>
          <ProductList products={allProducts} />
          {allProducts.length === 0 && (
            <div className="text-center text-muted-foreground mt-16">
              <p className="text-xl">No products found.</p>
              <p>Check back later for new arrivals.</p>
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

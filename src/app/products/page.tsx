
'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { ProductList } from '@/components/product-list';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import type { Product, ProductVariant } from '@/lib/types';
import { getSupabase } from '@/lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

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
          .select('*');

        if (productsError) throw productsError;

        if (productsData) {
            const productIds = productsData.map(p => p.id);
            const { data: variantsData, error: variantsError } = await supabase
                .from('product_variants')
                .select('*')
                .in('product_id', productIds);

            if (variantsError) throw variantsError;

            const productsWithVariants = productsData.map(p => {
              const productVariants = variantsData?.filter(v => v.product_id === p.id) || [];
              const priceInCents = productVariants.length > 0 ? (productVariants[0].sale_price_in_cents ?? productVariants[0].price_in_cents) : p.price_in_cents;

              return {
                ...p,
                name: p.name,
                price: priceInCents / 100,
                imageUrl: p.image_url,
                variants: productVariants.map(v => ({
                    ...v,
                    price: v.price_in_cents,
                    sale_price: v.sale_price_in_cents,
                    inventory_quantity: v.inventory_quantity
                }))
              } as Product
            });
            
            setAllProducts(productsWithVariants);
        } else {
          setAllProducts([]);
        }
      } catch (err: any) {
        console.error("Error fetching products:", err.message);
        setError(err.message);
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
            <div key={i} className="space-y-2">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-destructive mt-16">
          <p className="text-xl">Could not load products.</p>
          <p>{error}</p>
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

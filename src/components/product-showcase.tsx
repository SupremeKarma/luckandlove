
'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { getSupabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductList } from './product-list';

export function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const supabase = getSupabase();
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .limit(8);

        if (productsError) throw productsError;

        if (productsData) {
            const productIds = productsData.map(p => p.id);
            let variantsData: any[] = [];
            try {
                const { data, error: variantsError } = await supabase
                    .from('product_variants')
                    .select('*')
                    .in('product_id', productIds);
                if (variantsError) throw variantsError;
                variantsData = data || [];
            } catch(variantError) {
                console.warn("Could not fetch product_variants. This might be expected if the table doesn't exist.", variantError);
            }

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
              } as Product;
            });
            setProducts(productsWithVariants);
        } else {
          setProducts([]);
        }
      } catch (err: any) {
        console.error('Error fetching products:', err.message || err);
        setError('Could not load featured products.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
        ) : error ? (
          <div className="text-center text-destructive mt-16">
             <p className="text-xl">{error}</p>
          </div>
        ) : (
          <>
            <ProductList products={products} />
            {products.length === 0 && (
              <div className="text-center text-muted-foreground mt-16">
                <p className="text-xl">No products found.</p>
                <p>Check back later for new arrivals.</p>
              
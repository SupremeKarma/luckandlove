
'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { Product, Shop } from '@/lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductList } from '@/components/product-list';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, CircleDollarSign } from 'lucide-react';

export async function generateStaticParams() {
  try {
    const supabase = getSupabase();
    const { data: shops } = await supabase.from('shops').select('id');

    if (!shops) {
      return [];
    }

    return shops.map((shop) => ({
      shopId: shop.id.toString(),
    }));
  } catch (error) {
    console.error("Failed to generate static params for shops", error);
    return [];
  }
}

export default function ShopDetailPage() {
  const params = useParams();
  const shopId = params.shopId as string;

  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    try {
      const supabaseClient = getSupabase();
      setSupabase(supabaseClient);
    } catch (error) {
      console.error(error);
      setError('Could not connect to database.');
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const fetchShopAndProducts = async () => {
      if (!supabase || !shopId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);

        // Fetch shop details
        const { data: shopData, error: shopError } = await supabase
          .from('shops')
          .select('*')
          .eq('id', shopId)
          .single();

        if (shopError) throw new Error(`Shop fetch failed: ${shopError.message}`);
        if (!shopData) throw new Error('Shop not found.');
        
        setShop({ ...shopData, imageUrl: shopData.image_url, deliveryTimeMinutes: shopData.delivery_time_minutes, deliveryFee: shopData.delivery_fee } as Shop);
        
        // Fetch products for the shop
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('shop_id', shopId);

        if (productsError) throw new Error(`Products fetch failed: ${productsError.message}`);
        
        const mappedProducts = productsData.map(p => ({...p, imageUrl: p.image_url})) as Product[];
        setProducts(mappedProducts);

      } catch (err: any) {
        console.error(`Failed to fetch shop details: ${err.message}`);
        setError(`Failed to load shop: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (supabase && shopId) {
      fetchShopAndProducts();
    }
  }, [supabase, shopId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Skeleton className="h-48 w-full rounded-lg mb-8" />
        <div className="space-y-4 mb-12">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center text-center text-xl text-destructive">
        {error}
      </div>
    );
  }
    
  if (!shop) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center text-center text-xl text-muted-foreground">
        Shop not found.
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card className="mb-8 overflow-hidden">
        <div className="relative h-48 md:h-64 w-full">
            <Image
                src={shop.imageUrl}
                alt={shop.name}
                fill
                className="object-cover"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <CardContent className="p-6 relative">
          <div className="absolute -top-12 left-6">
              <div className="relative h-24 w-24 rounded-md border-4 border-background bg-muted overflow-hidden">
                   <Image
                      src={shop.imageUrl}
                      alt={shop.name}
                      fill
                      className="object-cover"
                   />
              </div>
          </div>
          <div className="pt-14">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{shop.name}</h1>
            <p className="mt-2 text-muted-foreground">{shop.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <Badge variant="outline">{shop.category}</Badge>
              <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-foreground">{shop.rating}</span>
                  <span>rating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{shop.deliveryTimeMinutes} min delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CircleDollarSign className="h-4 w-4" />
                <span>${shop.deliveryFee.toFixed(2)} fee</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Products from {shop.name}</h2>
        {products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>This shop has not added any products yet.</p>
          </div>
        )}
      </div>

    </div>
  );
}

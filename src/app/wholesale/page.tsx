
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Star, Clock, CircleDollarSign } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import type { Shop } from '@/lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const WholesalePage = () => {
  const [search, setSearch] = useState('');
  const [shops, setShops] = useState<Shop[]>([]);
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
    const fetchShops = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('shops')
          .select('*')
          .eq('category', 'Wholesale');
          
        if (error) throw error;
        if (data) {
          const shopsData = data.map(s => ({
            ...s,
            imageUrl: s.image_url,
            deliveryTimeMinutes: s.delivery_time_minutes,
            deliveryFee: s.delivery_fee,
          })) as Shop[];
          setShops(shopsData);
        }
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoading(false);
      }
    };

    if (supabase) {
      fetchShops();
    }
  }, [supabase]);

  const filteredShops = shops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
          Wholesale Shopping
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Stock up on essentials. Get bulk items delivered directly to you.
        </p>
      </div>

      <div className="mb-8 max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search wholesale shops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11"
          />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="space-y-4 p-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop, index) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                <CardHeader className="p-0">
                    <div className="relative aspect-video w-full">
                      <Image 
                        src={shop.imageUrl} 
                        alt={shop.name} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={`${shop.category} market`}
                      />
                       <Badge className="absolute top-2 right-2 flex items-center gap-1">
                          <Star className="h-3 w-3" /> {shop.rating.toFixed(1)}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col flex-1">
                  <Badge variant="outline" className="w-fit mb-2">{shop.category}</Badge>
                  <CardTitle className="text-xl font-semibold">{shop.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 flex-grow">{shop.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{shop.deliveryTimeMinutes} min</span>
                    </div>
                     <div className="flex items-center gap-1.5">
                      <CircleDollarSign className="h-4 w-4" />
                      <span>${shop.deliveryFee.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button asChild className="w-full mt-4">
                    <Link href={`/shop/${shop.id}`}>View Products</Link>
                  </Button>
                </CardContent>
              </Card>
             </motion.div>
          ))}
        </div>
      )}
       {filteredShops.length === 0 && !loading && (
          <div className="text-center text-muted-foreground mt-8">
            <p>No wholesale shops found for "{search}".</p>
          </div>
        )}
    </div>
  );
};

export default WholesalePage;


'use client';

import { useSearchParams } from 'next/navigation';
import { ProductList } from '@/components/product-list';
import { useEffect, useState, Suspense, useMemo } from 'react';
import type { Product } from '@/lib/types';
import { getSupabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import type { SupabaseClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  const initialCategory = searchParams.get('category') || 'all';
  const initialSubcategory = searchParams.get('subcategory');
  const initialSearchTerm = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('rating');


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

  const categories = useMemo(() => ['all', ...new Set(allProducts.map(p => p.category))], [allProducts]);

  useEffect(() => {
    let filtered = allProducts.filter(p => 
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    // Apply initial subcategory filter if present
    if(initialSubcategory) {
        filtered = filtered.filter(p => p.subcategory === initialSubcategory);
    }

    filtered.sort((a, b) => {
      const priceA = a.variants?.[0]?.sale_price ?? a.variants?.[0]?.price ?? a.price;
      const priceB = b.variants?.[0]?.sale_price ?? b.variants?.[0]?.price ?? b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
      return a.name.localeCompare(b.name);
    });

    setFilteredProducts(filtered);
  }, [searchTerm, category, sortBy, allProducts, initialSubcategory]);


  const pageTitle = searchTerm 
    ? `Search Results for "${searchTerm}"`
    : category !== 'all'
      ? category
      : 'All Products';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-accent mb-4 capitalize">{pageTitle}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Explore our curated collection of high-quality items. Find exactly what you need with our advanced filtering options.</p>
      </div>

       <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-primary/30 rounded-lg">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Search products..." 
            className="pl-10 bg-primary/50 border-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-[180px] bg-primary/50 border-gray-600">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px] bg-primary/50 border-gray-600">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Sort by Rating</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
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
          <ProductList products={filteredProducts} />
          {filteredProducts.length === 0 && (
            <div className="text-center text-muted-foreground mt-16">
              <p className="text-xl">No products found for this selection.</p>
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

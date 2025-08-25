'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter } from 'lucide-react';
import { getSupabase } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

const categories = ['All', 'Electronics', 'Fashion', 'Books', 'Furniture', 'Health & Beauty', 'Sports & Entertainment', 'Home & Garden', 'Food & Drink'];

export default function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const supabase = getSupabase();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!supabase) return;
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Error fetching products', error);
      } else {
        const productsData = data.map(p => ({
          ...p,
          imageUrl: p.image_url, // Remap image_url to imageUrl
        })) as Product[]
        setProducts(productsData);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [supabase]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search the quantum marketplace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/50 border-primary/30 h-12"
              />
            </div>
            <Button variant="glow" size="lg">
              <Filter size={16} />
              Advanced Filters
            </Button>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full bg-card/50 border border-primary/30 h-12">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-base"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Featured Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center neon-text">Featured Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Electronics", icon: "⚡", count: "2.5K+" },
              { name: "Food & Drink", icon: "🍕", count: "1.2K+" },
              { name: "Gaming", icon: "🎮", count: "800+" },
              { name: "Fashion", icon: "👕", count: "1.8K+" }
            ].map((category, index) => (
              <div
                key={category.name}
                className="group cursor-pointer p-6 bg-card/50 border border-primary/20 rounded-lg hover:border-primary/50 transition-all duration-300 hover:shadow-glow-cyan text-center"
                onClick={() => setSelectedCategory(category.name === "Food & Drink" ? "Food & Drink" : category.name === "Gaming" ? "Sports & Entertainment" : category.name)}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count} items</p>
              </div>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCategory === "All" ? "All Products" : selectedCategory}
            </h2>
            <span className="text-muted-foreground">
              {filteredProducts.length} products found
            </span>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-secondary p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Ready to Experience the Future?
          </h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Join millions of users already exploring our multi-platform ecosystem. 
            Shop, eat, rent, game, and connect in one revolutionary app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg">
              Explore All Platforms
            </Button>
            <Button variant="glow" size="lg">
              Join Community
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
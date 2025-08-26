
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const FoodDeliveryPage = () => {
  const [search, setSearch] = useState('');
  
  const restaurants = [
    { id: '1', name: 'Pizza Palace', image: 'https://picsum.photos/600/400', category: 'Fast Food', hint: 'pizza restaurant' },
    { id: '2', name: 'Sushi Stop', image: 'https://picsum.photos/600/400', category: 'Japanese', hint: 'sushi restaurant' },
    { id: '3', name: 'Burger Barn', image: 'https://picsum.photos/600/400', category: 'American', hint: 'burger joint' },
    { id: '4', name: 'Taco Town', image: 'https://picsum.photos/600/400', category: 'Mexican', hint: 'taco stand' },
    { id: '5', name: 'Pasta Place', image: 'https://picsum.photos/600/400', category: 'Italian', hint: 'italian pasta' },
    { id: '6', name: 'Salad Station', image: 'https://picsum.photos/600/400', category: 'Healthy', hint: 'fresh salad' },
  ];

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
          Order Food Delivery
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Craving something? Find your favorite restaurants and get it delivered to your door.
        </p>
      </div>

      <div className="mb-8 max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search restaurants or dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11"
          />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant, index) => (
          <motion.div
            key={restaurant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            <Card className="flex h-full flex-col overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
              <CardHeader className="p-0">
                  <div className="relative aspect-video w-full">
                    <Image 
                      src={restaurant.image} 
                      alt={restaurant.name} 
                      width={600}
                      height={400}
                      className="object-cover"
                      data-ai-hint={restaurant.hint}
                    />
                  </div>
              </CardHeader>
              <CardContent className="p-4 flex flex-col flex-1">
                <CardTitle className="text-xl font-semibold">{restaurant.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{restaurant.category}</p>
                <div className="flex-grow" />
                <Button className="w-full mt-4">View Menu</Button>
              </CardContent>
            </Card>
           </motion.div>
        ))}
      </div>
       {filteredRestaurants.length === 0 && (
          <div className="text-center text-muted-foreground mt-8">
            <p>No restaurants found for "{search}". Try a different search.</p>
          </div>
        )}
    </div>
  );
};

export default FoodDeliveryPage;

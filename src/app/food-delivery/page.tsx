'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';

const FoodDeliveryPage = () => {
  const [search, setSearch] = useState('');
  
  const restaurants = [
    { id: '1', name: 'Pizza Palace', image: 'https://placehold.co/600x400.png', category: 'Fast Food', hint: 'pizza restaurant' },
    { id: '2', name: 'Sushi Stop', image: 'https://placehold.co/600x400.png', category: 'Japanese', hint: 'sushi restaurant' },
    { id: '3', name: 'Burger Barn', image: 'https://placehold.co/600x400.png', category: 'American', hint: 'burger joint' },
    { id: '4', name: 'Taco Town', image: 'https://placehold.co/600x400.png', category: 'Mexican', hint: 'taco stand' },
    { id: '5', name: 'Pasta Place', image: 'https://placehold.co/600x400.png', category: 'Italian', hint: 'italian pasta' },
    { id: '6', name: 'Salad Station', image: 'https://placehold.co/600x400.png', category: 'Healthy', hint: 'fresh salad' },
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
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Craving something? Find your favorite restaurants and dishes, delivered right to your door.
        </p>
      </div>

      <div className="mb-8 max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Search restaurants or dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
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
            <Card className="flex h-full flex-col overflow-hidden transition-all bg-gray-800/50 border-gray-700 hover:border-primary">
              <CardHeader className="p-0">
                  <div className="relative aspect-video w-full">
                    <Image 
                      src={restaurant.image} 
                      alt={restaurant.name} 
                      fill 
                      className="object-cover"
                      data-ai-hint={restaurant.hint}
                    />
                  </div>
              </CardHeader>
              <CardContent className="p-4 flex flex-col flex-1">
                <CardTitle className="text-xl font-semibold">{restaurant.name}</CardTitle>
                <p className="text-sm text-gray-400 mt-1">{restaurant.category}</p>
                <div className="flex-grow" />
                <Button className="w-full mt-4">View Menu</Button>
              </CardContent>
            </Card>
           </motion.div>
        ))}
      </div>
       {filteredRestaurants.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <p>No restaurants found for "{search}". Try a different search.</p>
          </div>
        )}
    </div>
  );
};

export default FoodDeliveryPage;

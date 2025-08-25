'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';

const RentalsPage = () => {
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const listings = [
    { id: '1', type: 'Apartment', name: 'Cozy Apartment', image: 'https://placehold.co/600x400.png', price: 1200, location: 'Downtown', hint: 'modern apartment' },
    { id: '2', type: 'Car', name: 'Luxury Sedan', image: 'https://placehold.co/600x400.png', price: 50, location: 'Airport', hint: 'luxury car' },
    { id: '3', type: 'House', name: 'Suburban Family Home', image: 'https://placehold.co/600x400.png', price: 2500, location: 'Maplewood', hint: 'suburban house' },
    { id: '4', type: 'SUV', name: 'Reliable SUV', image: 'https://placehold.co/600x400.png', price: 75, location: 'City Center', hint: 'family suv' },
  ];

  const filteredListings = listings.filter(
    (listing) =>
      listing.location.toLowerCase().includes(location.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
          Find Your Next Rental
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Search for apartments, houses, and cars to rent in your area.
        </p>
      </div>

      <div className="mb-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
        <Input
          type="text"
          placeholder="Enter a location (e.g., Downtown)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 flex-1"
        />
        <Input
          type="text"
          placeholder="Price Range (e.g., $1000-$2000)"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 flex-1"
        />
         <Button>Search</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing, index) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            <Card className="flex h-full flex-col overflow-hidden transition-all bg-gray-800/50 border-gray-700 hover:border-primary">
               <CardHeader className="p-0">
                  <div className="relative aspect-video w-full">
                    <Image 
                      src={listing.image} 
                      alt={listing.name} 
                      fill 
                      className="object-cover"
                      data-ai-hint={listing.hint}
                    />
                  </div>
              </CardHeader>
              <CardContent className="p-4 flex flex-col flex-1">
                <CardTitle className="text-xl font-semibold">{listing.name}</CardTitle>
                <p className="text-sm text-gray-400 mt-1">Location: {listing.location}</p>
                 <p className="text-lg font-bold text-accent mt-2">
                  ${listing.price.toFixed(2)}
                  <span className="text-sm font-normal text-gray-400">
                    {listing.type === 'Car' || listing.type === 'SUV' ? '/day' : '/month'}
                  </span>
                </p>
                <div className="flex-grow" />
                <Button className="w-full mt-4">View Details</Button>
              </CardContent>
            </Card>
           </motion.div>
        ))}
      </div>
       {filteredListings.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <p>No listings found for "{location}". Try a different location.</p>
          </div>
        )}
    </div>
  );
};

export default RentalsPage;

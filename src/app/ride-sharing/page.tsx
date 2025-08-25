'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RideSharingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
          Book a Ride
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Fast, reliable, and convenient. Inspired by Pathao and inDrive.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-lg mx-auto bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="text-accent" />
              Where are you going?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Enter pickup location"
                className="pl-10 bg-gray-900/70"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <Input
                placeholder="Enter destination"
                className="pl-10 bg-gray-900/70"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Button className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Search for Rides
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}


'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, Search, ArrowRightLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RideSharingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-2 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
          Book a Ride
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Fast, reliable, and convenient. Get where you need to go.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MapPin className="text-primary" />
              Where are you going?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Enter pickup location"
                className="pl-10 h-12"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Enter destination"
                className="pl-10 h-12"
              />
            </div>
            <Button size="lg" className="w-full h-12 text-base">
              <Search className="mr-2 h-5 w-5" />
              Search for Rides
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

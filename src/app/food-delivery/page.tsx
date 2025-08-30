
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed } from 'lucide-react';

export default function FoodDeliveryPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">Food Delivery</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get your favorite meals delivered right to your doorstep. Fast, fresh, and delicious.
        </p>
      </div>

       <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <UtensilsCrossed className="w-8 h-8 text-accent" />
              <span>Food Delivery Service Coming Soon</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We're cooking up something special! Our food delivery service will be available soon, bringing the best local restaurants to you.
            </p>
          </CardContent>
        </Card>
    </motion.div>
  );
}

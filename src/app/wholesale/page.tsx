
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store } from 'lucide-react';

export default function WholesalePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">Wholesale</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Bulk orders and special pricing for our business partners.
        </p>
      </div>

       <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <Store className="w-8 h-8 text-accent" />
              <span>Wholesale Portal Coming Soon</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We are currently setting up our wholesale purchasing platform. Soon you'll be able to place bulk orders with special partner pricing. Stay tuned for updates!
            </p>
          </CardContent>
        </Card>
    </motion.div>
  );
}

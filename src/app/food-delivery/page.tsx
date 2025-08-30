
'use client';

import { motion } from 'framer-motion';

export default function FoodDeliveryPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold text-accent mb-8">Food Delivery</h1>
      <div className="bg-card/50 p-8 rounded-lg shadow-lg">
        <p className="text-muted-foreground text-lg">
          Browse restaurants and get your favorite food delivered to your doorstep. Feature coming soon!
        </p>
      </div>
    </motion.div>
  );
}

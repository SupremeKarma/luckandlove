
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const Success = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-16 flex items-center justify-center text-center min-h-[calc(100vh-10rem)]"
    >
      <div className="glass-effect p-8 md:p-12 rounded-2xl max-w-2xl w-full">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
        >
          <CheckCircle className="h-24 w-24 text-green-400 mx-auto mb-6" />
        </motion.div>
        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Thank you for your purchase. Your order is being processed and you will receive a confirmation email shortly.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/products">
            <Button size="lg" variant="outline">Continue Shopping</Button>
          </Link>
          <Link href="/account">
            <Button size="lg">View My Orders</Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Success;


'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CancelPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-16"
    >
      <Card className="w-full max-w-lg text-center glass-effect">
        <CardHeader>
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
          >
            <XCircle className="w-20 h-20 text-destructive mx-auto mb-4" />
          </motion.div>
          <CardTitle className="text-3xl font-bold">Payment Canceled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-lg">
            Your payment was canceled. You have not been charged.
          </p>
          <p className="text-muted-foreground">
            If you'd like to try again, please return to your cart.
          </p>
        </CardContent>
        <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/cart">Return to Cart</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

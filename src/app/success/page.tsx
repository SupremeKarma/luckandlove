
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuccessPage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-16"
    >
      <Card className="w-full max-w-lg text-center glass-effect">
        <CardHeader>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          >
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
          </motion.div>
          <CardTitle className="text-3xl font-bold">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-lg">
            Thank you for your purchase. Your order has been confirmed and is being processed.
          </p>
          <p className="text-muted-foreground">
            You will receive an email confirmation shortly.
          </p>
        </CardContent>
        <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
           <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
           <Button asChild variant="outline">
            <Link href="/account">View Order History</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}


'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function AdminProductsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
      </div>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Manage Products</CardTitle>
           <CardDescription>
            Add, edit, and manage all products in your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Product management features will be available here soon.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

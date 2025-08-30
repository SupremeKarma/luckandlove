
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function AdminOrdersPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Orders</h1>
      </div>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Manage Orders</CardTitle>
           <CardDescription>
            View and manage all customer orders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Order management features will be available here soon.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

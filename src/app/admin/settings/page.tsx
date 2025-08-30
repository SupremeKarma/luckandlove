
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function AdminSettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Store Settings</CardTitle>
           <CardDescription>
            Manage your store's settings and configurations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Settings management features will be available here soon.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

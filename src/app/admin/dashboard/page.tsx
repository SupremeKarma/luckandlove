
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Package, AlertTriangle } from 'lucide-react';
import { mockProducts, mockOrders, fmt } from '@/components/store/types';

function KPI({ title, value, icon, hint }: { title: string; value: string; icon: React.ReactNode; hint?: string }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const revenue = mockOrders.filter((o) => ["paid", "shipped"].includes(o.status)).reduce((s, o) => s + o.total, 0);
  const openOrders = mockOrders.filter((o) => ["pending", "paid"].includes(o.status)).length;
  const activeProducts = mockProducts.filter(p => p.active).length;
  const lowStock = mockProducts.filter((p) => p.stock <= 5).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPI title="Total Revenue" value={fmt.currency(revenue)} icon={<DollarSign className="h-5 w-5" />} hint="Paid & shipped" />
        <KPI title="Open Orders" value={String(openOrders)} icon={<ShoppingCart className="h-5 w-5" />} hint="Pending / paid" />
        <KPI title="Active Products" value={String(activeProducts)} icon={<Package className="h-5 w-5" />} hint="Visible" />
        <KPI title="Low Stock" value={String(lowStock)} icon={<AlertTriangle className="h-5 w-5" />} hint="≤ 5 units" />
      </div>

       <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            An overview of recent store activities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent activity to show.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}


'use client';

import { RequireRole } from '@/components/require-role';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Package, AlertTriangle } from 'lucide-react';

function KPI({ title, value, icon, hint }: { title: string; value: string; icon: React.ReactNode; hint?: string }) {
  return (
    <Card className="glass-effect">
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


function AdminDashboardContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <h1 className="text-4xl font-bold text-gradient mb-8">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <KPI title="Total Revenue" value="$0.00" icon={<DollarSign className="h-5 w-5" />} hint="All time" />
        <KPI title="Open Orders" value="0" icon={<ShoppingCart className="h-5 w-5" />} hint="Pending / paid" />
        <KPI title="Active Products" value="0" icon={<Package className="h-5 w-5" />} hint="Visible" />
        <KPI title="Low Stock" value="0" icon={<AlertTriangle className="h-5 w-5" />} hint="≤ 5 units" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome, Admin!</CardTitle>
          <CardDescription>
            This is your central hub for managing the entire marketplace. Use the navigation to manage products, orders, users, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">More dashboard widgets and analytics will be available here soon.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  return (
    <RequireRole role="admin" redirectTo="/not-authorized">
      <AdminDashboardContent />
    </RequireRole>
  );
}


'use client';

import { RequireRole } from '@/components/require-role';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';

function AdminUsersContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <h1 className="text-4xl font-bold text-accent mb-8">Admin: User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
           <CardDescription>
            A protected area for admins to manage user roles and permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">User management features will be available here soon.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AdminUsersPage() {
  return (
    <RequireRole role="admin" redirectTo="/not-authorized">
      <AdminUsersContent />
    </RequireRole>
  );
}


'use client';

import { Overview } from '@/components/store/views';
import { mockProducts, mockOrders } from '@/components/store/types';
import { motion } from 'framer-motion';

export default function AdminDashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Overview products={mockProducts} />
    </motion.div>
  );
}

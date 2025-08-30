'use client';

import React from 'react';
import { OrdersIndex, OrderDetail } from '@/components/store/views';
import { mockOrders } from '@/components/store/types';
import { motion } from 'framer-motion';
import type { Order } from '@/components/store/types';

export default function AdminOrdersPage() {
  const [view, setView] = React.useState<'index' | 'detail'>('index');
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);
  const [orders, setOrders] = React.useState(mockOrders);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const handleOpenOrder = (id: string) => {
    setSelectedOrderId(id);
    setView('detail');
  };

  const handleBack = () => {
    setView('index');
    setSelectedOrderId(null);
  };
  
  const handleUpdateOrder = (partial: Partial<Order>) => {
    if (!selectedOrderId) return;
    setOrders(prev => prev.map(o => (o.id === selectedOrderId ? { ...o, ...partial } : o)))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {view === 'index' && (
        <OrdersIndex orders={orders} onOpen={handleOpenOrder} onExport={() => alert("Exporting not implemented yet.")} />
      )}
      {view === 'detail' && selectedOrder && (
        <OrderDetail order={selectedOrder} onBack={handleBack} onUpdate={handleUpdateOrder} />
      )}
    </motion.div>
  );
}
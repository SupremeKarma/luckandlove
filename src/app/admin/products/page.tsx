
'use client';

import React from 'react';
import { ProductsIndex, ProductEditor } from '@/components/store/views';
import { mockProducts } from '@/components/store/types';
import { motion } from 'framer-motion';
import type { Product } from '@/components/store/types';

export default function AdminProductsPage() {
  const [view, setView] = React.useState<'index' | 'editor'>('index');
  const [products, setProducts] = React.useState(mockProducts);
  // In a real app, you'd pass an ID here or nothing for a new product
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);

  const handleEdit = (id: string) => {
    setSelectedProductId(id);
    setView('editor');
  };

  const handleAdd = () => {
    setSelectedProductId(null);
    setView('editor');
  };

  const handleBack = () => {
    setView('index');
    setSelectedProductId(null);
  };

  const handleSave = (p: Product) => {
    setProducts((prev) => {
      const i = prev.findIndex((x) => x.id === p.id);
      if (i === -1) return [p, ...prev]; // New product
      const next = [...prev];
      next[i] = p; // Existing product
      return next;
    });
    setView('index');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {view === 'index' && <ProductsIndex products={products} onEdit={handleEdit} onAdd={handleAdd} />}
      {view === 'editor' && <ProductEditor onBack={handleBack} onSave={handleSave
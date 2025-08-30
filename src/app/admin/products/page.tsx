
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

  const selectedProduct = products.find(p => p.id === selectedProductId) || undefined;

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
      // If it's a new product (no id match) or an existing one
      const i = selectedProductId ? prev.findIndex((x) => x.id === p.id) : -1;
      if (i === -1) { // New product
        const newProduct = { ...p, id: `p_${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString() };
        return [newProduct, ...prev];
      } else { // Existing product
        const next = [...prev];
        next[i] = p;
        return next;
      }
    });
    setView('index');
    setSelectedProductId(null);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {view === 'index' && <ProductsIndex products={products} onEdit={handleEdit} onAdd={handleAdd} />}
      {view === 'editor' && <ProductEditor product={selectedProduct} onBack={
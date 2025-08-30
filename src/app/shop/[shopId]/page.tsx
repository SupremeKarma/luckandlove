
'use client';

import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';

const PageComponent = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="container mx-auto px-4 py-8"
  >
    <h1 className="text-4xl font-bold text-accent mb-8">{title}</h1>
    {children}
  </motion.div>
);

const ShopDetail = () => {
  const params = useParams();
  const shopId = params.shopId as string;

  return (
    <PageComponent title={`Shop Details: ${shopId}`}>
      <p>This page will show details for a specific food or wholesale shop.</p>
    </PageComponent>
  );
};

export default ShopDetail;

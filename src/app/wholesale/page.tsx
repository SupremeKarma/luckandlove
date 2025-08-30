
'use client';

import { motion } from 'framer-motion';

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

const WholesalePage = () => (
  <PageComponent title="Wholesale">
    <div className="bg-card/50 p-8 rounded-lg shadow-lg">
        <p className="text-muted-foreground text-lg">
            Find suppliers for your business with our wholesale listings. Feature coming soon!
        </p>
    </div>
  </PageComponent>
);

export default WholesalePage;

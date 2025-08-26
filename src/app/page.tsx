
'use client';

import { HeroSection } from '@/components/HeroSection';
import { ServicesShowcase } from '@/components/services-showcase';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ServicesShowcase />
    </div>
  );
}

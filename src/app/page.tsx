
'use client';

import { HeroSection } from '@/components/HeroSection';
import { FeaturesShowcase } from '@/components/features-showcase';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesShowcase />
    </div>
  );
}

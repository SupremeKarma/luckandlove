
'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Gamepad2, Utensils, Car, Home } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

const services = [
  {
    title: 'Gaming Tournaments',
    description: 'Compete in exclusive tournaments for massive prizes. Join a thriving community of gamers and rise to the top.',
    icon: Gamepad2,
    href: '/gaming',
    color: 'from-purple-500/10 to-indigo-500/10',
    borderColor: 'border-purple-500/30',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
  },
  {
    title: 'Food Delivery',
    description: 'Craving something delicious? Get your favorite meals delivered to your doorstep, fast and fresh.',
    href: '/food-delivery',
    icon: Utensils,
    color: 'from-orange-500/10 to-red-500/10',
    borderColor: 'border-orange-500/30',
    buttonColor: 'bg-orange-600 hover:bg-orange-700',
  },
  {
    title: 'Ride Sharing',
    description: 'Need a ride? Book a trip in seconds with our reliable and affordable ride-sharing service.',
    href: '/ride-sharing',
    icon: Car,
    color: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-500/30',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    title: 'Property Rentals',
    description: 'Find your next home or a perfect vacation spot. Browse thousands of listings for apartments and houses.',
    href: '/rentals',
    icon: Home,
    color: 'from-green-500/10 to-teal-500/10',
    borderColor: 'border-green-500/30',
    buttonColor: 'bg-green-600 hover:bg-green-700',
  },
];

const ServiceCard = ({
  service,
  i,
  progress,
  range,
  targetScale,
}: {
  service: (typeof services)[0];
  i: number;
  progress: any;
  range: number[];
  targetScale: number;
}) => {
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <motion.div
      style={{
        scale,
        top: `calc(-5vh + ${i * 25}px)`,
      }}
      className="sticky top-[20vh] h-[50vh] w-full max-w-4xl mx-auto"
    >
      <div className={`relative h-full w-full rounded-2xl p-8 border-2 flex flex-col justify-between bg-gradient-to-br ${service.color} ${service.borderColor} shadow-2xl shadow-black/20`}>
        <div>
          <div className="flex items-center gap-4 mb-4">
            <service.icon className="w-10 h-10 text-accent" />
            <h3 className="text-3xl font-bold tracking-tight">{service.title}</h3>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">{service.description}</p>
        </div>
        <div className="self-end">
          <Button asChild className={`${service.buttonColor} text-white shadow-lg`}>
            <Link href={service.href}>Explore {service.title}</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export function ServicesShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section ref={containerRef} className="relative mt-24">
       <div className="text-center mb-16 px-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
                One App, Endless Possibilities
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                From epic gaming battles to your next meal, we connect you to everything you need.
                Scroll down to see what's inside.
            </p>
        </div>
      {services.map((service, i) => {
        const targetScale = 1 - (services.length - i) * 0.05;
        return (
          <ServiceCard
            key={service.title}
            i={i}
            service={service}
            progress={scrollYProgress}
            range={[i * 0.25, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </section>
  );
}

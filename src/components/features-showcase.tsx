
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Utensils, Car, Home, ShoppingBag, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

const features = [
  {
    title: 'Products',
    description: 'Browse and buy from our curated selection of high-quality products.',
    icon: ShoppingBag,
    href: '/products',
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/50',
    buttonClass: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    title: 'Gaming Tournaments',
    description: 'Compete in exclusive tournaments for massive prizes and rise to the top.',
    icon: Gamepad2,
    href: '/gaming',
    color: 'from-purple-500/20 to-indigo-500/20',
    borderColor: 'border-purple-500/50',
    buttonClass: 'bg-purple-600 hover:bg-purple-700',
  },
  {
    title: 'Food Delivery',
    description: 'Get your favorite meals delivered to your doorstep, fast and fresh.',
    href: '/food-delivery',
    icon: Utensils,
    color: 'from-orange-500/20 to-red-500/20',
    borderColor: 'border-orange-500/50',
    buttonClass: 'bg-orange-600 hover:bg-orange-700',
  },
  {
    title: 'Property Rentals',
    description: 'Find your next home or a perfect vacation spot. Browse thousands of listings.',
    href: '/rentals',
    icon: Home,
    color: 'from-green-500/20 to-teal-500/20',
    borderColor: 'border-green-500/50',
    buttonClass: 'bg-green-600 hover:bg-green-700',
  },
  {
    title: 'Ride Sharing',
    description: 'Need a ride? Book a trip in seconds with our reliable and affordable service.',
    href: '/ride-sharing',
    icon: Car,
    color: 'from-sky-500/20 to-blue-500/20',
    borderColor: 'border-sky-500/50',
    buttonClass: 'bg-sky-600 hover:bg-sky-700',
  },
  {
    title: 'Live Chat',
    description: 'Connect with the community, make friends, and strategize in real-time.',
    href: '/chat',
    icon: MessageSquare,
    color: 'from-pink-500/20 to-rose-500/20',
    borderColor: 'border-pink-500/50',
    buttonClass: 'bg-pink-600 hover:bg-pink-700',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

export function FeaturesShowcase() {
  return (
    <section id="features" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Everything in One Place
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Zenith combines all the services you need into a single, seamless experience. Discover what you can do.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <div className={`relative h-full w-full rounded-xl p-6 flex flex-col justify-between bg-gradient-to-br ${feature.color} border ${feature.borderColor} shadow-lg`}>
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-full bg-background/50`}>
                      <feature.icon className="w-8 h-8 text-accent" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
                <Button asChild className={`${feature.buttonClass} text-white shadow-lg mt-6 w-full`}>
                  <Link href={feature.href}>Explore</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

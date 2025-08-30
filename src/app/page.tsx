
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Utensils, Gamepad2, Building, Zap } from 'lucide-react';
import SiteJsonLd from '@/components/seo/SiteJsonLd';

const Home = () => {
  const featureCards = [
    { title: "E-Commerce", desc: "Latest trends at your fingertips.", icon: <ShoppingBag className="h-8 w-8 text-accent"/>, link: "/products" },
    { title: "Food Delivery", desc: "Craving something? We deliver.", icon: <Utensils className="h-8 w-8 text-accent"/>, link: "/food-delivery" },
    { title: "Gaming", desc: "Join tournaments and win big.", icon: <Gamepad2 className="h-8 w-8 text-accent"/>, link: "/gaming" },
    { title: "Rentals", desc: "Rent anything, anytime.", icon: <Building className="h-8 w-8 text-accent"/>, link: "/rentals" },
  ];

  const featuredProducts = [
    { id: 1, name: "Cyberpunk VR Headset", price: 499.99, imageHint: "futuristic headset", category: "Electronics" },
    { id: 2, name: "Artisanal Coffee Blend", price: 29.99, imageHint: "coffee beans", category: "Groceries" },
    { id: 3, name: "Pro Gaming Mouse", price: 89.99, imageHint: "gaming mouse", category: "Gaming" },
  ];
  
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <>
      <SiteJsonLd
        name="Luck&Love"
        url={base}
        logo={`${base}/icon.png`}
        sameAs={["https://twitter.com/yourhandle","https://www.facebook.com/yourpage"]}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative h-[70vh] flex items-center justify-center text-center px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-background to-background opacity-90 z-10"></div>
          <div className="absolute inset-0 w-full h-full">
            <Image 
              src="https://picsum.photos/1200/800" 
              alt="Abstract network of interconnected nodes and lines" 
              fill
              className="w-full h-full object-cover" 
              data-ai-hint="abstract network"
              priority
            />
          </div>
          <div className="relative z-20">
            <motion.h1 
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight"
            >
              Welcome to <span className="text-gradient">Zenith Commerce</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground"
            >
              Everything you need, from everyday essentials to gaming glory, all in one place.
            </motion.p>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8"
            >
              <Link href="/products">
                <Button size="lg" className="font-bold">
                  Shop Now <Zap className="ml-2 h-5 w-5"/>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">One Platform, Infinite Possibilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link href={card.link}>
                  <Card className="glass-effect h-full hover-lift">
                    <CardHeader className="items-center text-center">
                      {card.icon}
                      <CardTitle className="text-accent mt-4">{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground">{card.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
               <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
              >
                <Card className="glass-effect h-full hover-lift overflow-hidden">
                   <div className="relative h-60 w-full">
                    <Image 
                      src={`https://picsum.photos/600/40${index}`} 
                      alt={product.name}
                      fill 
                      className="w-full h-full object-cover" 
                      data-ai-hint={product.imageHint}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-bold text-accent">${product.price}</p>
                      <Link href={`/products/${product.id}`}>
                        <Button>View</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Home;

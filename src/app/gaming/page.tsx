'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';

const GamingPage = () => {
  const tournaments = [
    { id: '1', name: 'Free Fire Tournament', image: 'https://placehold.co/600x400.png', prize: 500, hint: 'Free Fire' },
    { id: '2', name: 'PUBG Championship', image: 'https://placehold.co/600x400.png', prize: 1000, hint: 'PUBG game' },
    { id: '3', name: 'Valorant Champions Tour', image: 'https://placehold.co/600x400.png', prize: 2500, hint: 'Valorant game' },
    { id: '4', name: 'League of Legends World\'s', image: 'https://placehold.co/600x400.png', prize: 5000, hint: 'League Legends' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
          Gaming Tournaments
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Compete in your favorite games and win exciting prizes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tournaments.map((tournament, index) => (
           <motion.div
            key={tournament.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            <Card className="flex h-full flex-col overflow-hidden transition-all bg-gray-800/50 border-gray-700 hover:border-primary">
               <CardHeader className="p-0">
                  <div className="relative aspect-video w-full">
                    <Image 
                      src={tournament.image} 
                      alt={tournament.name} 
                      fill 
                      className="object-cover"
                      data-ai-hint={tournament.hint}
                    />
                  </div>
              </CardHeader>
              <CardContent className="p-4 flex flex-col flex-1">
                <CardTitle className="text-xl font-semibold">{tournament.name}</CardTitle>
                <p className="text-lg font-bold text-accent mt-2">Prize: ${tournament.prize.toLocaleString()}</p>
                <div className="flex-grow" />
                <Button className="w-full mt-4">Join Tournament</Button>
              </CardContent>
            </Card>
           </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GamingPage;

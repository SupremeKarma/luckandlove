
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2 } from 'lucide-react';

export default function GamingPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">Gaming Tournaments</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Compete in your favorite games, climb the ranks, and win amazing prizes.
        </p>
      </div>

       <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <Gamepad2 className="w-8 h-8 text-accent" />
              <span>Gaming Section Coming Soon</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We're setting up the arena! Our gaming tournament platform will be live soon, featuring a variety of games and exciting prize pools. Stay tuned, gamer!
            </p>
          </CardContent>
        </Card>
    </motion.div>
  );
}

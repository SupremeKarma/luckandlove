
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, hsl(var(--primary)) 0%, transparent 30%), radial-gradient(circle at 75% 75%, hsl(var(--accent)) 0%, transparent 30%)",
        }}
      />
      <div className="container mx-auto px-4 z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-foreground">
              One App for Everything You Need
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10">
              Welcome to Zenith. Your portal to gaming, food, rentals, and rides. Everything you need, all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="#features">Explore Features</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full h-64 md:h-96"
          >
            <Image
              src="https://picsum.photos/800/600"
              alt="Cartoon illustration of services"
              width={800}
              height={600}
              data-ai-hint="friendly cartoon robot mascot showing services"
              className="rounded-xl object-cover shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

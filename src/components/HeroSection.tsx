
import { Button } from "./ui/button";
import Link from "next/link";
import { MoveDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, hsl(var(--primary)) 0%, transparent 30%), radial-gradient(circle at 75% 75%, hsl(var(--accent)) 0%, transparent 30%)",
        }}
      />
      <div className="container mx-auto px-4 z-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
            Welcome to <span className="text-accent">Zenith</span>
          </h1>

          <p className="text-lg md:text-2xl text-muted-foreground mb-10">
            Your one-stop shop for premium products, services, and experiences.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="#services">Explore Features</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/account">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
          <span className="text-sm">Scroll Down</span>
          <MoveDown className="w-5 h-5"/>
      </div>
    </section>
  );
}

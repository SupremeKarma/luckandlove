
import { Button } from "./ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://placehold.co/1200x600.png"
          alt="Futuristic marketplace"
          className="w-full h-full object-cover opacity-60"
          data-ai-hint="futuristic marketplace"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-background/80" />
        <div className="absolute inset-0 cyber-grid opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-6xl md:text-8xl font-bold mb-6">
          <span className="gradient-text">Future</span>
          <span className="neon-text ml-4">Shop</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Experience the next generation of digital commerce. Shop, order food, find rentals, 
          compete in tournaments, and connect globally—all in one futuristic platform.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="hero" size="lg" className="float-animation">
            Explore Products
          </Button>
          <Button variant="glow" size="lg">
            Join Community
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { label: "Products", value: "10K+" },
            { label: "Restaurants", value: "500+" },
            { label: "Rentals", value: "2K+" },
            { label: "Gamers", value: "50K+" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold neon-text">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

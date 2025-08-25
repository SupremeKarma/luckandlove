
import { Button } from "./ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background/50 z-10" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, #3A506B 1px, transparent 1px), linear-gradient(to bottom, #3A506B 1px, transparent 1px)",
          backgroundSize: "3rem 3rem",
        }}
      />
      <div className="container mx-auto px-4 z-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-foreground">
            Welcome to <span className="text-accent">Zenith Commerce</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10">
            Your one-stop shop for premium products. Discover quality and style in every category.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/account">My Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

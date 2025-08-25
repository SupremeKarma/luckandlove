'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, Car, Home, Bed, Wifi, Zap } from "lucide-react";
import Image from "next/image";

const rentals = [
  {
    id: "1",
    name: "Neo-Tokyo Apartment",
    price: 2800,
    type: "apartment",
    description: "Smart home with holographic entertainment system",
    image: "https://placehold.co/600x400.png",
    location: "Downtown Cyber District",
    rating: 4.9,
    bedrooms: 2,
    amenities: ["Wifi", "Parking", "Pool", "Gym"],
    hint: 'cyberpunk apartment'
  },
  {
    id: "2",
    name: "Quantum Coupe 2085",
    price: 120,
    type: "car",
    description: "Self-driving luxury vehicle with quantum navigation",
    image: "https://placehold.co/600x400.png",
    location: "Rental Hub Alpha",
    rating: 4.7,
    features: ["Auto-pilot", "Quantum Engine", "Neural Interface"],
    hint: 'futuristic car'
  },
  {
    id: "3",
    name: "Cyber Villa Prime",
    price: 4500,
    type: "house",
    description: "Luxury smart home with AI butler and energy shields",
    image: "https://placehold.co/600x400.png",
    location: "Elite Sector 7",
    rating: 5.0,
    bedrooms: 4,
    amenities: ["AI Butler", "Energy Shield", "Rooftop Garden", "Quantum Pool"],
    hint: 'cyberpunk villa'
  }
];

const rentalTypes = ["All", "Apartments", "Houses", "Cars", "Rooms"];

export default function RentalsPage() {
  const [selectedType, setSelectedType] = useState("All");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const filteredRentals = rentals.filter(rental => {
    const matchesType = selectedType === "All" || 
      (selectedType === "Apartments" && rental.type === "apartment") ||
      (selectedType === "Houses" && rental.type === "house") ||
      (selectedType === "Cars" && rental.type === "car");
    
    const matchesLocation = !location || rental.location.toLowerCase().includes(location.toLowerCase());
    
    return matchesType && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Rental</span>
            <span className="neon-text ml-3">Finder</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Find your perfect space or ride in the digital age
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-6xl mx-auto mb-8">
          <Card className="bg-card/50 border-primary/30">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-background/50 border-primary/30"
                />
                
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-background/50 border-primary/30">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {rentalTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="bg-background/50 border-primary/30">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Under $1000</SelectItem>
                    <SelectItem value="medium">$1000 - $3000</SelectItem>
                    <SelectItem value="high">$3000+</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="neon" className="w-full">
                  <MapPin size={16} />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rental Categories */}
        <div className="mb-8">
          <Tabs value={selectedType} onValueChange={setSelectedType}>
            <TabsList className="w-full bg-card/50 border border-primary/30">
              {rentalTypes.map((type) => (
                <TabsTrigger
                  key={type}
                  value={type}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {type}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Home, label: "Properties", count: "2.5K+" },
            { icon: Car, label: "Vehicles", count: "800+" },
            { icon: MapPin, label: "Locations", count: "50+" },
            { icon: Star, label: "Avg Rating", count: "4.8" }
          ].map((stat, index) => (
            <Card key={index} className="bg-card/50 border-primary/20 text-center">
              <CardContent className="p-4">
                <stat.icon className="mx-auto mb-2 text-primary" size={24} />
                <div className="text-2xl font-bold neon-text">{stat.count}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Rental Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRentals.map((rental) => (
            <Card key={rental.id} className="group bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow-cyan overflow-hidden">
              <div className="relative">
                <Image
                  src={rental.image}
                  alt={rental.name}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={rental.hint}
                />
                <Badge variant="secondary" className="absolute top-2 left-2 bg-primary/80 text-white capitalize">
                  {rental.type}
                </Badge>
                <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-sm text-white flex items-center">
                  <Star size={12} className="mr-1 text-yellow-400" />
                  {rental.rating}
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg leading-tight">{rental.name}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin size={12} className="mr-1" />
                  {rental.location}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold gradient-text">
                    ${rental.price}
                    <span className="text-sm text-muted-foreground ml-1">
                      /{rental.type === "car" ? "day" : "month"}
                    </span>
                  </span>
                  {rental.bedrooms && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Bed size={12} className="mr-1" />
                      {rental.bedrooms} beds
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {rental.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {(rental.amenities || rental.features || []).slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-primary/30">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <Button variant="neon" className="w-full">
                  <Zap size={16} />
                  {rental.type === "car" ? "Rent Now" : "View Details"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

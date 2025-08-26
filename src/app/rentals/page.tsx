
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, Car, Home, Bed, Zap, Search } from "lucide-react";
import Image from "next/image";

const rentals = [
  {
    id: "1",
    name: "Modern City Apartment",
    price: 2800,
    type: "apartment",
    description: "Bright, airy apartment in the city center.",
    image: "https://picsum.photos/600/400",
    location: "Downtown",
    rating: 4.9,
    bedrooms: 2,
    amenities: ["Wifi", "Parking", "Pool", "Gym"],
    hint: 'modern apartment'
  },
  {
    id: "2",
    name: "Compact City Car",
    price: 120,
    type: "car",
    description: "Fuel-efficient and easy to park.",
    image: "https://picsum.photos/600/400",
    location: "City Airport",
    rating: 4.7,
    features: ["Automatic", "GPS", "Bluetooth"],
    hint: 'city car'
  },
  {
    id: "3",
    name: "Spacious Suburban House",
    price: 4500,
    type: "house",
    description: "Perfect for families with a large backyard.",
    image: "https://picsum.photos/600/400",
    location: "Oakwood Suburbs",
    rating: 5.0,
    bedrooms: 4,
    amenities: ["Garage", "Garden", "Fireplace", "Patio"],
    hint: 'suburban house'
  }
];

const rentalTypes = ["All", "Apartments", "Houses", "Cars"];

export default function RentalsPage() {
  const [selectedType, setSelectedType] = useState("All");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("all");

  const filteredRentals = rentals.filter(rental => {
    const matchesType = selectedType === "All" || 
      (selectedType === "Apartments" && rental.type === "apartment") ||
      (selectedType === "Houses" && rental.type === "house") ||
      (selectedType === "Cars" && rental.type === "car");
    
    const matchesLocation = !location || rental.location.toLowerCase().includes(location.toLowerCase());

    const matchesPrice = priceRange === "all" ||
      (priceRange === "low" && rental.price < 1000) ||
      (priceRange === "medium" && rental.price >= 1000 && rental.price <= 3000) ||
      (priceRange === "high" && rental.price > 3000);
    
    return matchesType && matchesLocation && matchesPrice;
  });

  return (
    <div className="bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
            Find a Rental
          </h1>
          <p className="text-lg text-muted-foreground">
            Your perfect space or ride is just a few clicks away.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative md:col-span-2">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Location (e.g., Downtown)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
                
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Price</SelectItem>
                    <SelectItem value="low">Under $1000</SelectItem>
                    <SelectItem value="medium">$1000 - $3000</SelectItem>
                    <SelectItem value="high">Over $3000</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="h-11">
                  <Search size={16} className="mr-2"/>
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rental Categories */}
        <div className="mb-8">
           <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              {rentalTypes.map((type) => (
                <TabsTrigger
                  key={type}
                  value={type}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {type === "Apartments" && <Home className="mr-2 h-4 w-4 sm:hidden" />}
                  {type === "Houses" && <Home className="mr-2 h-4 w-4 sm:hidden" />}
                  {type === "Cars" && <Car className="mr-2 h-4 w-4 sm:hidden" />}
                  {type}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Rental Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRentals.map((rental) => (
            <Card key={rental.id} className="group bg-card overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50">
              <div className="relative">
                <Image
                  src={rental.image}
                  alt={rental.name}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={rental.hint}
                />
                <Badge variant="secondary" className="absolute top-2 left-2 bg-primary/80 text-white capitalize text-xs">
                  {rental.type}
                </Badge>
                <div className="absolute top-2 right-2 bg-background/70 px-2 py-1 rounded-full text-sm font-semibold text-foreground flex items-center">
                  <Star size={14} className="mr-1.5 text-yellow-400 fill-yellow-400" />
                  {rental.rating.toFixed(1)}
                </div>
              </div>
              
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg leading-tight">{rental.name}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground pt-1">
                  <MapPin size={14} className="mr-1.5 flex-shrink-0" />
                  {rental.location}
                </div>
              </CardHeader>
              
              <CardContent className="p-4 pt-0">
                 <div className="text-2xl font-bold text-accent mb-4">
                    ${rental.price.toLocaleString()}
                    <span className="text-sm text-muted-foreground font-normal ml-1">
                      /{rental.type === "car" ? "day" : "month"}
                    </span>
                 </div>
                 <div className="flex flex-wrap gap-2 mb-4">
                    {rental.bedrooms ? (
                        <Badge variant="outline" className="text-sm"><Bed size={14} className="mr-1.5" />{rental.bedrooms} beds</Badge>
                    ) : null}
                    {(rental.amenities || rental.features || []).slice(0, 2).map((feature) => (
                      <Badge key={feature} variant="outline" className="text-sm">
                        {feature}
                      </Badge>
                    ))}
                 </div>
                <Button variant="default" className="w-full">
                  <Zap size={16} className="mr-2"/>
                  {rental.type === "car" ? "Rent Now" : "View Details"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
         {filteredRentals.length === 0 && (
          <div className="text-center text-muted-foreground mt-16 py-8 col-span-full">
            <p className="text-lg font-medium">No Rentals Found</p>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

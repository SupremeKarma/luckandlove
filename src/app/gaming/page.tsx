
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Users, Calendar, Target, Award, GamepadIcon } from "lucide-react";
import Image from "next/image";

const tournaments = [
  {
    id: "1",
    name: "Cyber Battle Royale 2085",
    game: "Free Fire",
    prize: 10000,
    participants: 2847,
    maxParticipants: 5000,
    entryFee: 25,
    startDate: "2024-12-15",
    status: "Open",
    difficulty: "Pro",
    image: "https://picsum.photos/600/400",
    hint: "battle royale game"
  },
  {
    id: "2",
    name: "Neural Strike Championship",
    game: "CS:GO",
    prize: 15000,
    participants: 1256,
    maxParticipants: 2000,
    entryFee: 50,
    startDate: "2024-12-20",
    status: "Open",
    difficulty: "Elite",
    image: "https://picsum.photos/600/400",
    hint: "csgo tournament"
  },
  {
    id: "3",
    name: "Quantum Quest Tournament",
    game: "Valorant",
    prize: 8000,
    participants: 892,
    maxParticipants: 1500,
    entryFee: 20,
    startDate: "2024-12-18",
    status: "Registration",
    difficulty: "Amateur",
    image: "https://picsum.photos/600/400",
    hint: "valorant tournament"
  }
];

const games = ["All", "Free Fire", "PUBG", "CS:GO", "Valorant", "Fortnite"];
const difficulties = ["All", "Amateur", "Pro", "Elite"];

export default function GamingPage() {
  const [selectedGame, setSelectedGame] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesGame = selectedGame === "All" || tournament.game === selectedGame;
    const matchesDifficulty = selectedDifficulty === "All" || tournament.difficulty === selectedDifficulty;
    return matchesGame && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Amateur": return "bg-green-500/20 text-green-400 border-green-400/30";
      case "Pro": return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30";
      case "Elite": return "bg-red-500/20 text-red-400 border-red-400/30";
      default: return "bg-primary/20 text-primary border-primary/30";
    }
  };

  return (
    <div className="bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
            Gaming Tournaments
          </h1>
          <p className="text-lg text-muted-foreground">
            Compete, conquer, and claim your glory.
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col gap-4 mb-8">
            <Card className="bg-card">
              <CardContent className="p-3">
                <h3 className="text-sm font-semibold text-muted-foreground px-1 mb-2">Filter by Game</h3>
                <div className="flex flex-wrap gap-2">
                    {games.map((game) => (
                      <Button
                        key={game}
                        variant={selectedGame === game ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedGame(game)}
                      >
                        {game}
                      </Button>
                    ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card">
               <CardContent className="p-3">
                 <h3 className="text-sm font-semibold text-muted-foreground px-1 mb-2">Filter by Difficulty</h3>
                 <div className="flex flex-wrap gap-2">
                  {difficulties.map((difficulty) => (
                      <Button
                        key={difficulty}
                        variant={selectedDifficulty === difficulty ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDifficulty(difficulty)}
                      >
                        {difficulty}
                      </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        

        {/* Tournament Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => {
            const participationPercentage = (tournament.participants / tournament.maxParticipants) * 100;
            
            return (
              <Card key={tournament.id} className="group bg-card overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50">
                <div className="relative">
                  <Image
                    src={tournament.image}
                    alt={tournament.name}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={tournament.hint}
                  />
                  <Badge 
                    variant="outline" 
                    className={`absolute top-2 left-2 text-xs ${getDifficultyColor(tournament.difficulty)}`}
                  >
                    {tournament.difficulty}
                  </Badge>
                  <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                    {tournament.game}
                  </Badge>
                </div>
                
                <CardHeader className="p-4">
                  <CardTitle className="text-lg leading-tight">{tournament.name}</CardTitle>
                  <div className="flex items-center text-accent font-bold pt-1">
                      <Trophy className="mr-2" size={20} />
                      <span>${tournament.prize.toLocaleString()}</span>
                    </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Participants</span>
                      <span>{tournament.participants.toLocaleString()} / {tournament.maxParticipants.toLocaleString()}</span>
                    </div>
                    <Progress value={participationPercentage} className="h-2 bg-muted" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Starts</span>
                      <span className="flex items-center"><Calendar size={14} className="mr-1.5"/>{new Date(tournament.startDate).toLocaleDateString()}</span>
                    </div>
                     <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Entry Fee</span>
                      <span>${tournament.entryFee}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="default" 
                    className="w-full"
                    disabled={tournament.status === "Full"}
                  >
                    <Target size={16} className="mr-2" />
                    {tournament.status === "Full" ? "Tournament Full" : "Join Tournament"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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
    image: "https://placehold.co/600x400.png",
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
    image: "https://placehold.co/600x400.png",
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
    image: "https://placehold.co/600x400.png",
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
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Gaming</span>
            <span className="neon-text ml-3">Tournaments</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Compete in the ultimate esports arena and claim your digital glory
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Trophy, label: "Active Tournaments", count: "156" },
            { icon: Users, label: "Total Players", count: "45K+" },
            { icon: Award, label: "Total Prizes", count: "$2.5M" },
            { icon: GamepadIcon, label: "Games", count: "12" }
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

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card/50 border-primary/30 p-2">
              <h3 className="text-sm font-semibold text-muted-foreground px-2 mb-2">Filter by Game</h3>
              <div className="flex flex-wrap gap-2">
                  {games.map((game) => (
                    <Button
                      key={game}
                      variant={selectedGame === game ? "neon" : "cyber"}
                      size="sm"
                      onClick={() => setSelectedGame(game)}
                    >
                      {game}
                    </Button>
                  ))}
              </div>
            </Card>
            <Card className="bg-card/50 border-primary/30 p-2">
               <h3 className="text-sm font-semibold text-muted-foreground px-2 mb-2">Filter by Difficulty</h3>
               <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                    <Button
                      key={difficulty}
                      variant={selectedDifficulty === difficulty ? "neon" : "cyber"}
                      size="sm"
                      onClick={() => setSelectedDifficulty(difficulty)}
                    >
                      {difficulty}
                    </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Featured Tournament */}
        <div className="mb-8">
          <Card className="bg-gradient-secondary p-1 rounded-lg">
            <Card className="bg-card/90 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/30">
                    🔥 FEATURED
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                    LIVE NOW
                  </Badge>
                </div>
                <h2 className="text-3xl font-bold mb-2 gradient-text">
                  Global Championship Finals 2024
                </h2>
                <p className="text-muted-foreground mb-4">
                  The ultimate showdown of the world's best players. Winner takes all in this 
                  once-in-a-lifetime tournament with $100,000 prize pool.
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <Trophy className="mr-1 text-yellow-400" size={16} />
                    $100,000 Prize
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 text-primary" size={16} />
                    16 Players
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 text-primary" size={16} />
                    Live Now
                  </div>
                </div>
                <Button variant="hero" className="mt-4">
                  Watch Live Stream
                </Button>
              </CardContent>
            </Card>
          </Card>
        </div>

        {/* Tournament Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => {
            const participationPercentage = (tournament.participants / tournament.maxParticipants) * 100;
            
            return (
              <Card key={tournament.id} className="group bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow-cyan overflow-hidden">
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
                    className={`absolute top-2 left-2 ${getDifficultyColor(tournament.difficulty)}`}
                  >
                    {tournament.difficulty}
                  </Badge>
                  <Badge variant="secondary" className="absolute top-2 right-2 bg-primary/80 text-white">
                    {tournament.game}
                  </Badge>
                  <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-sm text-white">
                    {tournament.status}
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg leading-tight">{tournament.name}</CardTitle>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Trophy className="text-yellow-400" size={16} />
                      <span className="text-2xl font-bold gradient-text">${tournament.prize.toLocaleString()}</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-primary/30">
                      ${tournament.entryFee} Entry
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Participants</span>
                      <span>{tournament.participants.toLocaleString()} / {tournament.maxParticipants.toLocaleString()}</span>
                    </div>
                    <Progress value={participationPercentage} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Start Date</span>
                      <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="neon" 
                    className="w-full"
                    disabled={tournament.status === "Full"}
                  >
                    <Target size={16} />
                    {tournament.status === "Full" ? "Tournament Full" : "Join Tournament"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Leaderboard Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 text-center neon-text">Top Players</h2>
          <Card className="bg-card/50 border-primary/30">
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { rank: 1, name: "CyberNinja", points: 15420, wins: 147 },
                  { rank: 2, name: "QuantumWarrior", points: 14890, wins: 134 },
                  { rank: 3, name: "NeonStriker", points: 14156, wins: 128 },
                  { rank: 4, name: "DigitalPhantom", points: 13847, wins: 121 },
                  { rank: 5, name: "ElectricViper", points: 13492, wins: 115 }
                ].map((player) => (
                  <div key={player.rank} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-primary/20">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        player.rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
                        player.rank === 2 ? "bg-gray-400/20 text-gray-300" :
                        player.rank === 3 ? "bg-orange-500/20 text-orange-400" :
                        "bg-primary/20 text-primary"
                      }`}>
                        {player.rank}
                      </div>
                      <div>
                        <div className="font-semibold">{player.name}</div>
                        <div className="text-sm text-muted-foreground">{player.wins} wins</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold gradient-text">{player.points.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


'use client';

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Smile, 
  Settings, 
  UserPlus, 
  Hash, 
  Users, 
  Mic, 
  Video,
  Shield,
  Crown,
  Zap,
  Menu
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"


interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  avatar?: string;
  role?: "admin" | "moderator" | "premium" | "user";
}

interface Channel {
  id: string;
  name: string;
  type: "text" | "voice";
  memberCount: number;
  isPrivate?: boolean;
}

const demoMessages: Message[] = [
  {
    id: "1",
    user: "CyberNinja",
    content: "Just finished the new tournament! That final round was insane 🔥",
    timestamp: new Date(Date.now() - 300000),
    role: "premium"
  },
  {
    id: "2",
    user: "QuantumWarrior",
    content: "GG everyone! See you in the next championship",
    timestamp: new Date(Date.now() - 240000),
    role: "moderator"
  },
  {
    id: "3",
    user: "NeonStriker",
    content: "Anyone want to team up for the food delivery challenge? 🍕",
    timestamp: new Date(Date.now() - 180000),
    role: "user"
  },
  {
    id: "4",
    user: "Admin",
    content: "🚀 New rental properties just added to the platform! Check them out in the #rentals channel",
    timestamp: new Date(Date.now() - 120000),
    role: "admin"
  }
];

const channels: Channel[] = [
  { id: "general", name: "general", type: "text", memberCount: 1547 },
  { id: "gaming", name: "gaming", type: "text", memberCount: 892 },
  { id: "food", name: "food-talk", type: "text", memberCount: 634 },
  { id: "rentals", name: "rentals", type: "text", memberCount: 423 },
  { id: "voice1", name: "Gaming Lounge", type: "voice", memberCount: 12 },
  { id: "voice2", name: "Chill Zone", type: "voice", memberCount: 8 }
];


const UserProfile = () => (
    <Card className="bg-card/50">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>YOU</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-semibold text-sm">You</div>
            <div className="text-xs text-muted-foreground">Online</div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
);

const ChannelsList = ({activeChannel, setActiveChannel} : {activeChannel: string, setActiveChannel: (channel: string) => void}) => (
    <Card className="bg-card/50 flex-1">
      <CardHeader className="p-4">
        <CardTitle className="text-base flex items-center justify-between">
          Channels
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <UserPlus size={14} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh_-_20rem)] sm:h-[300px]">
          <div className="space-y-1 p-2">
            {channels.map((channel) => (
              <Button
                key={channel.id}
                variant={activeChannel === channel.id ? "secondary" : "ghost"}
                className="w-full justify-start text-sm h-9"
                onClick={() => setActiveChannel(channel.id)}
              >
                {channel.type === "text" ? (
                  <Hash size={14} className="mr-2" />
                ) : (
                  <Mic size={14} className="mr-2" />
                )}
                <span className="truncate flex-1 text-left">{channel.name}</span>
                <Badge variant="outline" className="ml-2">
                  {channel.memberCount}
                </Badge>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
);

const LeftSidebar = ({activeChannel, setActiveChannel} : {activeChannel: string, setActiveChannel: (channel: string) => void}) => (
    <div className="space-y-4 flex flex-col h-full">
        <UserProfile/>
        <ChannelsList activeChannel={activeChannel} setActiveChannel={setActiveChannel} />
    </div>
)

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(demoMessages);
  const [newMessage, setNewMessage] = useState("");
  const [activeChannel, setActiveChannel] = useState("general");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      user: "You",
      content: newMessage,
      timestamp: new Date(),
      role: "user"
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        user: "AI Assistant",
        content: "Thanks for your message! This is a demo response.",
        timestamp: new Date(),
        role: "admin"
      };
      setMessages(prev => [...prev, botResponse]);
    }, 2000);
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "admin": return <Crown size={12} className="text-yellow-400" />;
      case "moderator": return <Shield size={12} className="text-blue-400" />;
      case "premium": return <Zap size={12} className="text-purple-400" />;
      default: return null;
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "admin": return "text-yellow-400";
      case "moderator": return "text-blue-400";
      case "premium": return "text-purple-400";
      default: return "text-foreground";
    }
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-0 sm:px-4 h-screen py-0 sm:py-4">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            
          {/* Sidebar - Channels & Users */}
          <div className="hidden lg:block lg:col-span-1 h-full">
                <LeftSidebar activeChannel={activeChannel} setActiveChannel={setActiveChannel}/>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3 h-full">
            <Card className="border-0 sm:border h-full flex flex-col rounded-none sm:rounded-lg">
              {/* Chat Header */}
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="lg:hidden">
                      <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Menu/>
                            </Button>
                          </SheetTrigger>
                          <SheetContent side="left" className="w-[300px] bg-background p-4">
                              <LeftSidebar activeChannel={activeChannel} setActiveChannel={setActiveChannel}/>
                          </SheetContent>
                      </Sheet>
                    </div>
                    <Hash size={20} className="text-muted-foreground" />
                    <CardTitle className="text-lg">
                      {channels.find(c => c.id === activeChannel)?.name || "general"}
                    </CardTitle>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Video size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mic size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="flex space-x-3 group">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={message.avatar} />
                          <AvatarFallback className="bg-muted text-xs">
                            {message.user.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`font-semibold text-sm ${getRoleColor(message.role)}`}>
                              {message.user}
                            </span>
                            {getRoleIcon(message.role)}
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm text-foreground break-words">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex space-x-3 text-muted-foreground">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-muted text-xs">AI</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center space-x-1 text-sm">
                          <span>AI Assistant is typing</span>
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                            <div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-100"></div>
                            <div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-200"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t bg-background sm:bg-card">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder={`Message #${channels.find(c => c.id === activeChannel)?.name || "general"}`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 bg-background"
                  />
                  <Button 
                    variant="default"
                    size="icon" 
                    className="h-10 w-10 flex-shrink-0"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    aria-label="Send Message"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

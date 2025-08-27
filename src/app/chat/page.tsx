
'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Settings, 
  UserPlus, 
  Hash, 
  Mic, 
  Video,
  Menu,
  Shield,
  Crown,
  Zap,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { getSupabase } from "@/lib/supabase";
import type { User as SupabaseUser, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  id: number;
  channel_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: { full_name: string } | null;
}

interface Channel {
  id: string;
  name: string;
  type: "text" | "voice";
}

interface Profile {
  id: string;
  full_name: string;
}

const UserProfile = ({ user, profile }: { user: SupabaseUser | null, profile: Profile | null }) => (
    <Card className="bg-card/50">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>{profile?.full_name?.slice(0, 2).toUpperCase() || user?.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-semibold text-sm">{profile?.full_name || 'Anonymous'}</div>
            <div className="text-xs text-muted-foreground">Online</div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
);

const ChannelsList = ({ channels, activeChannel, setActiveChannel, loading }: { channels: Channel[], activeChannel: Channel | null, setActiveChannel: (channel: Channel) => void, loading: boolean }) => (
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
          {loading ? (
            <div className="space-y-2 p-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {channels.map((channel) => (
                <Button
                  key={channel.id}
                  variant={activeChannel?.id === channel.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-sm h-9"
                  onClick={() => setActiveChannel(channel)}
                >
                  {channel.type === "text" ? (
                    <Hash size={14} className="mr-2" />
                  ) : (
                    <Mic size={14} className="mr-2" />
                  )}
                  <span className="truncate flex-1 text-left">{channel.name}</span>
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
);

const LeftSidebar = ({ user, profile, channels, activeChannel, setActiveChannel, loadingChannels }: { user: SupabaseUser | null, profile: Profile | null, channels: Channel[], activeChannel: Channel | null, setActiveChannel: (channel: Channel) => void, loadingChannels: boolean }) => (
    <div className="space-y-4 flex flex-col h-full">
        <UserProfile user={user} profile={profile}/>
        <ChannelsList channels={channels} activeChannel={activeChannel} setActiveChannel={setActiveChannel} loading={loadingChannels} />
    </div>
)

export default function Chat() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const realtimeChannel = useRef<RealtimeChannel | null>(null);
  
  useEffect(() => {
    try {
      const supabaseClient = getSupabase();
      setSupabase(supabaseClient);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const fetchUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('id', user.id)
          .single();
        if (error) console.error('Error fetching profile', error);
        else setProfile(profileData);
      }
    };
    fetchUserAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);
  
  const fetchChannels = useCallback(async () => {
    if (!supabase) return;
    setLoadingChannels(true);
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('name');
      if (error) throw error;
      setChannels(data as Channel[]);
      if (data.length > 0 && !activeChannel) {
        setActiveChannel(data[0]);
      }
    } catch (error: any) {
      toast({ title: "Error fetching channels", description: error.message, variant: "destructive" });
    } finally {
      setLoadingChannels(false);
    }
  }, [supabase, activeChannel, toast]);

  const fetchMessages = useCallback(async (channelId: string) => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, profiles(full_name)')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      setMessages(data as Message[]);
    } catch (error: any) {
      toast({ title: "Error fetching messages", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [supabase, toast]);
  
  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  useEffect(() => {
    if (activeChannel) {
      fetchMessages(activeChannel.id);
    }
  }, [activeChannel, fetchMessages]);

  useEffect(() => {
    if (!supabase || !activeChannel) return;

    // Unsubscribe from previous channel
    if (realtimeChannel.current) {
        realtimeChannel.current.unsubscribe();
    }

    realtimeChannel.current = supabase
      .channel(`public:messages:channel_id=eq.${activeChannel.id}`)
      .on<Message>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `channel_id=eq.${activeChannel.id}` },
        async (payload) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', payload.new.user_id)
            .single();
          
          const newMessage = { ...payload.new, profiles: profileData };
          setMessages(currentMessages => [...currentMessages, newMessage as Message]);
        }
      )
      .subscribe();
      
      return () => {
        if(realtimeChannel.current) {
            realtimeChannel.current.unsubscribe();
        }
      }

  }, [supabase, activeChannel]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !activeChannel || !supabase) return;

    const content = newMessage.trim();
    setNewMessage("");
    
    const { error } = await supabase.from('messages').insert({
      content,
      user_id: user.id,
      channel_id: activeChannel.id,
    });

    if (error) {
      toast({ title: "Error sending message", description: error.message, variant: "destructive" });
      setNewMessage(content); // Restore message on error
    }
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-0 sm:px-4 h-screen py-0 sm:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          <div className="hidden lg:block lg:col-span-1 h-full">
            <LeftSidebar user={user} profile={profile} channels={channels} activeChannel={activeChannel} setActiveChannel={setActiveChannel} loadingChannels={loadingChannels} />
          </div>
          <div className="lg:col-span-3 h-full">
            <Card className="border-0 sm:border h-full flex flex-col rounded-none sm:rounded-lg">
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
                              <LeftSidebar user={user} profile={profile} channels={channels} activeChannel={activeChannel} setActiveChannel={setActiveChannel} loadingChannels={loadingChannels} />
                          </SheetContent>
                      </Sheet>
                    </div>
                    {activeChannel && <Hash size={20} className="text-muted-foreground" />}
                    <CardTitle className="text-lg">
                      {activeChannel?.name || "Select a channel"}
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

              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {loading ? (
                       <div className="space-y-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-3">
                               <Skeleton className="h-8 w-8 rounded-full" />
                               <div className="space-y-2">
                                  <Skeleton className="h-4 w-[250px]" />
                                  <Skeleton className="h-4 w-[200px]" />
                               </div>
                            </div>
                          ))}
                        </div>
                    ) : (
                      messages.map((message) => (
                        <div key={message.id} className="flex space-x-3 group">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-muted text-xs">
                              {message.profiles?.full_name?.slice(0, 2).toUpperCase() || 'AN'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className={`font-semibold text-sm`}>
                                {message.profiles?.full_name || 'Anonymous'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm text-foreground break-words">{message.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              <div className="p-4 border-t bg-background sm:bg-card">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder={user ? `Message #${activeChannel?.name || "..."}` : "Please log in to chat"}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 bg-background"
                    disabled={!user || !activeChannel}
                  />
                  <Button 
                    variant="default"
                    size="icon" 
                    className="h-10 w-10 flex-shrink-0"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !user || !activeChannel}
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

    
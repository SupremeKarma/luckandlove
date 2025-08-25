'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getSupabase } from '@/lib/firebase';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

const supabase = getSupabase();

interface Message {
  id: string;
  text: string;
  user_id: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  } | null;
  created_at: string;
}

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          id,
          text,
          user_id,
          created_at,
          profiles ( full_name, avatar_url )
        `)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data as Message[]);
      }
    };
    fetchMessages();
    
    const channel = supabase.channel('chat-room')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, 
      async (payload) => {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', payload.new.user_id)
            .single();

        if (error) {
            console.error('Error fetching profile for new message:', error);
        } else {
            const newMessage = { ...payload.new, profiles: profile } as Message;
            setMessages((prev) => [...prev, newMessage]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) {
      return;
    }

    await supabase.from('chat_messages').insert({
      text: newMessage,
      user_id: user.id,
    });

    setNewMessage('');
  };

  if (loading) {
    return <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">Loading Chat...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-2xl bg-gray-800/50 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Global Chat Room</CardTitle>
          <CardDescription>
            Join the conversation with the community.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col h-[60vh]">
          {!user ? (
            <div className="flex flex-col items-center justify-center flex-1">
              <p className="text-muted-foreground mb-4">You must be logged in to chat.</p>
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 ${user.id === msg.user_id ? 'justify-end' : ''}`}
                    >
                      {user.id !== msg.user_id && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={msg.profiles?.avatar_url || undefined} />
                          <AvatarFallback>{msg.profiles?.full_name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`rounded-lg px-4 py-2 max-w-sm ${user.id === msg.user_id ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                        <p className="text-sm font-bold">{msg.profiles?.full_name || 'Anonymous'}</p>
                        <p className="text-base">{msg.text}</p>
                      </div>
                      {user.id === msg.user_id && (
                        <Avatar className="h-8 w-8">
                           <AvatarImage src={msg.profiles?.avatar_url || undefined} />
                           <AvatarFallback>{msg.profiles?.full_name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-gray-900/70"
                />
                <Button type="submit">Send</Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

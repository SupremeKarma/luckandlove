'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

interface Message {
  id: string;
  text: string;
  uid: string;
  displayName: string;
  photoURL: string | null;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | null;
}

export default function ChatPage() {
  const [user, loading] = useAuthState(auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) {
      return;
    }

    await addDoc(collection(db, 'messages'), {
      text: newMessage,
      uid: user.uid,
      displayName: user.displayName || user.email,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
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
                      className={`flex items-start gap-3 ${user.uid === msg.uid ? 'justify-end' : ''}`}
                    >
                      {user.uid !== msg.uid && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={msg.photoURL || undefined} />
                          <AvatarFallback>{msg.displayName?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`rounded-lg px-4 py-2 max-w-sm ${user.uid === msg.uid ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                        <p className="text-sm font-bold">{msg.displayName}</p>
                        <p className="text-base">{msg.text}</p>
                      </div>
                      {user.uid === msg.uid && (
                        <Avatar className="h-8 w-8">
                           <AvatarImage src={msg.photoURL || undefined} />
                           <AvatarFallback>{msg.displayName?.[0] || 'U'}</AvatarFallback>
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

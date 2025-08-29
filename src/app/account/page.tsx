
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Order, Profile } from '@/lib/types';
import { User, MapPin, Package, CreditCard, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { RequireAuth } from '@/components/require-auth';
import { useAuth } from '@/context/auth-context';
import { getSupabase } from '@/lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

function AccountPageContent() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<Address>({ street: '', city: '', state: '', zip: '', country: '' });
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  const { toast } = useToast();
  const router = useRouter();
  
  useEffect(() => {
    try {
      const supabaseClient = getSupabase();
      setSupabase(supabaseClient);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (loading || !user) return;
    try {
      const ret = localStorage.getItem("returnTo");
      if (ret) {
        localStorage.removeItem("returnTo");
        router.replace(ret);
      }
    } catch {}
  }, [loading, user, router]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      // Assuming addresses are stored in a different table or a jsonb column
      // This part would need adjustment based on your actual schema
      // For now, let's assume it's part of the profile object for demonstration
      // setAddresses(profile.addresses || []); 
    }
  }, [profile]);
  
  const handleProfileUpdate = async () => {
    if (!user || !supabase) return;
    
    try {
        const { error } = await supabase
          .from('profiles')
          .update({ full_name: fullName })
          .eq('id', user.id);

        if (error) throw error;
        await refreshProfile(); // Refresh context
        toast({ title: 'Profile Updated', description: 'Your profile information has been updated.' });
    } catch (error: any) {
        toast({ title: 'Error', description: `Failed to update profile: ${error.message}`, variant: 'destructive' });
    }
  };
  
  const handleLogout = async () => {
    await signOut();
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
          <p className="text-muted-foreground">Manage your account settings, orders, and addresses.</p>
        </div>
        <Button variant="outline" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Logout</Button>
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4">
          <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" />Profile</TabsTrigger>
          <TabsTrigger value="orders"><Package className="mr-2 h-4 w-4" />Orders</TabsTrigger>
          <TabsTrigger value="addresses"><MapPin className="mr-2 h-4 w-4" />Addresses</TabsTrigger>
          <TabsTrigger value="payment"><CreditCard className="mr-2 h-4 w-4" />Payment</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Full Name</Label>
                <Input id="displayName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user?.email || ''} disabled />
              </div>
               <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={profile?.role || ''} disabled />
              </div>
              <Button onClick={handleProfileUpdate}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Placeholder for other tabs */}
        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>This is a placeholder for order history.</CardDescription>
            </CardHeader>
             <CardContent><p>You have no past orders.</p></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="addresses" className="mt-6">
           <Card>
            <CardHeader>
              <CardTitle>Manage Addresses</CardTitle>
              <CardDescription>This is a placeholder for address management.</CardDescription>
            </CardHeader>
            <CardContent><p>No addresses saved.</p></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>This is a placeholder for payment methods.</CardDescription>
            </CardHeader>
            <CardContent><p>No payment methods saved.</p></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


export default function AccountPage() {
  return (
    <RequireAuth redirectTo="/login">
      <AccountPageContent />
    </RequireAuth>
  )
}


'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ShoppingBag, Bell, Settings, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RequireAuth } from '@/components/require-auth';
import { useRouter } from 'next/navigation';

function AccountPageContent() {
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const handleNotImplemented = () => {
      toast({
        title: "Feature In Progress",
        description: "This feature is coming soon!",
        variant: "destructive",
      });
    };

    const handleLogout = () => {
        logout();
        toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
        router.push('/');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-12"
        >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold">My Account</h1>
                <p className="text-lg text-muted-foreground mt-2">Welcome back, {user?.name}!</p>
              </div>
              <Button onClick={handleLogout} variant="outline"><LogOut className="mr-2 h-4 w-4" />Logout</Button>
            </div>
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="profile"><User className="w-4 h-4 mr-2"/>Profile</TabsTrigger>
                <TabsTrigger value="orders"><ShoppingBag className="w-4 h-4 mr-2"/>Orders</TabsTrigger>
                <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-2"/>Notifications</TabsTrigger>
                <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-2"/>Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="mt-6">
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>Your personal information.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div><strong>Name:</strong> {user?.name}</div>
                    <div><strong>Email:</strong> {user?.email}</div>
                    <div><strong>Role:</strong> <span className="capitalize">{user?.role}</span></div>
                    <Button variant="outline" onClick={handleNotImplemented}>Edit Profile</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="orders" className="mt-6">
                 <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>Review your past orders.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">You have no past orders.</p>
                     <Button className="mt-4" onClick={handleNotImplemented}>Start Shopping</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="notifications" className="mt-6">
                 <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Your recent notifications.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">You have no new notifications.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="settings" className="mt-6">
                 <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Manage your account settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p>Two-Factor Authentication</p>
                      <Button variant="outline" onClick={handleNotImplemented}>Enable</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <p>Change Password</p>
                      <Button variant="outline" onClick={handleNotImplemented}>Change</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
        </motion.div>
    );
};


export default function AccountPage() {
  return (
    <RequireAuth redirectTo="/login">
      <AccountPageContent />
    </RequireAuth>
  )
}

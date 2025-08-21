'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Order } from '@/lib/types';
import { User, MapPin, Package, CreditCard, LogOut } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { signOut, updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    date: '2023-10-26',
    status: 'Delivered',
    total: 149.98,
    items: [
      {
        id: 'prod-1',
        name: 'Smart Home Hub',
        price: 99.99,
        quantity: 1,
        category: 'Electronics',
        imageUrl: 'https://placehold.co/600x400.png',
        stock: 10,
        description: 'A smart home hub'
      },
      {
        id: 'prod-5',
        name: 'Classic Leather Jacket',
        price: 49.99,
        quantity: 1,
        category: 'Apparel',
        imageUrl: 'https://placehold.co/600x400.png',
        stock: 10,
        description: 'A classic leather jacket'
      },
    ],
  },
  {
    id: 'ORD-002',
    date: '2023-11-15',
    status: 'Shipped',
    total: 39.99,
    items: [
       {
        id: 'prod-9',
        name: 'The Art of Programming',
        price: 39.99,
        quantity: 1,
        category: 'Books',
        imageUrl: 'https://placehold.co/600x400.png',
        stock: 10,
        description: 'A book on programming'
      },
    ],
  },
];

export default function AccountPage() {
  const [user, loading] = useAuthState(auth);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<Address>({
    street: '', city: '', state: '', zip: '', country: ''
  });
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
      fetchAddresses(user.uid);
    }
  }, [user]);

  const fetchAddresses = async (uid: string) => {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      setAddresses(userData.addresses || []);
    } else {
      await setDoc(userDocRef, { addresses: [] });
    }
  };

  const handleProfileUpdate = async () => {
    if (user) {
      try {
        await updateProfile(user, { displayName });
        toast({
          title: 'Profile Updated',
          description: 'Your profile information has been updated.',
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: `Failed to update profile: ${error.message}`,
          variant: 'destructive',
        });
      }
    }
  };

  const handleAddOrUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);

    try {
      let updatedAddresses;
      if (editingAddress) {
        updatedAddresses = addresses.map(addr =>
          addr.id === editingAddress.id ? { ...editingAddress, ...newAddress } : addr
        );
        toast({
          title: 'Address Updated',
          description: 'Your address has been updated successfully.',
        });
      } else {
        const addressToAdd = { ...newAddress, id: Date.now().toString() };
        updatedAddresses = [...addresses, addressToAdd];
        toast({
          title: 'Address Added',
          description: 'Your new address has been added successfully.',
        });
      }
      await setDoc(userDocRef, { addresses: updatedAddresses }, { merge: true });
      setNewAddress({ street: '', city: '', state: '', zip: '', country: '' });
      setEditingAddress(null);
      fetchAddresses(user.uid);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to save address: ${error.message}`,
        variant: 'destructive',
      });
    }
  };
  
  const handleDeleteAddress = async (addressId: string) => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);

    try {
      await updateDoc(userDocRef, { addresses: updatedAddresses });
      toast({
        title: 'Address Deleted',
        description: 'Your address has been deleted.',
      });
      fetchAddresses(user.uid);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to delete address: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setNewAddress(address);
  };
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to log out: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to view your account details.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
          <p className="text-muted-foreground">Manage your account settings, orders, and addresses.</p>
        </div>
        <Button variant="outline" onClick={handleLogout}><LogOut className="mr-2" />Logout</Button>
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4">
          <TabsTrigger value="profile"><User className="mr-2" />Profile</TabsTrigger>
          <TabsTrigger value="orders"><Package className="mr-2" />Orders</TabsTrigger>
          <TabsTrigger value="addresses"><MapPin className="mr-2" />Addresses</TabsTrigger>
          <TabsTrigger value="payment"><CreditCard className="mr-2" />Payment</TabsTrigger>
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
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} disabled />
              </div>
              <Button onClick={handleProfileUpdate}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders" className="mt-6">
           <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View your past orders and their status.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {MOCK_ORDERS.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between bg-muted/50 p-4">
                      <div className="grid gap-0.5">
                        <div className="font-semibold">Order ID: {order.id}</div>
                        <div className="text-sm text-muted-foreground">Date: {order.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{order.status}</span>
                         <Button size="sm" variant="outline">View Order</Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.name} (x{item.quantity})</TableCell>
                              <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                       <Separator className="my-4" />
                       <div className="text-right font-semibold">
                         Order Total: ${order.total.toFixed(2)}
                       </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="addresses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Addresses</CardTitle>
              <CardDescription>Add or remove your shipping addresses.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {addresses.map((address) => (
                  <Card key={address.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{address.street}</h3>
                      <p className="text-muted-foreground">{address.city}, {address.state} {address.zip}, {address.country}</p>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditAddress(address)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteAddress(address.id!)}>Remove</Button>
                    </div>
                  </Card>
                ))}
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-2">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                <form onSubmit={handleAddOrUpdateAddress} className="space-y-4">
                  <Input placeholder="Street" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} required />
                  <Input placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} required />
                  <Input placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} required />
                  <Input placeholder="Zip Code" value={newAddress.zip} onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })} required />
                  <Input placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} required />
                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingAddress ? 'Update Address' : 'Add Address'}
                    </Button>
                    {editingAddress && (
                      <Button type="button" variant="outline" onClick={() => {setEditingAddress(null); setNewAddress({ street: '', city: '', state: '', zip: '', country: '' });}}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payment" className="mt-6">
           <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment methods.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <Card className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Visa ending in 1234</h3>
                  <p className="text-muted-foreground">Expires 12/2025</p>
                </div>
                 <div className="space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Remove</Button>
                 </div>
               </Card>
              <Button>Add Payment Method</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

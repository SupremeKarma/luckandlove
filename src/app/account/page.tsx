'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Order } from '@/lib/types';
import { User, MapPin, Package, CreditCard } from 'lucide-react';

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
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
        <p className="text-muted-foreground">Manage your account settings, orders, and addresses.</p>
      </div>
      <Tabs defaultValue="orders" className="w-full">
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
              <Button>Save Changes</Button>
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
            <CardContent className="space-y-4">
               <Card className="p-4">
                 <h3 className="font-semibold">Default Shipping Address</h3>
                 <p className="text-muted-foreground">123 Tech Lane, Silicon Valley, CA 94043</p>
                 <div className="mt-2 space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Remove</Button>
                 </div>
               </Card>
              <Button>Add New Address</Button>
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

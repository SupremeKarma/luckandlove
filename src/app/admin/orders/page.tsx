
'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockOrders, fmt } from '@/components/store/types';

export default function AdminOrdersPage() {
  const [fulfillment, setFulfillment] = React.useState<string>("");
  const [payment, setPayment] = React.useState<string>("");
  const [q, setQ] = React.useState("");
  
  const orders = mockOrders;

  const filtered = orders.filter((o) => {
    const f = fulfillment ? o.fulfillment === fulfillment : true;
    const p = payment ? o.status === payment : true;
    const s = `${o.id} ${o.userEmail}`.toLowerCase().includes(q.toLowerCase());
    return f && p && s;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Orders</h1>
        <Button variant="secondary" className="flex items-center gap-2"><Download className="h-4 w-4" /> Export to CSV</Button>
      </div>
      <Card className="rounded-2xl">
        <CardHeader>
           <div className="flex flex-wrap gap-3 items-center">
            <Select value={fulfillment} onValueChange={setFulfillment}>
              <SelectTrigger className="w-[220px]"><SelectValue placeholder="Select fulfillment status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="unfulfilled">Unfulfilled</SelectItem>
                <SelectItem value="fulfilled">Fulfilled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={payment} onValueChange={setPayment}>
              <SelectTrigger className="w-[220px]"><SelectValue placeholder="Select payment status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="pending">Unpaid</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Fulfillment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow key={o.id} className="hover:bg-muted/40 cursor-pointer">
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>{fmt.date(o.createdAt)}</TableCell>
                    <TableCell className="text-muted-foreground">{o.userEmail}</TableCell>
                    <TableCell className="text-right">{fmt.currency(o.total)}</TableCell>
                    <TableCell>
                      {o.status === "paid" ? <Badge className="bg-emerald-500/15 text-emerald-400 rounded-full">Paid</Badge> : <Badge className="bg-yellow-500/15 text-yellow-400 rounded-full">Not paid</Badge>}
                    </TableCell>
                    <TableCell>
                      {o.fulfillment === "fulfilled" ? <Badge className="bg-emerald-500/15 text-emerald-400 rounded-full">Fulfilled</Badge> : <Badge className="bg-yellow-500/15 text-yellow-400 rounded-full">Unfulfilled</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

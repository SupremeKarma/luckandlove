
"use client";

import * as React from "react";
import { getSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { updateOrderStatus } from "./_actions";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

type Order = {
  id: string;
  email: string | null;
  status: "pending" | "paid" | "shipped" | "cancelled" | "refunded";
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  created_at: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<"" | Order["status"]>("");
  const [q, setQ] = React.useState("");
  const router = useRouter();

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("orders")
      .select("id,email,status,subtotal,tax,shipping,total,created_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      setError("Could not load orders.");
      setOrders([]);
    } else {
      setOrders((data ?? []) as any);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const filtered = orders.filter(o =>
    (status ? o.status === status : true) &&
    (`${o.email ?? ""} ${o.id}`.toLowerCase().includes(q.toLowerCase()))
  );

  const handleSetOrderStatus = async (id: string, nextStatus: Order["status"]) => {
    const originalOrders = [...orders];
    
    // Optimistically update the UI
    setOrders(currentOrders => 
      currentOrders.map(o => (o.id === id ? { ...o, status: nextStatus } : o))
    );

    const result = await updateOrderStatus(id, nextStatus);

    if (result.error) {
      // Rollback on error
      setOrders(originalOrders);
      toast({
        title: "Error",
        description: `Failed to update order: ${result.error}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Order status updated to ${nextStatus}.`,
      });
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch(status) {
      case 'paid': return 'bg-green-500/20 text-green-400';
      case 'shipped': return 'bg-blue-500/20 text-blue-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      case 'refunded': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold">Orders</h1>
        <div className="ml-auto flex items-center gap-2">
          <input
            className="input w-64"
            placeholder="Search by email or ID…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Select value={status} onValueChange={(v: any) => setStatus(v)}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary" onClick={load}>Refresh</Button>
        </div>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}
      {loading && <div className="text-sm text-muted-foreground">Loading…</div>}

      {!loading && (
        <Card className="rounded-2xl">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">All orders</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="table-wrap">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-40 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(o => (
                    <TableRow key={o.id} onClick={() => router.push(`/admin/orders/${o.id}`)} className="cursor-pointer">
                      <TableCell className="font-mono text-xs">{o.id.slice(0,8)}…</TableCell>
                      <TableCell className="text-sm">{o.email ?? "—"}</TableCell>
                      <TableCell className="text-sm capitalize">
                        <Badge className={`${getStatusColor(o.status)} hover:${getStatusColor(o.status)} rounded-full`}>{o.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">NPR {Number(o.total).toFixed(2)}</TableCell>
                      <TableCell className="text-sm">{new Date(o.created_at).toLocaleString()}</TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Select onValueChange={(v: any) => handleSetOrderStatus(o.id, v)} defaultValue={o.status}>
                          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {["pending","paid","shipped","cancelled","refunded"].map(s => (
                              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                        No orders match your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

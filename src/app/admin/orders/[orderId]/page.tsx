
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateOrderStatus } from "../_actions";
import { refundOrder } from "./refund-action";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import StatusTimeline from "@/components/StatusTimeline";
import Link from "next/link";

type Order = {
  id: string;
  email: string | null;
  status: "pending" | "paid" | "shipped" | "cancelled" | "refunded";
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  created_at: string;
  stripe_session_id?: string | null;
  stripe_payment_intent_id?: string | null;
  shipping_address?: Record<string, any> | null;
  shipping_method?: string | null;
};
type Item = { id: string; name: string; qty: number; unit_price: number; line_total: number };
type Event = { id: string; order_id: string; type: string; message: string; created_at: string };

const statusColors: Record<Order['status'], string> = {
  pending: "bg-amber-500/15 text-amber-400",
  paid: "bg-emerald-500/15 text-emerald-400",
  shipped: "bg-sky-500/15 text-sky-400",
  cancelled: "bg-gray-500/15 text-gray-400",
  refunded: "bg-rose-500/15 text-rose-400",
};


export default function AdminOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [items, setItems] = React.useState<Item[]>([]);
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const { toast } = useToast();

  const load = React.useCallback(async () => {
    setLoading(true);
    setErr(null);
    const supabase = getSupabase();
    const [o, it, ev] = await Promise.all([
      supabase.from("orders").select("*").eq("id", orderId).maybeSingle(),
      supabase.from("order_items").select("id,name,qty,unit_price,line_total").eq("order_id", orderId).order("created_at", { ascending: true }),
      supabase.from("order_events").select("*").eq("order_id", orderId).order("created_at", { ascending: true })
    ]);
    if (o.error || !o.data) { setErr("Could not load order."); setOrder(null); setItems([]); setEvents([]); }
    else { setOrder(o.data as any); setItems((it.data ?? []) as any); setEvents((ev.data ?? []) as any); }
    setLoading(false);
  }, [orderId]);

  React.useEffect(() => { load(); }, [load]);

  const onStatus = async (nextStatus: Order["status"]) => {
    if (!order) return;
    const originalOrder = order;
    setIsUpdating(true);
    setOrder({ ...order, status: nextStatus });
    const { error } = await updateOrderStatus(order.id, nextStatus);
    if (error) {
      setOrder(originalOrder);
      toast({ title: "Error", description: `Failed to update status: ${error}`, variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Order status updated to ${nextStatus}.` });
      await load(); // a full reload to get latest events
    }
    setIsUpdating(false);
  };

  const onRefund = async () => {
    if (!order) return;
    setIsUpdating(true);
    
    try {
      await refundOrder(order.id);
      toast({ title: "Refund Initiated", description: "The status will update once confirmed by Stripe." });
      await load();
    } catch (e: any) {
      toast({ title: "Refund Failed", description: e.message, variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getStatusBadge = (status: Order['status']) => {
    const s = statusColors[status] ?? statusColors.pending;
    return <Badge className={`rounded-full capitalize ${s}`}>{status}</Badge>
  }


  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading…</div>;
  if (err || !order) return <div className="p-6 text-sm text-red-500">{err ?? "Not found"}</div>;

  return (
    <div className="p-6 space-y-4">
      <Button variant="secondary" onClick={() => router.push("/admin/orders")}>← Back</Button>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <span className="font-semibold">Order {order.id.slice(0,8)}…</span>
                {getStatusBadge(order.status)}
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/orders/${order.id}/invoice`} target="_blank">
                <Button variant="secondary">Invoice PDF</Button>
              </Link>
              <Select defaultValue={order.status} onValueChange={(v:any)=>onStatus(v)} disabled={isUpdating}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["pending","paid","shipped","cancelled","refunded"].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={onRefund} disabled={order.status !== "paid" || isUpdating}>
                {isUpdating ? "Refunding..." : "Refund"}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="rounded-2xl border">
              <div className="px-4 py-3 border-b text-sm text-muted-foreground">Items</div>
              <div className="p-4 space-y-2">
                {items.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No items.</div>
                ) : items.map(i => (
                  <div key={i.id} className="flex items-center justify-between text-sm">
                    <div className="truncate">{i.name} × {i.qty}</div>
                    <div>NPR {Number(i.line_total).toFixed(2)}</div>
                  </div>
                ))}
                <div className="h-px bg-border my-2" />
                <div className="flex items-center justify-between text-sm"><span>Subtotal</span><span>NPR {Number(order.subtotal).toFixed(2)}</span></div>
                <div className="flex items-center justify-between text-sm"><span>Tax</span><span>NPR {Number(order.tax).toFixed(2)}</span></div>
                <div className="flex items-center justify-between text-sm"><span>Shipping</span><span>NPR {Number(order.shipping).toFixed(2)}</span></div>
                <div className="flex items-center justify-between text-sm font-semibold"><span>Total</span><span>NPR {Number(order.total).toFixed(2)}</span></div>
              </div>
            </div>
             <div className="rounded-2xl border">
                <div className="px-4 py-3 border-b text-sm text-muted-foreground">Shipping</div>
                <div className="p-4 text-sm space-y-1">
                    <div>{order.shipping_address?.name ?? "—"}</div>
                    <div>{order.shipping_address?.line1 ?? "—"}</div>
                    <div>{order.shipping_address?.line2 ?? ""}</div>
                    <div>{order.shipping_address?.city ?? "—"}, {order.shipping_address?.state ?? ""} {order.shipping_address?.postal_code ?? ""}</div>
                    <div>{order.shipping_address?.country ?? "—"}</div>
                    <div className="text-muted-foreground">Method: {order.shipping_method ?? "—"}</div>
                    <div className="text-muted-foreground">Cost: NPR {Number(order.shipping).toFixed(2)}</div>
                </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border">
              <div className="px-4 py-3 border-b text-sm text-muted-foreground">Customer</div>
              <div className="p-4 text-sm space-y-1">
                <div>Email: {order.email ?? "—"}</div>
                <div>Created: {new Date(order.created_at).toLocaleString()}</div>
                <div>Currency: {order.currency}</div>
              </div>
            </div>
            <div className="rounded-2xl border">
              <div className="px-4 py-3 border-b text-sm text-muted-foreground">Payment</div>
              <div className="p-4 text-xs space-y-1 font-mono">
                <div>Session: {order.stripe_session_id ?? "—"}</div>
                <div>Intent: {order.stripe_payment_intent_id ?? "—"}</div>
              </div>
            </div>
            <div className="rounded-2xl border">
              <div className="px-4 py-3 border-b text-sm text-muted-foreground">Timeline</div>
              <div className="p-4">
                <StatusTimeline events={events} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

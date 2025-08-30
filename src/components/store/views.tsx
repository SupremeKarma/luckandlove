
"use client";

import React from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Plus, MoreHorizontal, Search, Package, ShoppingCart, DollarSign, AlertTriangle, Receipt, Eye, Download, ChevronLeft,
} from "lucide-react";
import { fmt, Order, Product, ShippingZone } from "./types";
import { Textarea } from "../ui/textarea";

export function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-muted-foreground" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v16H4z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

export function PercentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-muted-foreground" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}

export function FileTextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-muted-foreground" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}

export function Overview({ products, orders }: { products: Product[]; orders: Order[] }) {
  const revenue = orders.filter((o) => ["paid", "shipped"].includes(o.status)).reduce((s, o) => s + o.total, 0);
  const openOrders = orders.filter((o) => ["pending", "paid"].includes(o.status)).length;
  const lowStock = products.filter((p) => p.stock <= 5).length;
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Overview</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPI title="Total revenue" value={fmt.currency(revenue)} icon={<DollarSign className="h-5 w-5" />} hint="Paid & shipped" />
        <KPI title="Open orders" value={String(openOrders)} icon={<ShoppingCart className="h-5 w-5" />} hint="Pending / paid" />
        <KPI title="Active products" value={String(products.filter((p) => p.active).length)} icon={<Package className="h-5 w-5" />} hint="Visible" />
        <KPI title="Low stock" value={String(lowStock)} icon={<AlertTriangle className="h-5 w-5" />} hint="≤ 5 units" />
      </div>
    </div>
  );
}

export function KPI({ title, value, icon, hint }: { title: string; value: string; icon: React.ReactNode; hint?: string }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export function OrdersIndex({ orders, onOpen, onExport }: { orders: Order[]; onOpen: (id: string) => void; onExport: () => void }) {
  const [fulfillment, setFulfillment] = React.useState("");
  const [payment, setPayment] = React.useState("");
  const [q, setQ] = React.useState("");

  const filtered = orders.filter((o) => {
    const f = fulfillment ? o.fulfillment === fulfillment : true;
    const p = payment ? o.status === payment : true;
    const s = `${o.id} ${o.userEmail}`.toLowerCase().includes(q.toLowerCase());
    return f && p && s;
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Orders</h1>
        <Button variant="secondary" onClick={onExport} className="flex items-center gap-2"><Download className="h-4 w-4" /> Export to CSV</Button>
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
                  <TableRow key={o.id} className="hover:bg-muted/40 cursor-pointer" onClick={() => onOpen(o.id)}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>{fmt.date(o.createdAt)}</TableCell>
                    <TableCell className="text-muted-foreground">{o.userEmail}</TableCell>
                    <TableCell className="text-right">{fmt.currency(o.total)}</TableCell>
                    <TableCell>{o.status === "paid" ? <Badge className="bg-emerald-500/15 text-emerald-400 rounded-full">Paid</Badge> : <Badge className="bg-yellow-500/15 text-yellow-400 rounded-full">Not paid</Badge>}</TableCell>
                    <TableCell>{o.fulfillment === "fulfilled" ? <Badge className="bg-emerald-500/15 text-emerald-400 rounded-full">Fulfilled</Badge> : <Badge className="bg-yellow-500/15 text-yellow-400 rounded-full">Unfulfilled</Badge>}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function OrderDetail({ order, onBack, onUpdate }: { order: Order; onBack: () => void; onUpdate: (partial: Partial<Order>) => void }) {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}><ChevronLeft className="h-4 w-4" /></Button>
          <div>
            <div className="text-xl font-semibold">Order {order.id}</div>
            <div className="text-xs text-muted-foreground">{fmt.date(order.createdAt)}</div>
          </div>
          <div className="flex items-center gap-2 ml-3">
            {order.fulfillment === "unfulfilled" && <Badge className="rounded-full bg-yellow-500/15 text-yellow-400">Unfulfilled</Badge>}
            {order.status !== "paid" && <Badge className="rounded-full bg-yellow-500/15 text-yellow-400">Not paid</Badge>}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">More actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Print</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">Cancel order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full border-2 border-yellow-400" />
                  <div className="font-semibold">Unfulfilled ({order.items.length})</div>
                </div>
                <Button onClick={() => onUpdate({ fulfillment: "fulfilled" })}>Mark as fulfilled</Button>
              </div>
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableBody>
                    {order.items.map((it, i) => (
                      <TableRow key={i}>
                        <TableCell className="w-12"><img src={it.imageUrl} alt="" className="h-9 w-9 rounded object-cover" /></TableCell>
                        <TableCell className="font-medium">{it.name}</TableCell>
                        <TableCell className="text-right">1 x {fmt.currency(it.price)}</TableCell>
                        <TableCell className="text-right">{fmt.currency(it.qty * it.price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full border-2 border-yellow-400" />
                  <div className="font-semibold">Not paid</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" className="flex items-center gap-2"><Receipt className="h-4 w-4" /> Create invoice</Button>
                </div>
              </div>
              <div className="rounded-xl border p-4 space-y-2">
                <div className="flex items-center justify-between text-sm"><span>Subtotal ({order.items.length} item)</span><span>{fmt.currency(order.total)}</span></div>
                <Separator />
                <div className="flex items-center justify-between font-semibold"><span>Total</span><span>{fmt.currency(order.total)}</span></div>
                <div className="text-sm text-muted-foreground">Payment method: <span className="font-medium">{order.paymentMethod ?? "—"}</span></div>
                <div className="flex justify-end"><Button onClick={() => onUpdate({ status: "paid" })}>Mark as paid</Button></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <div className="font-semibold">Customer</div>
            <div className="text-sm"><span className="text-muted-foreground">Name:</span> {order.customer?.name ?? "—"}</div>
            <div className="text-sm"><span className="text-muted-foreground">Shipping method:</span> Regular</div>
            <div className="text-sm">
              <div className="text-muted-foreground">Address:</div>
              <div>{order.customer?.address}</div>
              <div>{order.customer?.city}</div>
              <div>{order.customer?.country}</div>
            </div>
            <div className="text-sm"><span className="text-muted-foreground">Email:</span> {order.userEmail}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ProductsIndex({ products, onEdit, onAdd }: { products: Product[]; onEdit: (id: string) => void; onAdd: () => void }) {
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState("created-asc");
  const filtered = products
    .filter((p) => `${p.name} ${p.sku}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (sort === "created-asc" ? (a.createdAt ?? "").localeCompare(b.createdAt ?? "") : (b.createdAt ?? "").localeCompare(a.createdAt ?? "")));

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Import products</Button>
          <Button onClick={onAdd}><Plus className="h-4 w-4 mr-2" /> Add product</Button>
        </div>
      </div>
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex flex-wrap gap-3 items-center">
            <Select defaultValue="uncategorized">
              <SelectTrigger className="w-[240px]"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="uncategorized">Uncategorised products</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="created-asc">Created: Oldest first</SelectItem>
                <SelectItem value="created-desc">Created: Newest first</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search for product" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Variants</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/40">
                    <TableCell className="w-12"><Checkbox aria-label="select" /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={p.imageUrl} alt="" className="h-10 w-10 rounded object-cover" />
                        <div className="font-medium">{p.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{fmt.currency(p.price)}</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>{p.stock > 0 ? "In stock" : "Out of stock"}</TableCell>
                    <TableCell>{p.sku ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button size="icon" variant="ghost"><Eye className="h-4 w-4" /></Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(p.id)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ProductEditor({ product: initialProduct, onBack, onSave }: { product?: Product; onBack: () => void; onSave: (p: Product) => void }) {
  const [p, setP] = React.useState<Partial<Product>>(initialProduct || { name: "", price: 0, stock: 0, active: true });

  const handleSave = () => {
    // Basic validation
    if (!p.name || p.price === undefined || p.stock === undefined) {
      alert("Please fill out Title, Price, and Stock.");
      return;
    }
    onSave(p as Product);
  };
  
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}><ChevronLeft className="h-4 w-4" /></Button>
        <h1 className="text-xl font-semibold">{initialProduct ? 'Edit physical product' : 'Add new product'}</h1>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-2">
              <Label>Product</Label>
              <div className="flex items-center gap-3">
                <div className="h-20 w-20 rounded border flex items-center justify-center text-xs text-muted-foreground">Add media</div>
                <Button variant="secondary">Generate product details</Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Subtitle</Label>
                <Input placeholder="Your product subtitle" />
              </div>
              <div className="grid gap-2">
                <Label>Ribbon</Label>
                <Input placeholder="e.g. NEW" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea className="min-h-[140px] w-full rounded-md border bg-transparent p-3 outline-none" placeholder="Describe your product..." />
            </div>
            <div className="grid gap-2">
              <Label>Pricing</Label>
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <Label className="text-xs text-muted-foreground">Price</Label>
                  <Input value={String(p.price)} onChange={(e) => setP({ ...p, price: Number(e.target.value || 0) })} />
                </div>
                <div className="col-span-1">
                  <Label className="text-xs text-muted-foreground">Discount price</Label>
                  <Input />
                </div>
                <div className="col-span-1">
                  <Label className="text-xs text-muted-foreground">SKU</Label>
                  <Input value={p.sku ?? ""} onChange={(e) => setP({ ...p, sku: e.target.value })} />
                </div>
                <div className="col-span-1">
                  <Label className="text-xs text-muted-foreground">Stock</Label>
                  <Input type="number" value={String(p.stock)} onChange={(e) => setP({ ...p, stock: Number(e.target.value || 0) })} />
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Options</Label>
              <Button variant="secondary" size="sm">Add option</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Visibility</div>
              <Select defaultValue={p.active ? 'visible' : 'hidden'} onValueChange={(val) => setP({...p, active: val === 'visible'})}>
                <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="visible">Visible</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Category</Label>
              <Input placeholder="e.g. Kitchen" value={p.category ?? ""} onChange={(e) => setP({ ...p, category: e.target.value })} />
            </div>
            <Separator />
            <div className="flex gap-2">
              <Button variant="secondary" onClick={onBack}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function Categories() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Categories</h1>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">To show products by category on your website, add eCommerce section and adjust its settings.</div>
        <Button><Plus className="h-4 w-4 mr-2" /> Add category</Button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[{ id: "all", name: "All products", count: 8 }, { id: "men", name: "Men's Wear", count: 2 }, { id: "women", name: "Women's Wear", count: 1 }].map((c) => (
          <Card key={c.id} className="rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.count} products</div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
        <div className="rounded-2xl border border-dashed p-6 flex items-center justify-center text-sm text-muted-foreground">Add category</div>
      </div>
    </div>
  );
}

export function Discounts({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Discounts</h1>
        <Button onClick={onAdd}><Plus className="h-4 w-4 mr-2" /> Add discount</Button>
      </div>
      <Card className="rounded-2xl">
        <CardContent className="p-0">
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[{ id: "d_black", code: "BLACKFRIDAY50", name: "Black Friday 50%", type: "percentage", value: 50, active: false }].map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.code}</TableCell>
                    <TableCell>{d.name}</TableCell>
                    <TableCell className="capitalize">{d.type}</TableCell>
                    <TableCell className="text-right">{d.type === "percentage" ? `${d.value}%` : fmt.currency(d.value as number)}</TableCell>
                    <TableCell><Badge className="bg-gray-500/15 text-gray-400 rounded-full">Inactive</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function DiscountCreate({ onCancel, onSave }: { onCancel: () => void; onSave: () => void }) {
  const [type, setType] = React.useState<"percentage" | "amount">("percentage");
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onCancel}><ChevronLeft className="h-4 w-4" /></Button>
        <h1 className="text-xl font-semibold">Add discount</h1>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-2">
              <Button variant={type === "percentage" ? "default" : "secondary"} onClick={() => setType("percentage")}>Percentage</Button>
              <Button variant={type === "amount" ? "default" : "secondary"} onClick={() => setType("amount")}>Fixed amount</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Discount code</Label>
                <Input placeholder="e.g., BLACKFRIDAY50" />
              </div>
              <div className="grid gap-2">
                <Label>Discount name</Label>
                <Input placeholder="e.g., Black Friday Campaign" />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Discount</Label>
                <Input placeholder="0" />
              </div>
              <div className="grid gap-2">
                <Label>Apply to</Label>
                <Select defaultValue="all">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All products</SelectItem>
                    <SelectItem value="categories">Specific categories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-3">
              <div className="font-semibold">Discount conditions</div>
              <div className="flex items-center gap-2"><Checkbox /> <span className="text-sm">Limit the total number of uses for this discount</span></div>
              <div className="flex items-center gap-2"><Checkbox /> <span className="text-sm">Set minimum purchase amount for entire cart (NPRs)</span></div>
            </div>
            <div className="space-y-3">
              <div className="font-semibold">Active dates</div>
              <div className="grid md:grid-cols-3 gap-3">
                <Input placeholder="Start date" />
                <Input placeholder="Start time" />
                <div className="flex items-center gap-2"><Checkbox id="has-end" /><Label htmlFor="has-end">Set end date</Label></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-3">
          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="text-sm text-muted-foreground">Summary</div>
              <div className="text-sm">Type: {type === "percentage" ? "Percentage" : "Fixed amount"}</div>
            </CardContent>
          </Card>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button onClick={onSave}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Analytics({ products, orders }: { products: Product[]; orders: Order[] }) {
  const totalSales = orders.filter((o) => ["paid", "shipped"].includes(o.status)).reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const avgOrder = totalOrders ? totalSales / totalOrders : 0;
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">Analytics</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary">1 Aug 2025 — 30 Aug 2025</Button>
          <Button variant="secondary">No comparison</Button>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-36 rounded-xl border flex items-center justify-center text-sm text-muted-foreground">Chart</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-36 rounded-xl border flex items-center justify-center text-2xl font-semibold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Average order value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-36 rounded-xl border flex items-center justify-center text-2xl font-semibold">{fmt.currency(avgOrder)}</div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Total sales by product</CardTitle>
            <Button variant="secondary" size="sm">Sort by: Sales</Button>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {products.slice(0, 6).map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <img src={p.imageUrl} alt={p.name} className="h-10 w-10 rounded object-cover" />
                  <div className="text-sm flex-1">{p.name}</div>
                  <div className="text-sm text-muted-foreground">0 sales</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function SettingsCompany() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Company information</h1>
      <Card className="max-w-4xl">
        <CardContent className="p-6 grid md:grid-cols-[1fr_240px] gap-6">
          <div className="space-y-2">
            <Label>Company name</Label>
            <Input placeholder="Your official company name" />
          </div>
          <div className="rounded-lg border border-dashed flex items-center justify-center text-xs text-muted-foreground">Upload logo</div>
        </CardContent>
      </Card>
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Contacts & address</CardTitle>
          <CardDescription>If you don't have a physical address, enter the shipping origin address.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input defaultValue="amanmahato321@gmail.com" />
          </div>
          <div className="grid gap-2">
            <Label>Phone number</Label>
            <Input placeholder="e.g., +977" />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label>Street address</Label>
            <Input placeholder="e.g., Street 123" />
          </div>
          <div className="grid gap-2">
            <Label>City</Label>
            <Input placeholder="e.g., Janakpur" />
          </div>
          <div className="grid gap-2">
            <Label>Zip/Postal code</Label>
            <Input placeholder="e.g., 45600" />
          </div>
          <div className="grid gap-2">
            <Label>Country</Label>
            <Select defaultValue="Nepal">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Nepal">Nepal</SelectItem>
                <SelectItem value="India">India</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-2 max-w-4xl">
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </div>
    </div>
  );
}

export function SettingsPayments() {
  return (
    <div className="p-6 space-y-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Payments</h1>
        <div className="text-sm text-muted-foreground">Your company location: Nepal</div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manual payment</CardTitle>
          <CardDescription>Accept payments made outside your online store.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="text-sm">Cash</div>
            <Badge className="bg-emerald-500/15 text-emerald-400 rounded-full">Enabled</Badge>
          </div>
          <div className="flex justify-end"><Button variant="secondary">Manage</Button></div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SettingsShipping({ zones, onCreate, onOpen }: { zones: ShippingZone[]; onCreate: () => void; onOpen: (id: string) => void }) {
  return (
    <div className="p-6 space-y-4 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Shipping</h1>
        <Button onClick={onCreate}>Create zone</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shipping zone</TableHead>
                <TableHead>Countries</TableHead>
                <TableHead>Rates</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zones.map((z) => (
                <TableRow key={z.id} className="hover:bg-muted/40 cursor-pointer" onClick={() => onOpen(z.id)}>
                  <TableCell className="font-medium">{z.name}</TableCell>
                  <TableCell>{z.countries.join(", ")}</TableCell>
                  <TableCell>{z.options.map((o) => o.rate).join(", ")}</TableCell>
                  <TableCell className="text-right">⋯</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function SettingsShippingEdit({ zone, onBack, onChange }: { zone: ShippingZone; onBack: () => void; onChange: (z: ShippingZone) => void }) {
  const [name, setName] = React.useState(zone.name);
  const [countries, setCountries] = React.useState(zone.countries.join(", "));
  const [options, setOptions] = React.useState(zone.options);
  return (
    <div className="p-6 space-y-4 max-w-5xl">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}><ChevronLeft className="h-4 w-4" /></Button>
        <h1 className="text-xl font-semibold">Edit shipping zone</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Shipping zone</CardTitle>
          <CardDescription>Name this shipping zone and add countries.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Countries</Label>
              <Input value={countries} onChange={(e) => setCountries(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Shipping options</CardTitle>
          <CardDescription>Add available shipping options for this zone.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Option</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {options.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.name}</TableCell>
                  <TableCell>{o.condition ?? "—"}</TableCell>
                  <TableCell>{o.rate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setOptions((prev) => prev.map((x) => x.id === o.id ? { ...x, name: x.name + "*" } : x))}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500" onClick={() => setOptions((prev) => prev.filter((x) => x.id !== o.id))}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-4"><Button onClick={() => setOptions((prev) => [...prev, { id: `opt_${Math.random().toString(36).slice(2,6)}`, name: "New option", rate: "Free" }])}>Add option</Button></div>
        </CardContent>
      </Card>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onBack}>Cancel</Button>
        <Button onClick={() => onChange({ id: zone.id, name, countries: countries.split(",").map((s) => s.trim()).filter(Boolean), options })}>Save</Button>
      </div>
    </div>
  );
}

export function SettingsShippingAdd({ onBack, onCreate }: { onBack: () => void; onCreate: (z: ShippingZone) => void }) {
  const [name, setName] = React.useState("");
  const [countries, setCountries] = React.useState("");
  return (
    <div className="p-6 space-y-4 max-w-5xl">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}><ChevronLeft className="h-4 w-4" /></Button>
        <h1 className="text-xl font-semibold">Add shipping zone</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Shipping zone</CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid md:grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Baltic region" />
          </div>
          <div className="grid gap-2">
            <Label>Countries</Label>
            <Input value={countries} onChange={(e) => setCountries(e.target.value)} placeholder="Add country" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Shipping options</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-sm text-muted-foreground">Add at least one country to manage shipping options</CardContent>
      </Card>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onBack}>Cancel</Button>
        <Button onClick={() => onCreate({ id: `z_${Math.random().toString(36).slice(2,6)}`, name, countries: countries.split(",").map((s) => s.trim()).filter(Boolean), options: [] })}>Save</Button>
      </div>
    </div>
  );
}

export function SettingsCheckout() {
  return (
    <div className="p-6 space-y-4 max-w-5xl">
      <h1 className="text-xl font-semibold">Checkout</h1>
      <Card>
        <CardHeader>
          <CardTitle>Shopping bag settings</CardTitle>
        </CardHeader>
        <CardContent className="p-6"><div className="flex items-center gap-2"><Checkbox /> <span className="text-sm">Show additional product suggestions in shopping bag</span></div></CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Checkout policies</CardTitle>
          <CardDescription>Add policies to your website and link them here.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-2">
          <div className="flex items-center gap-2"><Checkbox /> <span className="text-sm">Terms & Conditions</span></div>
          <div className="flex items-center gap-2"><Checkbox /> <span className="text-sm">Privacy policy</span></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Custom options</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-2">
          <div className="flex items-center gap-2"><Checkbox /> <span className="text-sm">Require phone number at checkout</span></div>
          <div className="flex items-center gap-2"><Checkbox /> <span className="text-sm">Add a custom field to the checkout</span></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Store language</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Select defaultValue="en">
            <SelectTrigger className="w-[240px]"><SelectValue placeholder="English" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ne">Nepali</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <div className="flex gap-2">
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </div>
    </div>
  );
}

export function SettingsEmails() {
  const sections = [
    { title: "Order confirmation", rows: ["Order confirmation", "Order confirmation (when manual payment used)", "Order confirmation (when delayed payment used)"] },
    { title: "Shipping", rows: ["Shipping confirmation (for physical products only)", "Shipping confirmation with tracking number (for physical products only)", "Shipping update (for physical products only)"] },
    { title: "Digital file download", rows: ["Digital file download link"] },
    { title: "Gift card", rows: ["Gift card details"] },
    { title: "Invoices", rows: ["Invoice of the order"] },
  ];
  return (
    <div className="p-6 space-y-4 max-w-5xl">
      <h1 className="text-xl font-semibold">Emails</h1>
      {sections.map((s) => (
        <Card key={s.title}>
          <CardHeader>
            <CardTitle>{s.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableBody>
                {s.rows.map((r) => (
                  <TableRow key={r}>
                    <TableCell>{r}</TableCell>
                    <TableCell className="text-right"><Button variant="secondary" size="sm">Preview</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function SettingsTaxes() {
  return (
    <div className="p-6 space-y-4 max-w-4xl">
      <h1 className="text-xl font-semibold">Taxes</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tax configuration</CardTitle>
          <CardDescription>Define tax rates and inclusive/exclusive pricing.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2"><Checkbox /> <span className="text-sm">Prices include tax</span></div>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="grid gap-2">
              <Label>Default tax rate (%)</Label>
              <Input defaultValue="13" />
            </div>
            <div className="grid gap-2">
              <Label>Region</Label>
              <Select defaultValue="Nepal">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nepal">Nepal</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-2">
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </div>
    </div>
  );
}

export function SettingsInvoices() {
  return (
    <div className="p-6 space-y-4 max-w-6xl">
      <h1 className="text-xl font-semibold">Invoices</h1>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Invoice preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-xl p-6 text-sm space-y-3 bg-background">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">From:</div>
                  <div>Nepal</div>
                  <div>amanmahato321@gmail.com</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">Invoice 1</div>
                  <div>Issue date: Aug 30, 2025</div>
                  <div>Order number: 1001</div>
                </div>
              </div>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product or Service</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit price incl. Tax</TableHead>
                      <TableHead>Unit discount</TableHead>
                      <TableHead>Unit price excl. Tax</TableHead>
                      <TableHead>Tax (21%)</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Test product name</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>{fmt.currency(10)}</TableCell>
                      <TableCell>{fmt.currency(1.2)}</TableCell>
                      <TableCell>{fmt.currency(7.27)}</TableCell>
                      <TableCell>{fmt.currency(3.06)}</TableCell>
                      <TableCell>{fmt.currency(17.6)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Shipping</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>{fmt.currency(2)}</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>{fmt.currency(1.65)}</TableCell>
                      <TableCell>{fmt.currency(0.35)}</TableCell>
                      <TableCell>{fmt.currency(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="text-xs text-muted-foreground">This is not a tax invoice. You are fully responsible for ensuring invoices you issue conform to any relevant legal requirements.</div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input defaultValue="Invoice" />
              </div>
              <div className="grid gap-2">
                <Label>Next invoice number</Label>
                <Input defaultValue="1" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Company</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-sm space-y-2">
              <div className="text-muted-foreground">All details are taken from your Company information.</div>
              <div className="rounded-lg border p-3 text-xs">
                <div>Company name</div>
                <div>Street Address</div>
                <div>City, Region/Province, ZIP/Postal code</div>
                <div>Nepal</div>
                <div>amanmahato321@gmail.com</div>
                <div>Phone number</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Additional information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Button variant="secondary">Add information</Button>
            </CardContent>
          </Card>
          <div className="flex gap-2">
            <Button variant="secondary">Cancel</Button>
            <Button>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v16H4z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}
function PercentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}
function FileTextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}
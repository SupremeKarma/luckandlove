
"use client";

import React from "react";
import { supabase } from "@/lib/supabase";
import { mapProductRow, type Product } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, Download, Plus, RefreshCcw, EyeOff, Eye } from "lucide-react";

export default function AdminProductsPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<"" | "active" | "inactive">("");
  const [sort, setSort] = React.useState<"created_desc" | "created_asc" | "price_desc" | "price_asc">("created_desc");
  const [products, setProducts] = React.useState<Product[]>([]);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const order = sort.startsWith("created") ? "created_at" : "price";
    const ascending = sort.endsWith("asc");
    const { data, error } = await supabase
      .from("products")
      .select("id, name, sku, price, stock, category, image_url, active, created_at")
      .order(order, { ascending })
      .limit(500);
    if (error) {
      setProducts([]);
      setError("Could not load products.");
    } else {
      setProducts((data ?? []).map(mapProductRow));
    }
    setLoading(false);
  }, [sort]);

  React.useEffect(() => {
    load();
  }, [load]);

  const filtered = products
    .filter((p) => (status === "" ? true : status === "active" ? p.active : !p.active))
    .filter((p) => `${p.name} ${p.sku ?? ""} ${p.category ?? ""}`.toLowerCase().includes(q.toLowerCase()));

  const exportCsv = () => {
    const rows = [
      ["id", "name", "sku", "price", "stock", "category", "active", "created_at"],
      ...filtered.map((p) => [
        p.id,
        p.name,
        p.sku ?? "",
        String(p.price ?? 0),
        String(p.stock ?? 0),
        p.category ?? "",
        p.active ? "true" : "false",
        p.created_at ?? "",
      ]),
    ];
    const csv = rows.map((r) =>
      r.map((v) => {
        const s = String(v ?? "");
        return s.includes(",") || s.includes("\"") || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
      }).join(",")
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const addProduct = async () => {
    setError(null);
    const { data, error } = await supabase
      .from("products")
      .insert([{ name: "Untitled product", price: 0, stock: 0, active: false }])
      .select()
      .single();
    if (error) {
      setError("Could not create product.");
      return;
    }
    setProducts((prev) => [mapProductRow(data), ...prev]);
  };

  const toggleActive = async (p: Product) => {
    setError(null);
    const nextActive = !p.active;
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: nextActive } : x)));
    const { error } = await supabase.from("products").update({ active: nextActive }).eq("id", p.id);
    if (error) {
      setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: p.active } : x)));
      setError("Could not update product visibility.");
    }
  };

  const remove = async (p: Product) => {
    setError(null);
    const ok = window.confirm(`Delete "${p.name}"?`);
    if (!ok) return;
    const prev = products;
    setProducts((cur) => cur.filter((x) => x.id !== p.id));
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) {
      setProducts(prev);
      setError("Could not delete product.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">Products</h1>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Select value={status} onValueChange={(v: any) => setStatus(v)}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v: any) => setSort(v)}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="created_desc">Created: Newest first</SelectItem>
              <SelectItem value="created_asc">Created: Oldest first</SelectItem>
              <SelectItem value="price_desc">Price: High to low</SelectItem>
              <SelectItem value="price_asc">Price: Low to high</SelectItem>
            </SelectContent>
          </Select>
          <div className="w-64">
            <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Button variant="secondary" onClick={load}><RefreshCcw className="h-4 w-4 mr-2" />Refresh</Button>
          <Button variant="secondary" onClick={exportCsv}><Download className="h-4 w-4 mr-2" />Export CSV</Button>
          <Button onClick={addProduct}><Plus className="h-4 w-4 mr-2" />Add product</Button>
        </div>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}
      {loading && <div className="text-sm text-muted-foreground">Loading…</div>}

      {!loading && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">All products</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="table-wrap">
              <Table>
                <TableHeader>
                  <TableRow className="table-head">
                    <TableHead></TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>Inventory</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/40">
                      <TableCell className="w-14">
                        {p.image_url ? (
                          <img src={p.image_url} alt="" className="h-10 w-10 rounded object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded bg-muted" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="leading-tight">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.sku ?? "—"}</div>
                      </TableCell>
                      <TableCell className="text-right">NPR {Number(p.price).toFixed(2)}</TableCell>
                      <TableCell>{p.stock > 0 ? `In stock (${p.stock})` : "Out of stock"}</TableCell>
                      <TableCell>
                        {p.active ? (
                          <Badge className="rounded-full bg-emerald-500/15 text-emerald-400">Active</Badge>
                        ) : (
                          <Badge className="rounded-full bg-gray-500/15 text-gray-400">Hidden</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toggleActive(p)}>
                              {p.active ? <><EyeOff className="h-4 w-4 mr-2" />Hide</> : <><Eye className="h-4 w-4 mr-2" />Show</>}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500" onClick={() => remove(p)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                        No products match your filters.
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


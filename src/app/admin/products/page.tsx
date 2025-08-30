
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, MoreHorizontal, Search, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockProducts, fmt } from '@/components/store/types';

export default function AdminProductsPage() {
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState("created-asc");
  
  const products = mockProducts;

  const filtered = products
    .filter((p) => `${p.name} ${p.sku}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (sort === "created-asc" ? (a.createdAt ?? "").localeCompare(b.createdAt ?? "") : (b.createdAt ?? "").localeCompare(a.createdAt ?? "")));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Import products</Button>
          <Button><Plus className="h-4 w-4 mr-2" /> Add product</Button>
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
                        <img src={p.imageUrl} alt={p.name} className="h-10 w-10 rounded object-cover" />
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
                            <DropdownMenuItem>Edit</DropdownMenuItem>
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
    </motion.div>
  );
}

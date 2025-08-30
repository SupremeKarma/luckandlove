

export type ProfileRole = "user" | "admin";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: ProfileRole;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  sale_price?: number | null;
  inventory_quantity: number;
  product_id: string;
  sku?: string | null;
  attributes?: Record<string, unknown> | null;
  created_at?: string | null;
}

export interface Product {
  id: string;
  name:string;
  subtitle?: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  subcategory?: string;
  rating?: number;
  shop_id?: string;
  variants?: ProductVariant[] | null;
  product_variants?: ProductVariant[] | null;
  ribbon_text?: string;
  sku?: string | null;
  active: boolean;
  created_at?: string | null;
  image_url?: string | null;
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  sku?: string | null;
  imageUrl?: string | null;
};

export interface Order {
    id: string;
    date: string;
    items: CartItem[];
    total: number;
    status: 'Processing' | 'Shipped' | 'Delivered';
}

export interface Tournament {
  id: string;
  name: string;
  game: string;
  prize: number;
  participants: number;
  maxParticipants: number;
  entryFee: number;
  startDate: string;
  status: string;
  difficulty: string;
  imageUrl?: string;
  hint?: string;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  rating: number;
  deliveryTimeMinutes: number;
  deliveryFee: number;
}

export interface MenuItem {
  id: string;
  shop_id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export function mapProductRow(row: any): Product {
  return {
    id: row.id,
    name: row.name ?? "",
    price: Number(row.price_in_cents ? row.price_in_cents / 100 : (row.price ?? 0)),
    stock: Number(row.inventory_quantity ?? (row.stock ?? 0)),
    category: row.category ?? null,
    imageUrl: row.image_url ?? null,
    active: !!row.active,
    created_at: row.created_at ?? null,
    variants: (row.variants as ProductVariant[] | null) ?? null,
    subtitle: row.subtitle,
    description: row.description,
    ribbon_text: row.ribbon_text,
    sku: row.sku ?? null,
    image_url: row.image_url ?? null,
  };
}

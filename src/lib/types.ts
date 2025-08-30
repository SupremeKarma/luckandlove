
export type ProfileRole = "user" | "admin";

export interface Profile {
  id: string;
  email: string | null;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  role: ProfileRole;
  updated_at: string;
}

export interface Shop {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  rating: number | null;
  delivery_time_minutes: number | null;
  delivery_fee: number | null;
  created_at?: string | null;
}

export interface Channel {
  id: string;
  name: string;
  type: string;
  created_at?: string | null;
}

export interface Product {
  id: string;
  shop_id: string | null;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  subcategory: string | null;
  image_url: string | null;
  stock: number;
  rating: number | null;
  created_at?: string | null;
  
  // These are kept for frontend convenience but are not direct DB columns.
  // The DB uses product_variants table instead.
  variants?: ProductVariant[] | null;
  subtitle?: string;
  ribbon_text?: string;
  active: boolean; // Not in the new schema, but UI uses it. We'll manage it client-side.
  sku?: string | null; // In new schema, this is on the variant.
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string | null;
  sku: string | null;
  price: number | null;
  stock: number | null;
  attributes: Record<string, unknown> | null;
  created_at?: string | null;
}

export interface MenuItem {
  id: string;
  shop_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  created_at?: string | null;
}

export interface Message {
  id: number;
  channel_id: string;
  user_id: string;
  content: string;
  created_at?: string | null;
}

export interface Tournament {
  id: string;
  name: string;
  game: string;
  prize: number;
  participants: number;
  max_participants: number;
  entry_fee: number;
  start_date: string;
  status: string;
  difficulty: string;
  image_url: string | null;
  hint: string | null;
  created_at?: string | null;
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

export function mapProductRow(row: any): Product {
  return {
    id: row.id,
    shop_id: row.shop_id,
    name: row.name ?? "",
    description: row.description,
    price: Number(row.price ?? 0),
    category: row.category,
    subcategory: row.subcategory,
    image_url: row.image_url,
    stock: Number(row.stock ?? 0),
    rating: row.rating,
    created_at: row.created_at,
    // Frontend-only fields
    active: true, // Defaulting to true as it's not in the new schema
    variants: null, 
    ribbon_text: '', 
    subtitle: '',
    sku: null
  };
}

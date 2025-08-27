export interface Category {
  name: string;
  subcategories: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  subcategory?: string;
  rating?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

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

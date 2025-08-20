export type Category = 'Electronics' | 'Apparel' | 'Books' | 'Home Goods';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  stock: number;
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

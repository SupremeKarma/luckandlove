
export type Product = {
  id: string;
  name: string;
  sku?: string;
  price: number;
  stock: number;
  category?: string;
  imageUrl?: string;
  active: boolean;
  createdAt?: string;
};

export type Order = {
  id: string;
  userEmail: string;
  status: "pending" | "paid" | "shipped" | "cancelled" | "refunded";
  fulfillment: "unfulfilled" | "fulfilled";
  total: number;
  items: Array<{ productId: string; name: string; qty: number; price: number; imageUrl?: string }>;
  createdAt: string;
  paymentMethod?: string;
  customer?: { name?: string; address?: string; city?: string; country?: string };
};

export type ShippingZone = {
  id: string;
  name: string;
  countries: string[];
  options: { id: string; name: string; rate: string; condition?: string }[];
};

export const mockProducts: Product[] = [
  { id: "p_001", name: "Face Serum", sku: "FS-001", price: 51, stock: 18, category: "Beauty", imageUrl: "https://picsum.photos/400/400?random=1", active: true, createdAt: "2025-07-21" },
  { id: "p_002", name: "Handmade Vase", sku: "HV-002", price: 25, stock: 32, category: "Home", imageUrl: "https://picsum.photos/400/400?random=2", active: true, createdAt: "2025-05-12" },
  { id: "p_003", name: "Hand Soap", sku: "HS-003", price: 10, stock: 63, category: "Bath", imageUrl: "https://picsum.photos/400/400?random=3", active: true, createdAt: "2025-04-17" },
  { id: "p_004", name: "Set of Plates", sku: "SP-004", price: 30, stock: 12, category: "Kitchen", imageUrl: "https://picsum.photos/400/400?random=4", active: true, createdAt: "2025-03-02" },
  { id: "p_005", name: "Wooden Chair", sku: "WC-005", price: 132, stock: 4, category: "Furniture", imageUrl: "https://picsum.photos/400/400?random=5", active: true, createdAt: "2025-02-14" },
];

export const mockOrders: Order[] = [
  {
    id: "#1001",
    userEmail: "amanmahato321@gmail.com",
    status: "pending",
    fulfillment: "unfulfilled",
    total: 30,
    items: [{ productId: "p_004", name: "Set of Plates", qty: 1, price: 30, imageUrl: "https://picsum.photos/400/400?random=4" }],
    createdAt: "2025-08-30T13:46:00Z",
    paymentMethod: "Cash",
    customer: { name: "Aman Kumar Mahato", address: "Campus Chowk 45600", city: "Janakpur, 45600", country: "Nepal" },
  },
];

export const mockZones: ShippingZone[] = [
  { id: "z_np", name: "Regular", countries: ["Nepal"], options: [{ id: "opt_free", name: "Regular", rate: "Free" }] },
];

export const fmt = {
  currency(n: number) {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: "NPR" }).format(n);
    } catch {
      return `NPR ${n.toFixed(2)}`;
    }
  },
  date(iso?: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString();
  },
};

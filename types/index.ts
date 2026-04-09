/* ─────────────────────────────────────────────
   Core domain types for صيدلية كيلالا
───────────────────────────────────────────── */

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  description?: string;
  image_url?: string;
  parent_id?: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_price?: number;
  stock_quantity: number;
  category_id: string;
  category?: Category;
  images: string[];
  requires_prescription: boolean;
  is_featured: boolean;
  is_active: boolean;
  brand?: string;
  barcode?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  items: OrderItem[];
  total_amount: number;
  shipping_address: Address;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product: Product;
  quantity: number;
  unit_price: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Address {
  full_name: string;
  phone: string;
  wilaya: string;
  commune: string;
  street: string;
  additional?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: "customer" | "admin";
  created_at: string;
}

/* ── Utility types ── */
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

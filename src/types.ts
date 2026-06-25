export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  product_count: number;
}

export interface Review {
  id: number;
  product_id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Product {
  id: number;
  title: string;
  sku: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  stock: number;
  status: 'active' | 'limited' | 'archive';
  is_limited?: boolean;
  is_new?: boolean;
  description: string;
  sizes: string[];
  colors: string[];
  reviews: Review[];
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_title: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Completed';
  items: OrderItem[];
  total: number;
}

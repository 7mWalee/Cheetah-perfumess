export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'men' | 'women' | 'unisex' | 'luxury';
  type: 'woody' | 'floral' | 'amber' | 'citrus' | 'oriental' | 'fresh';
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  sizes: { size: string; price: number; stock: number }[];
  notes: { top: string[]; middle: string[]; base: string[] };
  isNew?: boolean;
  isBestseller?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  addresses: Address[];
  orders: string[];
  createdAt: string;
  isAdmin?: boolean;
}

export interface Address {
  id: string;
  type: 'delivery' | 'pickup';
  city: string;
  area: string;
  street: string;
  building: string;
  apartment?: string;
  phone: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: { productId: string; name: string; price: number; quantity: number; size: string }[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'instapay' | 'cod';
  paymentReference?: string;
  deliveryType: 'delivery' | 'pickup';
  address?: Address;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'promo' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface FilterOptions {
  category?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular' | 'rating';
}

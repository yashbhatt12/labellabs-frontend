// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  gstin: string;
  registeredAddress: string;
  city: string;
  state: string;
  pincode: string;
  role: 'BUYER' | 'ADMIN';
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  gstin: string;
  registeredAddress: string;
  city: string;
  state: string;
  pincode: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  hsn: string;
  category: string;
  manufacturer: string;
  specifications: Record<string, string>;
  images: string[];
  datasheet: string;
  inStock: boolean;
  createdAt: string;
}

export interface ProductFilter {
  category?: string;
  manufacturer?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Manufacturer {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

// Cart Types
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  productId: string;
  quantity: number;
}

// Order Types
export enum OrderStatus {
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}

export interface Order {
  id: string;
  invoiceNumber: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  deliveryAddress: string;
  paymentId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  deliveryAddress: string;
  paymentId: string;
  notes?: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  order?: Order;
}

// Razorpay Types
export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, any>;
  created_at: number;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Settings
export interface Settings {
  minOrderValue: number;
  shippingCost: number;
  freeShippingThreshold: number;
  gstRate: number;
  supportEmail: string;
  supportPhone: string;
  supportHours: string;
}

// Carousel/Special Offers
export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

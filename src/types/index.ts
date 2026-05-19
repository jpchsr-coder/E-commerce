// User & Auth Types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Product Types
export interface ProductReview {
  rating: number;
  comment: string;
  date?: string;
  reviewerName?: string;
  reviewerEmail?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: ProductReview[];
  stock: number;
  category: string;
  image?: string;
  thumbnail?: string;
  images?: string[];
  tags?: string[];
  sku?: string;
  createdAt?: string;
}

export interface ProductFilters {
  category?: string;
  priceRange?: [number, number];
  rating?: number;
  searchQuery?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popularity';
  page?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

// Wishlist Types
export interface WishlistItem {
  id: number;
  title: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  addedAt: string;
}

export interface Wishlist {
  items: WishlistItem[];
  count: number;
}

// Order Types
export interface Address {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  userId: number;
  items: CartItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

// Review Types
export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  images?: string[];
  helpful: number;
  createdAt: string;
  author: string;
  verified?: boolean;
}

// Coupon Types
export interface Coupon {
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minOrderValue?: number;
  expiryDate?: string;
  isActive: boolean;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

// Toast Notification
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

// Analytics
export interface Analytics {
  pageViews: number;
  userId: string;
  sessionId: string;
  timestamp: string;
}

// Filter Options
export interface FilterOptions {
  categories: string[];
  priceRange: { min: number; max: number };
  ratings: number[];
  availability: boolean;
}

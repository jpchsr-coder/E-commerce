// API Constants
export const API_BASE_URL = 'https://dummyjson.com';
export const API_TIMEOUT = 30000;

// Pagination
export const DEFAULT_PAGE_LIMIT = 12;
export const DEFAULT_PAGE = 1;

// Product Related
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home',
  'Beauty',
  'Sports',
  'Books',
  'Furniture',
  'Toys',
];

export const SORT_OPTIONS = [
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Most Popular', value: 'popularity' },
];

export const PRICE_RANGES = [
  { label: 'Under ₹500', value: [0, 500] },
  { label: '₹500 - ₹1000', value: [500, 1000] },
  { label: '₹1000 - ₹5000', value: [1000, 5000] },
  { label: '₹5000 - ₹10000', value: [5000, 10000] },
  { label: 'Above ₹10000', value: [10000, 999999] },
];

export const RATING_FILTERS = [
  { label: '4 Stars & up', value: 4 },
  { label: '3 Stars & up', value: 3 },
  { label: '2 Stars & up', value: 2 },
  { label: '1 Star & up', value: 1 },
];

// Cart & Checkout
export const TAX_RATE = 0.18; // 18% GST
export const SHIPPING_COST = 50;
export const FREE_SHIPPING_ABOVE = 500;

export const PAYMENT_METHODS = [
  { id: 'credit-card', label: 'Credit Card', icon: 'card' },
  { id: 'debit-card', label: 'Debit Card', icon: 'card' },
  { id: 'net-banking', label: 'Net Banking', icon: 'bank' },
  { id: 'upi', label: 'UPI', icon: 'mobile' },
  { id: 'wallet', label: 'Digital Wallet', icon: 'wallet' },
  { id: 'cod', label: 'Cash on Delivery', icon: 'truck' },
];

// Countries & States
export const COUNTRIES = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
];

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
  pending: 'Order Pending',
  confirmed: 'Order Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

// Theme
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Animations
export const ANIMATION_DURATION = {
  SHORT: 0.2,
  MEDIUM: 0.3,
  LONG: 0.5,
};

// Toast Messages
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful! Welcome back.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  SIGNUP_SUCCESS: 'Account created successfully! Please log in.',
  ADDED_TO_CART: 'Product added to cart.',
  REMOVED_FROM_CART: 'Product removed from cart.',
  ADDED_TO_WISHLIST: 'Added to wishlist.',
  REMOVED_FROM_WISHLIST: 'Removed from wishlist.',
  CHECKOUT_SUCCESS: 'Order placed successfully!',
  UPDATE_SUCCESS: 'Updated successfully.',
  DELETE_SUCCESS: 'Deleted successfully.',
  ERROR: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  COUPON_APPLIED: 'Coupon applied successfully.',
  COUPON_INVALID: 'Invalid coupon code.',
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Invalid email address.',
  INVALID_PASSWORD: 'Password must be at least 8 characters.',
  PASSWORDS_MISMATCH: 'Passwords do not match.',
  USERNAME_TAKEN: 'Username already taken.',
  EMAIL_TAKEN: 'Email already registered.',
  LOGIN_FAILED: 'Invalid credentials.',
  NETWORK_ERROR: 'Network error. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'Resource not found.',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'ecommerce_user',
  TOKEN: 'ecommerce_token',
  CART: 'ecommerce_cart',
  WISHLIST: 'ecommerce_wishlist',
  ORDERS: 'ecommerce_orders',
  ADDRESSES: 'ecommerce_addresses',
  THEME: 'ecommerce_theme',
};

// Image Placeholders
export const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x300?text=Product+Image';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PRODUCTS: '/products',
  PRODUCT_DETAILS: '/products/:id',
  CART: '/cart',
  WISHLIST: '/wishlist',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order-success',
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  ORDERS: '/dashboard/orders',
  ADDRESSES: '/dashboard/addresses',
  WISHLIST_PAGE: '/dashboard/wishlist',
  NOT_FOUND: '/404',
};

// Breakpoints for Responsive Design
export const BREAKPOINTS = {
  XS: 320,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
};

// Demo Credentials
export const DEMO_CREDENTIALS = {
  username: 'emilys',
  password: 'emilyspass',
};

// Coupon Codes
export const DEMO_COUPONS = [
  { code: 'WELCOME20', discount: 20, discountType: 'percentage' },
  { code: 'SAVE100', discount: 100, discountType: 'fixed' },
  { code: 'NEWYEAR', discount: 15, discountType: 'percentage' },
];

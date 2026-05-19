import type { Cart, Wishlist, Order, Address, User } from '../types/index';

const STORAGE_KEYS = {
  USER: 'ecommerce_user',
  TOKEN: 'ecommerce_token',
  CART: 'ecommerce_cart',
  WISHLIST: 'ecommerce_wishlist',
  ORDERS: 'ecommerce_orders',
  ADDRESSES: 'ecommerce_addresses',
  THEME: 'ecommerce_theme',
  CURRENCY: 'ecommerce_currency',
};

// User
export const userStorage = {
  set: (user: User) => localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
  get: (): User | null => {
    const item = localStorage.getItem(STORAGE_KEYS.USER);
    return item ? JSON.parse(item) : null;
  },
  clear: () => localStorage.removeItem(STORAGE_KEYS.USER),
};

// Token
export const tokenStorage = {
  set: (token: string) => localStorage.setItem(STORAGE_KEYS.TOKEN, token),
  get: (): string | null => localStorage.getItem(STORAGE_KEYS.TOKEN),
  clear: () => localStorage.removeItem(STORAGE_KEYS.TOKEN),
};

// Cart
export const cartStorage = {
  set: (cart: Cart) => localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)),
  get: (): Cart | null => {
    const item = localStorage.getItem(STORAGE_KEYS.CART);
    return item ? JSON.parse(item) : null;
  },
  clear: () => localStorage.removeItem(STORAGE_KEYS.CART),
};

// Wishlist
export const wishlistStorage = {
  set: (wishlist: Wishlist) => localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist)),
  get: (): Wishlist | null => {
    const item = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return item ? JSON.parse(item) : null;
  },
  clear: () => localStorage.removeItem(STORAGE_KEYS.WISHLIST),
};

// Orders
export const ordersStorage = {
  set: (orders: Order[]) => localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders)),
  get: (): Order[] => {
    const item = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return item ? JSON.parse(item) : [];
  },
  addOrder: (order: Order) => {
    const orders = ordersStorage.get();
    orders.push(order);
    ordersStorage.set(orders);
  },
  clear: () => localStorage.removeItem(STORAGE_KEYS.ORDERS),
};

// Addresses
export const addressesStorage = {
  set: (addresses: Address[]) => localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(addresses)),
  get: (): Address[] => {
    const item = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
    return item ? JSON.parse(item) : [];
  },
  addAddress: (address: Address) => {
    const addresses = addressesStorage.get();
    addresses.push(address);
    addressesStorage.set(addresses);
  },
  clear: () => localStorage.removeItem(STORAGE_KEYS.ADDRESSES),
};

// Theme
export const themeStorage = {
  set: (theme: 'light' | 'dark') => localStorage.setItem(STORAGE_KEYS.THEME, theme),
  get: (): 'light' | 'dark' => {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return (theme as 'light' | 'dark') || 'light';
  },
};

// Currency
export const currencyStorage = {
  set: (currency: string) => localStorage.setItem(STORAGE_KEYS.CURRENCY, currency),
  get: (): string => localStorage.getItem(STORAGE_KEYS.CURRENCY) || 'USD',
};

// Clear all
export const clearAllStorage = () => {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
};

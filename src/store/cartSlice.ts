import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Cart, CartItem } from '../types/index';
import { cartStorage } from '../utils/localStorage';
import { TAX_RATE, SHIPPING_COST, FREE_SHIPPING_ABOVE } from '../utils/constants';

const initialState: Cart = cartStorage.get() || {
  items: [],
  subtotal: 0,
  tax: 0,
  discount: 0,
  total: 0,
};

const calculateTotals = (items: CartItem[], discount: number = 0) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_COST;
  const tax = (subtotal + shippingCost - discount) * TAX_RATE;
  const total = subtotal + tax + shippingCost - discount;

  return {
    subtotal,
    tax,
    discount,
    total,
  };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'id'>>) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.productId === item.productId);

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.items.push({
          ...item,
          id: `${item.productId}-${Date.now()}`,
        });
      }

      const totals = calculateTotals(state.items, state.discount);
      Object.assign(state, totals);
      cartStorage.set(state);
    },

    // Remove item from cart
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);

      const totals = calculateTotals(state.items, state.discount);
      Object.assign(state, totals);
      cartStorage.set(state);
    },

    // Update item quantity
    updateCartQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.productId === action.payload.productId);

      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.productId !== action.payload.productId);
        } else {
          item.quantity = action.payload.quantity;
        }
      }

      const totals = calculateTotals(state.items, state.discount);
      Object.assign(state, totals);
      cartStorage.set(state);
    },

    // Apply coupon/discount
    applyDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;

      const totals = calculateTotals(state.items, action.payload);
      Object.assign(state, totals);
      cartStorage.set(state);
    },

    // Clear cart
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.tax = 0;
      state.discount = 0;
      state.total = 0;
      cartStorage.clear();
    },

    // Set cart from storage
    setCart: (state, action: PayloadAction<Cart>) => {
      const totals = calculateTotals(action.payload.items, action.payload.discount);
      Object.assign(state, { ...action.payload, ...totals });
    },

    // Bulk update cart
    updateCart: (state, action: PayloadAction<Partial<Cart>>) => {
      Object.assign(state, action.payload);
      cartStorage.set(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  applyDiscount,
  clearCart,
  setCart,
  updateCart,
} = cartSlice.actions;

export default cartSlice.reducer;

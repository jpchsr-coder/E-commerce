import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Wishlist, WishlistItem } from '../types/index';
import { wishlistStorage } from '../utils/localStorage';

const initialState: Wishlist = wishlistStorage.get() || {
  items: [],
  count: 0,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Add to wishlist
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const item = action.payload;
      const exists = state.items.some((i) => i.id === item.id);

      if (!exists) {
        state.items.push(item);
        state.count = state.items.length;
        wishlistStorage.set(state);
      }
    },

    // Remove from wishlist
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.count = state.items.length;
      wishlistStorage.set(state);
    },

    // Clear wishlist
    clearWishlist: (state) => {
      state.items = [];
      state.count = 0;
      wishlistStorage.clear();
    },

    // Set wishlist
    setWishlist: (state, action: PayloadAction<Wishlist>) => {
      state.items = action.payload.items;
      state.count = action.payload.count;
    },

    // Move to cart (remove from wishlist but keep it)
    moveToCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.count = state.items.length;
      wishlistStorage.set(state);
    },

    // Toggle wishlist item
    toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const item = action.payload;
      const exists = state.items.some((i) => i.id === item.id);

      if (exists) {
        state.items = state.items.filter((i) => i.id !== item.id);
      } else {
        state.items.push(item);
      }

      state.count = state.items.length;
      wishlistStorage.set(state);
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlist,
  moveToCart,
  toggleWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

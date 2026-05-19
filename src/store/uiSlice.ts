import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Toast } from '../types/index';
import { themeStorage } from '../utils/localStorage';

interface UIState {
  theme: 'light' | 'dark';
  toasts: Toast[];
  isLoading: boolean;
  sidebarOpen: boolean;
}

const initialState: UIState = {
  theme: themeStorage.get(),
  toasts: [],
  isLoading: false,
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Toggle theme
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      themeStorage.set(state.theme);
    },

    // Set theme
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      themeStorage.set(state.theme);
    },

    // Add toast
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      state.toasts.push({
        ...action.payload,
        id,
      });
    },

    // Remove toast
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },

    // Clear all toasts
    clearToasts: (state) => {
      state.toasts = [];
    },

    // Set loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Toggle sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    // Set sidebar
    setSidebar: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  addToast,
  removeToast,
  clearToasts,
  setLoading,
  toggleSidebar,
  setSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;

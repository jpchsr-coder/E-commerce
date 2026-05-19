import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product, ProductFilters, ProductsResponse } from '../types/index';
import { productService } from '../services/productService';

const toRupees = (price: number) => Math.floor(price * 80);

interface ProductsState {
  items: Product[];
  filteredItems: Product[];
  total: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  pageLimit: number;
  filters: ProductFilters;
  categories: string[];
  selectedProduct: Product | null;
  isLoadingProduct: boolean;
}

const initialState: ProductsState = {
  items: [],
  filteredItems: [],
  total: 0,
  isLoading: false,
  error: null,
  currentPage: 1,
  pageLimit: 12,
  filters: {},
  categories: [],
  selectedProduct: null,
  isLoadingProduct: false,
};

// Async thunks
export const fetchProducts = createAsyncThunk<
  ProductsResponse,
  { skip: number; limit: number },
  { rejectValue: string }
>('products/fetchProducts', async ({ skip, limit }, { rejectWithValue }) => {
  try {
    return await productService.getProducts(skip, limit);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch products');
  }
});

export const fetchProductById = createAsyncThunk<
  Product,
  number,
  { rejectValue: string }
>('products/fetchProductById', async (id, { rejectWithValue }) => {
  try {
    return await productService.getProductById(id);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch product');
  }
});

export const fetchCategories = createAsyncThunk<
  string[],
  void,
  { rejectValue: string }
>('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    return await productService.getCategories();
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch categories');
  }
});

export const searchProducts = createAsyncThunk<
  ProductsResponse,
  { query: string; skip: number; limit: number },
  { rejectValue: string }
>('products/searchProducts', async ({ query, skip, limit }, { rejectWithValue }) => {
  try {
    return await productService.searchProducts(query, skip, limit);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to search products');
  }
});

export const fetchProductsByCategory = createAsyncThunk<
  ProductsResponse,
  { category: string; skip: number; limit: number },
  { rejectValue: string }
>(
  'products/fetchProductsByCategory',
  async ({ category, skip, limit }, { rejectWithValue }) => {
    try {
      return await productService.getProductsByCategory(category, skip, limit);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Set filters
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
      state.currentPage = 1;
    },

    // Update single filter
    updateFilter: (
      state,
      action: PayloadAction<{ key: keyof ProductFilters; value: any }>
    ) => {
      state.filters[action.payload.key] = action.payload.value;
      state.currentPage = 1;
    },

    // Set current page
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
    },

    // Apply filters locally
    applyFilters: (state) => {
      let filtered = [...state.items];

      // Price filtering
      if (state.filters.priceRange) {
        const [min, max] = state.filters.priceRange;
        filtered = filtered.filter((p) => {
          const rupeePrice = toRupees(p.price);
          return rupeePrice >= min && rupeePrice <= max;
        });
      }

      // Rating filtering
      if (state.filters.rating) {
        filtered = filtered.filter((p) => p.rating >= state.filters.rating!);
      }

      // Search filtering
      if (state.filters.searchQuery) {
        const query = state.filters.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
      }

      // Sorting
      if (state.filters.sortBy) {
        switch (state.filters.sortBy) {
          case 'price-asc':
            filtered.sort((a, b) => toRupees(a.price) - toRupees(b.price));
            break;
          case 'price-desc':
            filtered.sort((a, b) => toRupees(b.price) - toRupees(a.price));
            break;
          case 'newest':
            filtered.sort(
              (a, b) =>
                new Date(b.createdAt || '').getTime() -
                new Date(a.createdAt || '').getTime()
            );
            break;
          case 'popularity':
            filtered.sort((a, b) => {
              const aReviews = Array.isArray(a.reviews) ? a.reviews.length : a.reviews;
              const bReviews = Array.isArray(b.reviews) ? b.reviews.length : b.reviews;
              return bReviews - aReviews;
            });
            break;
        }
      }

      state.filteredItems = filtered;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.products;
        state.filteredItems = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch products';
      })

      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoadingProduct = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoadingProduct = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoadingProduct = false;
        state.error = action.payload || 'Failed to fetch product';
      })

      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })

      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.products;
        state.filteredItems = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Search failed';
      })

      // Fetch By Category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.products;
        state.filteredItems = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch products';
      });
  },
});

export const { setFilters, updateFilter, setCurrentPage, clearFilters, applyFilters } =
  productsSlice.actions;

export default productsSlice.reducer;

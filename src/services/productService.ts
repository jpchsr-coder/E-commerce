import { apiClient } from './api';
import type { Product, ProductsResponse, ProductFilters } from '../types/index';

export const productService = {
  // Get all products with pagination
  getProducts: (skip: number = 0, limit: number = 12) =>
    apiClient.get<ProductsResponse>(`/products?skip=${skip}&limit=${limit}`),

  // Get single product
  getProductById: (id: number) =>
    apiClient.get<Product>(`/products/${id}`),

  // Get products by category
  getProductsByCategory: (category: string, skip: number = 0, limit: number = 12) =>
    apiClient.get<ProductsResponse>(`/products/category/${category}?skip=${skip}&limit=${limit}`),

  // Get all categories
  getCategories: async () => {
    const categories = await apiClient.get<Array<string | Record<string, any>>>('/products/categories');
    return categories.map((category) => {
      if (typeof category === 'string') return category;
      return category.name || category.slug || category.label || JSON.stringify(category);
    });
  },

  // Search products
  searchProducts: (query: string, skip: number = 0, limit: number = 12) =>
    apiClient.get<ProductsResponse>(`/products/search?q=${query}&skip=${skip}&limit=${limit}`),

  // Get products with filters
  getFilteredProducts: (filters: ProductFilters) => {
    const { searchQuery, category, page = 1 } = filters;
    const skip = (page - 1) * 12;
    const limit = 12;

    if (searchQuery) {
      return productService.searchProducts(searchQuery, skip, limit);
    }

    if (category) {
      return productService.getProductsByCategory(category.toLowerCase(), skip, limit);
    }

    return productService.getProducts(skip, limit);
  },

  // Mock rating system - in production would come from API
  getProductRating: () => {
    // Simulate fetching rating
    const rating = Math.floor(Math.random() * 2) + 3.5;
    return Promise.resolve(rating);
  },

  // Mock review fetching
  getProductReviews: (productId: number) => {
    return Promise.resolve([
      {
        id: 1,
        productId,
        userId: 1,
        rating: 5,
        comment: 'Great product! Highly recommended.',
        author: 'John Doe',
        verified: true,
        createdAt: new Date().toISOString(),
      },
    ]);
  },
};

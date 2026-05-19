import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/index';
import {
  fetchProducts,
  fetchProductById,
  fetchCategories,
  searchProducts,
  setFilters,
  applyFilters,
  setCurrentPage,
  fetchProductsByCategory,
} from '../store/productsSlice';
import type { ProductFilters } from '../types/index';

export const useProducts = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const dispatch = useAppDispatch();
  const {
    filteredItems,
    total,
    isLoading,
    error,
    currentPage,
    pageLimit,
    filters,
    categories,
    selectedProduct,
    isLoadingProduct,
  } = useAppSelector((state) => state.products);

  // Fetch categories
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    const skip = (currentPage - 1) * pageLimit;

    if (activeSearchQuery.trim()) {
      dispatch(searchProducts({ query: activeSearchQuery, skip, limit: pageLimit }));
      return;
    }

    if (activeCategory) {
      dispatch(fetchProductsByCategory({ category: activeCategory, skip, limit: pageLimit }));
      return;
    }

    dispatch(fetchProducts({ skip, limit: pageLimit }));
  }, [dispatch, currentPage, pageLimit, activeCategory, activeSearchQuery]);

  const handleSearch = useCallback(
    (query: string) => {
      setActiveSearchQuery(query);
      setActiveCategory('');
      dispatch(setCurrentPage(1));
    },
    [dispatch]
  );

  const handleFilter = useCallback(
    (newFilters: ProductFilters) => {
      dispatch(setFilters(newFilters));
      dispatch(applyFilters());
    },
    [dispatch]
  );

  const handleCategoryFilter = useCallback(
    (category: string) => {
      setActiveCategory(category);
      setActiveSearchQuery('');
      dispatch(setCurrentPage(1));
    },
    [dispatch]
  );

  const handleClearCategory = useCallback(() => {
    setActiveCategory('');
    dispatch(setCurrentPage(1));
  }, [dispatch]);

  const handlePaginationChange = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page));
    },
    [dispatch]
  );

  const fetchSingleProduct = useCallback(
    (id: number) => {
      dispatch(fetchProductById(id));
    },
    [dispatch]
  );

  const totalPages = useMemo(() => {
    return Math.ceil(total / pageLimit);
  }, [total, pageLimit]);

  const paginatedItems = useMemo(() => filteredItems, [filteredItems]);

  return {
    items: filteredItems,
    paginatedItems,
    total,
    totalPages,
    currentPage,
    isLoading,
    error,
    filters,
    categories,
    selectedProduct,
    isLoadingProduct,
    handleSearch,
    handleFilter,
    handleCategoryFilter,
    handlePaginationChange,
    fetchSingleProduct,
    handleClearCategory,
  };
};

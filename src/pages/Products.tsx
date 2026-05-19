import React, { useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import { motion } from 'framer-motion';
import { SORT_OPTIONS, PRICE_RANGES, RATING_FILTERS } from '../utils/constants';
import clsx from 'clsx';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    paginatedItems,
    isLoading,
    categories,
    totalPages,
    currentPage,
    handleSearch,
    handleFilter,
    handleCategoryFilter,
    handleClearCategory,
    handlePaginationChange,
  } = useProducts();

  // Filter states
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest' | 'popularity' | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  // Handle search with debounce
  const debounceSearch = useCallback(
    (() => {
      let timeout: ReturnType<typeof setTimeout>;
      return (query: string) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          handleSearch(query);
          if (query.trim()) {
            setSearchParams({ search: query });
          } else {
            setSearchParams({});
          }
        }, 500);
      };
    })(),
    [handleSearch, setSearchParams]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debounceSearch(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = e.currentTarget.value.trim();
      debounceSearch(query);
    }
  };

  const getCategoryLabel = (category: string | Record<string, any>) => {
    if (typeof category === 'string') return category;
    return category.name || category.slug || category.label || JSON.stringify(category);
  };

  const getCategoryKey = (category: string | Record<string, any>, index: number) => {
    if (typeof category === 'string') return category;
    return category.slug || category.name || category.label || `category-${index}`;
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    handleCategoryFilter(category);
    setSearchParams({ category });
  };

  const handleFilterApply = () => {
    handleFilter({
      searchQuery: searchInput,
      category: selectedCategory,
      priceRange,
      rating: minRating,
      sortBy: sortBy as any,
    });
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSelectedCategory('');
    setPriceRange([0, 100000]);
    setMinRating(0);
    setSortBy('');
    setSearchParams({});
    handleFilter({
      searchQuery: '',
      category: '',
      priceRange: [0, 100000],
      rating: 0,
      sortBy: undefined,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Shop Products</h1>

        {/* Search + Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchInput}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              fullWidth
              startIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />
          </div>

          <div className="sm:ml-4 w-full sm:w-auto">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              isFullWidth
              className="flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-20 space-y-6">
            {/* Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    handleClearCategory();
                    setSearchParams(searchInput.trim() ? { search: searchInput } : {});
                  }}
                  className={clsx(
                    'w-full text-left px-3 py-2 rounded-lg transition-colors',
                    !selectedCategory
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  All Categories
                </button>
                {categories.map((category, index) => {
                  const label = getCategoryLabel(category as any);
                  const categoryAny = category as any;
                  const value = typeof category === 'string' ? category : categoryAny.slug || categoryAny.name || label;
                  const key = getCategoryKey(category as any, index);

                  return (
                    <button
                      key={key}
                      onClick={() => handleCategoryClick(value)}
                      className={clsx(
                        'w-full text-left px-3 py-2 rounded-lg transition-colors capitalize',
                        selectedCategory === value
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Price</h3>
              <div className="space-y-4">
                {PRICE_RANGES.map((range) => (
                  <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        priceRange[0] === range.value[0] && priceRange[1] === range.value[1]
                      }
                      onChange={() => setPriceRange(range.value as [number, number])}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Rating</h3>
              <div className="space-y-2">
                {RATING_FILTERS.map((filter) => (
                  <label key={filter.label} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={minRating === filter.value}
                      onChange={() => setMinRating(minRating === filter.value ? 0 : filter.value)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {filter.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price-asc' | 'price-desc' | 'newest' | 'popularity' | '')}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="">Default</option>
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Apply Filters */}
            <div className="space-y-2">
              <Button onClick={handleFilterApply} isFullWidth variant="primary">
                Apply Filters
              </Button>
              <Button onClick={clearFilters} isFullWidth variant="outline">
                Clear Filters
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
            {showFilters && (
            <div className="lg:hidden mb-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-6 shadow-sm">
              <div>
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      handleClearCategory();
                      setSearchParams(searchInput.trim() ? { search: searchInput } : {});
                    }}
                    className={clsx(
                      'w-full text-left px-3 py-2 rounded-lg transition-colors',
                      !selectedCategory
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    All Categories
                  </button>
                  {categories.map((category, index) => {
                    const label = getCategoryLabel(category as any);
                    const categoryAny = category as any;
                    const value = typeof category === 'string' ? category : categoryAny.slug || categoryAny.name || label;
                    const key = getCategoryKey(category as any, index);

                    return (
                      <button
                        key={key}
                        onClick={() => {
                          handleCategoryClick(value);
                          setShowFilters(false);
                        }}
                        className={clsx(
                          'w-full text-left px-3 py-2 rounded-lg transition-colors capitalize',
                          selectedCategory === value
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Price</h3>
                <div className="space-y-4">
                  {PRICE_RANGES.map((range) => (
                    <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          priceRange[0] === range.value[0] && priceRange[1] === range.value[1]
                        }
                        onChange={() => setPriceRange(range.value as [number, number])}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Rating</h3>
                <div className="space-y-2">
                  {RATING_FILTERS.map((filter) => (
                    <label key={filter.label} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={minRating === filter.value}
                        onChange={() => setMinRating(minRating === filter.value ? 0 : filter.value)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {filter.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'price-asc' | 'price-desc' | 'newest' | 'popularity' | '')}
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Default</option>
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => {
                    handleFilterApply();
                    setShowFilters(false);
                  }}
                  isFullWidth
                  variant="primary"
                >
                  Apply Filters
                </Button>
                <Button
                  onClick={() => {
                    clearFilters();
                    setShowFilters(false);
                  }}
                  isFullWidth
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : paginatedItems.length > 0 ? (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8"
              >
                {paginatedItems.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <Link
                      to={`/products/${product.id}`}
                      className="group block bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full"
                    >
                      <div className="relative overflow-hidden h-40 sm:h-52 bg-gray-200 dark:bg-gray-700">
                        <img
                          src={product.image || product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/300x300'}
                          alt={product.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          -20%
                        </div>
                      </div>
                      <div className="flex flex-col h-full p-3 sm:p-4">
                        <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                          {product.category}
                        </p>
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-2 mb-2">
                          {product.title}
                        </h3>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                              ₹{Math.floor(product.price * 80)}
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                              ₹{Math.floor(product.price * 100)}
                            </p>
                          </div>
                          <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 ml-1">
                              {product.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-auto">
                          <Button variant="primary" isFullWidth size="sm">
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="w-full overflow-x-auto">
                  <div className="inline-flex flex-wrap justify-center gap-2 mt-8 pb-8">
                    <button
                      onClick={() => handlePaginationChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="min-w-[90px] px-3 py-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePaginationChange(i + 1)}
                        className={clsx(
                          'min-w-[40px] px-3 py-2 rounded-lg text-sm transition-colors',
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'border-2 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        )}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePaginationChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="min-w-[70px] px-3 py-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;

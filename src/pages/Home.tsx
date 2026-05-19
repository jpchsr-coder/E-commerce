import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/index';
import { fetchProducts, fetchCategories } from '../store/productsSlice';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { ProductCardSkeleton } from '../components/ui/Skeleton';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filteredItems, isLoading, categories } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ skip: 0, limit: 12 }));
    dispatch(fetchCategories());
  }, [dispatch]);

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
      transition: { duration: 0.5 },
    },
  };

  const getCategoryLabel = (category: string | Record<string, any>) => {
    if (typeof category === 'string') return category;
    return category.name || category.slug || category.label || JSON.stringify(category);
  };

  const getCategoryKey = (category: string | Record<string, any>, index: number) => {
    if (typeof category === 'string') return category;
    return category.slug || category.name || category.label || `category-${index}`;
  };

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-gray-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to EShop</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl">
              Discover amazing products with the best prices. Shop from thousands of brands and
              enjoy fast delivery.
            </p>
            <Link to="/products">
              <Button variant="secondary" size="lg" className="text-blue-700 font-bold">
                Shop Now →
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Featured Categories</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
          >
            {categories.length === 0 ? (
              [...Array(4)].map((_, index) => (
                <motion.div key={`placeholder-${index}`} variants={itemVariants}>
                  <div className="animate-pulse block p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </motion.div>
              ))
            ) : (
              categories.slice(0, 8).map((category, index) => {
                const label = getCategoryLabel(category as any);
                const key = getCategoryKey(category as any, index);
                const categoryAny = category as any;
                const value = typeof category === 'string' ? category : categoryAny.slug || categoryAny.name || label;

                return (
                  <motion.div key={key} variants={itemVariants}>
                    <Link
                      to={`/products?category=${encodeURIComponent(value)}`}
                      className="block p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="w-16 h-16 bg-blue-600 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-2xl">📦</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                        {label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Shop now</p>
                    </Link>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-blue-600 hover:text-blue-700 font-semibold">
              View All →
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredItems.slice(0, 8).map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className="group"
                >
                  <Link
                    to={`/products/${product.id}`}
                    className="block bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative overflow-hidden h-48 bg-gray-200 dark:bg-gray-700">
                      <img
                        src={product.image || product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/300x300'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Sale
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {product.category}
                      </p>
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            ₹{Math.floor(product.price * 80)}
                          </p>
                          <p className="text-sm text-gray-500 line-through">
                            ₹{Math.floor(product.price * 100)}
                          </p>
                        </div>
                        <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                            {product.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Promo Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-900 dark:to-pink-900 rounded-xl p-12 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Summer Sale</h2>
          <p className="text-lg mb-8">Get up to 50% off on selected items. Use code: SUMMER50</p>
          <Link to="/products">
            <Button variant="secondary" size="lg" className="text-purple-700 font-bold">
              Shop Sale →
            </Button>
          </Link>
        </motion.section>
      </div>
    </div>
  );
};

export default HomePage;

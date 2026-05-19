import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import Button from '../components/ui/Button';
import { formatDate } from '../utils/formatters';

const WishlistPage: React.FC = () => {
  const { items, removeItem, clear } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (item: typeof items[number]) => {
    addItem({
      productId: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1,
    });
    removeItem(item.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 font-semibold">
            Wishlist
          </p>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-3">Saved items</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
            Keep track of the products you love and move them to your cart when you’re ready.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={clear}>
              Clear Wishlist
            </Button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-12 text-center">
          <p className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your wishlist is empty</p>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Add items from the store to save them for later.
          </p>
          <Link to="/products">
            <Button variant="primary">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-6"
            >
              <div className="grid gap-6 md:grid-cols-[120px_1fr]">
                <div className="h-32 w-full overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800">
                  <img
                    src={item.image || 'https://via.placeholder.com/240x240'}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <Link to={`/products/${item.id}`} className="block">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {item.title}
                      </h2>
                    </Link>
                    <div className="mt-2 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span>₹{item.price.toFixed(2)}</span>
                      <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        ★ {item.rating.toFixed(1)}
                      </span>
                      <span>{item.reviews} reviews</span>
                    </div>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      Added on {formatDate(item.addedAt)}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button variant="primary" onClick={() => handleMoveToCart(item)}>
                      Move to Cart
                    </Button>
                    <Button variant="outline" onClick={() => removeItem(item.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;

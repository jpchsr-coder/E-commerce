import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useUI } from '../hooks/useUI';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { formatPriceSimple } from '../utils/formatters';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, tax, discount, total, removeItem, updateQuantity } = useCart();
  const { showToast } = useUI();

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      showToast({
        type: 'info',
        message: 'Product removed from cart',
      });
    } else {
      updateQuantity(productId, quantity);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      showToast({
        type: 'warning',
        message: 'Your cart is empty',
      });
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <svg
            className="w-24 h-24 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Add items to your cart to proceed
          </p>
          <Link to="/products">
            <Button variant="primary" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-4 bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPriceSimple(item.price)}
                  </p>
                </div>

                {/* Quantity & Actions */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center border-2 border-gray-300 dark:border-gray-700 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      −
                    </button>
                    <span className="px-4 py-1 font-semibold text-gray-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {formatPriceSimple(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-600 hover:text-red-700 text-sm font-semibold transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 sticky top-20 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPriceSimple(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span>{formatPriceSimple(tax)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPriceSimple(discount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span>{formatPriceSimple(total)}</span>
              </div>

              <Button
                onClick={handleCheckout}
                isFullWidth
                variant="primary"
                size="lg"
                className="py-3 font-semibold"
              >
                Proceed to Checkout
              </Button>

              <Link to="/products" className="block">
                <Button isFullWidth variant="outline" size="lg">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

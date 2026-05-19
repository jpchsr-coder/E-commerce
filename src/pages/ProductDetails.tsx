import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/index';
import { fetchProductById } from '../store/productsSlice';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useUI } from '../hooks/useUI';
import Button from '../components/ui/Button';
import { CheckoutSkeleton } from '../components/ui/Skeleton';
import { motion } from 'framer-motion';
import { formatPriceSimple } from '../utils/formatters';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedProduct: product, isLoadingProduct } = useAppSelector(
    (state) => state.products
  );
  const { addItem } = useCart();
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } =
    useWishlist();
  const { showToast } = useUI();

  const [quantity, setQuantity] = React.useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(parseInt(id)));
    }
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image || product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/300x300',
      quantity,
    });

    showToast({
      type: 'success',
      message: `${quantity} item(s) added to cart`,
    });

    setQuantity(1);
  };

  const handleWishlist = () => {
    if (!product) return;

    const reviewCount = Array.isArray(product.reviews) ? product.reviews.length : product.reviews;

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      showToast({
        type: 'info',
        message: 'Removed from wishlist',
      });
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image || product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/300x300',
        rating: product.rating,
        reviews: reviewCount,
        addedAt: new Date().toISOString(),
      });
      showToast({
        type: 'success',
        message: 'Added to wishlist',
      });
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CheckoutSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Product not found
        </h2>
        <Link to="/products">
          <Button variant="primary">Back to Products</Button>
        </Link>
      </div>
    );
  }

  const reviewCount = Array.isArray(product.reviews) ? product.reviews.length : product.reviews;
  const reviewList = Array.isArray(product.reviews) ? product.reviews : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
        <Link to="/" className="hover:text-gray-900 dark:hover:text-gray-300">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-gray-900 dark:hover:text-gray-300">
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">{product.title}</span>
      </nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Product Image */}
        <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden h-96">
          <img
            src={product.image || product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/500x500'}
            alt={product.title}
            className="w-full h-full object-contain p-4"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          {/* Categ & Rating */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {product.title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg">
                <span className="text-2xl">★</span>
                <div>
                  <p className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
                    {product.rating.toFixed(1)}
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-500">
                    {reviewCount} reviews
                  </p>
                </div>
              </div>
              {product.stock > 0 ? (
                <span className="text-green-600 font-semibold">In Stock</span>
              ) : (
                <span className="text-red-600 font-semibold">Out of Stock</span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="border-y border-gray-200 dark:border-gray-700 py-6">
            <div className="flex items-baseline gap-4 mb-2">
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {formatPriceSimple(Math.floor(product.price * 80))}
              </p>
              <p className="text-2xl text-gray-500 line-through">
                {formatPriceSimple(Math.floor(product.price * 100))}
              </p>
              <span className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1 rounded-full font-semibold">
                -20%
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Free shipping on orders above ₹500</p>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Quantity
            </label>
            <div className="flex items-center gap-3 w-fit border-2 border-gray-300 dark:border-gray-700 rounded-lg p-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 hover:text-gray-900 dark:hover:text-white"
              >
                −
              </button>
              <span className="px-4 py-1 font-bold text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 hover:text-gray-900 dark:hover:text-white"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleAddToCart}
              isFullWidth
              variant="primary"
              size="lg"
              disabled={product.stock === 0}
              className="py-3 font-semibold"
            >
              Add to Cart
            </Button>
            <Button
              onClick={handleWishlist}
              variant={isInWishlist(product.id) ? 'primary' : 'outline'}
              size="lg"
              className="px-6 py-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            </Button>
          </div>

          {/* Info Badges */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl mb-1">🚚</p>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">Free Delivery</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">On all orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl mb-1">↩️</p>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">Easy Returns</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">30-day policy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl mb-1">🛡️</p>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">Secure</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">100% safe</p>
            </div>
          </div>

          {reviewList.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Customer Reviews
              </h3>
              <div className="space-y-4">
                {reviewList.map((review, index) => (
                  <div
                    key={`${review.reviewerEmail ?? 'review'}-${index}`}
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {review.reviewerName ?? 'Anonymous'}
                      </p>
                      <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                        {review.rating} / 5
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
                    {review.date ? (
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Related Products */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Related Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Placeholder related products */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Related Product {i}</p>
              <p className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                Similar Product Title
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">₹{999 * i}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsPage;

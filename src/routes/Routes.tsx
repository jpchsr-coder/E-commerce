import React from 'react';
import { Routes as ReactRoutes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Pages
import HomePage from '../pages/Home';
import ProductsPage from '../pages/Products';
import ProductDetailsPage from '../pages/ProductDetails';
import CartPage from '../pages/Cart';
import CheckoutPage from '../pages/Checkout';
import OrderSuccessPage from '../pages/OrderSuccess';
import WishlistPage from '../pages/Wishlist';
import DashboardPage from '../pages/Dashboard';
import LoginPage from '../pages/Login';
import Layout from '../layouts/MainLayout';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Auth Route Component (redirect if already authenticated)
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const Routes: React.FC = () => {
  return (
    <ReactRoutes>
      {/* Layout Routes */}
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/products"
        element={
          <Layout>
            <ProductsPage />
          </Layout>
        }
      />
      <Route
        path="/products/:id"
        element={
          <Layout>
            <ProductDetailsPage />
          </Layout>
        }
      />
      <Route
        path="/cart"
        element={
          <Layout>
            <CartPage />
          </Layout>
        }
      />
      <Route
        path="/wishlist"
        element={
          <Layout>
            <WishlistPage />
          </Layout>
        }
      />
      <Route
        path="/checkout"
        element={
          <Layout hideFooter>
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/order-success/:orderId"
        element={
          <Layout>
            <OrderSuccessPage />
          </Layout>
        }
      />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <Layout hideFooter>
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          </Layout>
        }
      />

      {/* Catch all - 404 */}
      <Route
        path="*"
        element={
          <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                404 - Page Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                The page you're looking for doesn't exist.
              </p>
              <a
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Go Home
              </a>
            </div>
          </Layout>
        }
      />
    </ReactRoutes>
  );
};

export default Routes;

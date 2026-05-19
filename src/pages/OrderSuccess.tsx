import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { orderService } from '../services/orderService';
import Button from '../components/ui/Button';
import { formatPriceSimple } from '../utils/formatters';
import { motion } from 'framer-motion';
import type { Order } from '../types/index';

const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setError('Order ID is missing.');
        setIsLoading(false);
        return;
      }

      const foundOrder = await orderService.getOrderById(orderId);
      if (!foundOrder) {
        setError('Order not found.');
      } else {
        setOrder(foundOrder);
      }
      setIsLoading(false);
    };

    loadOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Order Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{error ?? 'We could not find your order. Please try again.'}</p>
        <Button variant="primary" onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-10 text-center">
        <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 text-4xl">
          ✓
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Order Confirmed</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Thank you for your purchase! Your order has been placed successfully.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-left">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Order ID</p>
            <p className="mt-2 font-semibold text-gray-900 dark:text-white">{order.id}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-left">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Status</p>
            <p className="mt-2 font-semibold text-gray-900 dark:text-white">{order.status}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-left">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Total Paid</p>
            <p className="mt-2 font-semibold text-gray-900 dark:text-white">{formatPriceSimple(order.total)}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-left">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Delivery</p>
            <p className="mt-2 font-semibold text-gray-900 dark:text-white">{new Date(order.estimatedDelivery || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="space-y-3 text-left mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Shipping Address</h2>
          <p className="text-gray-600 dark:text-gray-400">{order.shippingAddress.fullName}</p>
          <p className="text-gray-600 dark:text-gray-400">{order.shippingAddress.addressLine1}</p>
          {order.shippingAddress.addressLine2 && (
            <p className="text-gray-600 dark:text-gray-400">{order.shippingAddress.addressLine2}</p>
          )}
          <p className="text-gray-600 dark:text-gray-400">
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
          </p>
          <p className="text-gray-600 dark:text-gray-400">{order.shippingAddress.country}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="primary" onClick={() => navigate('/')}>Continue Shopping</Button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSuccessPage;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/orderService';
import { formatPriceSimple } from '../utils/formatters';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import type { Order } from '../types/index';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const allOrders = await orderService.getUserOrders();
        setOrders(allOrders.filter((order) => order.status === 'confirmed'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const confirmedOrdersCount = orders.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 font-semibold">
            My Profile
          </p>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-3">Welcome back{user ? `, ${user.firstName}` : ''}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
            View your profile details and confirmed orders in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant={activeTab === 'profile' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('orders')}
          >
            Orders ({confirmedOrdersCount})
          </Button>
        </div>
      </div>

      {activeTab === 'profile' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account Summary</h2>
            <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-semibold mt-1">{user?.firstName} {user?.lastName}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-semibold mt-1">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Role</p>
                <p className="font-semibold mt-1">{user?.role}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Confirmed Orders</p>
                <p className="font-semibold mt-1">{confirmedOrdersCount}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-gray-500 dark:text-gray-400">First Name</p>
                <p className="font-semibold text-gray-900 dark:text-white">{user?.firstName}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-500 dark:text-gray-400">Last Name</p>
                <p className="font-semibold text-gray-900 dark:text-white">{user?.lastName}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-semibold text-gray-900 dark:text-white">{user?.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-500 dark:text-gray-400">Username</p>
                <p className="font-semibold text-gray-900 dark:text-white">{user?.username}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Confirmed Orders</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Showing all orders with confirmed status.
                </p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {confirmedOrdersCount} confirmed order{confirmedOrdersCount === 1 ? '' : 's'}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 text-center text-gray-600 dark:text-gray-400">
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 text-center text-gray-600 dark:text-gray-400">
              No confirmed orders yet.
            </div>
          ) : (
            <div className="grid gap-6">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 p-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400 font-semibold">
                        Order ID
                      </p>
                      <p className="mt-2 font-semibold text-gray-900 dark:text-white">{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400 font-semibold">
                        Placed on
                      </p>
                      <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="rounded-full px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-200 font-semibold text-sm">
                      Confirmed
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3 mb-6 text-sm text-gray-600 dark:text-gray-300">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Items</p>
                      <p className="mt-2 font-semibold text-gray-900 dark:text-white">{order.items.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Total Paid</p>
                      <p className="mt-2 font-semibold text-gray-900 dark:text-white">{formatPriceSimple(order.total)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Delivery</p>
                      <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                        {new Date(order.estimatedDelivery || order.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Shipping Address</p>
                      <p className="mt-2 text-gray-900 dark:text-white font-semibold">
                        {order.shippingAddress.fullName}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {order.shippingAddress.addressLine1}
                        {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Products</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-950">
                            <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 justify-end">
                    <Link
                      to={`/order-success/${order.id}`}
                      className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-transparent px-4 py-2 text-sm font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
                    >
                      View Order
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

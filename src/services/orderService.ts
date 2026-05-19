import type { Order, Address } from '../types/index';
import { ordersStorage, addressesStorage } from '../utils/localStorage';

export const orderService = {
  // Create order - mock implementation
  createOrder: async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const order: Order = {
      ...orderData,
      id: 'ORD-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'confirmed',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      trackingNumber: 'TRK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    };

    ordersStorage.addOrder(order);
    return order;
  },

  // Get user orders
  getUserOrders: async (): Promise<Order[]> => {
    return ordersStorage.get();
  },

  // Get single order
  getOrderById: async (orderId: string): Promise<Order | null> => {
    const orders = ordersStorage.get();
    return orders.find((o: Order) => o.id === orderId) || null;
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    const orders = ordersStorage.get();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      ordersStorage.set(orders);
    }
    return order;
  },

  // Cancel order
  cancelOrder: async (orderId: string) => {
    return orderService.updateOrderStatus(orderId, 'cancelled');
  },

  // Get order tracking
  getOrderTracking: async (orderId: string) => {
    const order = await orderService.getOrderById(orderId);
    if (!order) return null;

    return {
      orderId: order.id,
      status: order.status,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      timeline: [
        { status: 'confirmed', timestamp: order.createdAt },
        { status: 'shipped', timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
        {
          status: 'delivered',
          timestamp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    };
  },
};

export const addressService = {
  // Get all addresses for user
  getAddresses: async (): Promise<Address[]> => {
    return addressesStorage.get();
  },

  // Add new address
  addAddress: async (address: Address) => {
    addressesStorage.addAddress(address);
    return address;
  },

  // Update address
  updateAddress: async (index: number, address: Address) => {
    const addresses = addressesStorage.get();
    if (addresses[index]) {
      addresses[index] = address;
      addressesStorage.set(addresses);
    }
    return address;
  },

  // Delete address
  deleteAddress: async (index: number) => {
    const addresses = addressesStorage.get();
    addresses.splice(index, 1);
    addressesStorage.set(addresses);
    return true;
  },

  // Set default address
  setDefaultAddress: async (index: number) => {
    const addresses = addressesStorage.get();
    addresses.forEach((addr: Address, i: number) => {
      addr.isDefault = i === index;
    });
    addressesStorage.set(addresses);
    return addresses[index];
  },

  // Get default address
  getDefaultAddress: async (): Promise<Address | null> => {
    const addresses = addressesStorage.get();
    return addresses.find((addr) => addr.isDefault) || addresses[0] || null;
  },
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import { orderService } from '../services/orderService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { PAYMENT_METHODS, INDIAN_STATES } from '../utils/constants';
import { motion } from 'framer-motion';
import { formatPriceSimple } from '../utils/formatters';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, tax, total, clear } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useUI();

  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [isLoading, setIsLoading] = useState(false);

  // Shipping form state
  const [shippingData, setShippingData] = useState({
    fullName: user?.firstName + ' ' + user?.lastName || '',
    email: user?.email || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  // Payment form state
  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    method: 'credit-card',
  });

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    if (!shippingData.fullName || !shippingData.email || !shippingData.phone) {
      showToast({
        type: 'error',
        message: 'Please fill in all required fields',
      });
      return;
    }
    setStep('payment');
  };

  const handleSubmitOrder = async () => {
    if (!isAuthenticated) {
      showToast({
        type: 'error',
        message: 'Please log in to place an order',
      });
      navigate('/login');
      return;
    }

    setIsLoading(true);

    try {
      const order = await orderService.createOrder({
        userId: user?.id || 0,
        items,
        shippingAddress: shippingData as any,
        billingAddress: shippingData as any,
        paymentMethod: paymentData.method,
        subtotal,
        tax,
        shippingCost: 50,
        discount: 0,
        total,
        status: 'pending',
      });

      showToast({
        type: 'success',
        message: 'Order placed successfully!',
      });

      clear();
      navigate(`/order-success/${order.id}`);
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to place order. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Your cart is empty
        </h2>
        <Button onClick={() => navigate('/cart')} variant="primary">
          Back to Cart
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step Indicator */}
          <div className="flex gap-4 mb-8">
            <div
              className={`flex-1 p-4 rounded-lg text-center font-semibold ${
                step === 'shipping'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              1. Shipping
            </div>
            <div
              className={`flex-1 p-4 rounded-lg text-center font-semibold ${
                step === 'payment'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              2. Payment
            </div>
          </div>

          {/* Shipping Step */}
          {step === 'shipping' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-8 space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Shipping Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="fullName"
                  value={shippingData.fullName}
                  onChange={handleShippingChange}
                  fullWidth
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={shippingData.email}
                  onChange={handleShippingChange}
                  fullWidth
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone"
                  name="phone"
                  value={shippingData.phone}
                  onChange={handleShippingChange}
                  fullWidth
                />
                <Input
                  label="Country"
                  name="country"
                  value={shippingData.country}
                  onChange={handleShippingChange}
                  disabled
                  fullWidth
                />
              </div>

              <Input
                label="Address Line 1"
                name="addressLine1"
                value={shippingData.addressLine1}
                onChange={handleShippingChange}
                fullWidth
              />

              <Input
                label="Address Line 2 (Optional)"
                name="addressLine2"
                value={shippingData.addressLine2}
                onChange={handleShippingChange}
                fullWidth
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Input
                  label="City"
                  name="city"
                  value={shippingData.city}
                  onChange={handleShippingChange}
                  fullWidth
                />
                <select
                  name="state"
                  value={shippingData.state}
                  onChange={handleShippingChange}
                  className="px-4 py-2.5 border-2 border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <Input
                  label="Zip Code"
                  name="zipCode"
                  value={shippingData.zipCode}
                  onChange={handleShippingChange}
                  fullWidth
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => navigate('/cart')}
                  variant="outline"
                  isFullWidth
                >
                  Back
                </Button>
                <Button
                  onClick={handleContinue}
                  variant="primary"
                  isFullWidth
                  className="py-3 font-semibold"
                >
                  Continue to Payment
                </Button>
              </div>
            </motion.div>
          )}

          {/* Payment Step */}
          {step === 'payment' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-8 space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className="relative flex items-center p-4 border-2 border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <input
                      type="radio"
                      name="method"
                      value={method.id}
                      checked={paymentData.method === method.id}
                      onChange={handlePaymentChange}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>

              {['credit-card', 'debit-card'].includes(paymentData.method) && (
                <>
                  <Input
                    label="Cardholder Name"
                    name="cardName"
                    value={paymentData.cardName}
                    onChange={handlePaymentChange}
                    fullWidth
                  />

                  <Input
                    label="Card Number"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={handlePaymentChange}
                    fullWidth
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={handlePaymentChange}
                      fullWidth
                    />
                    <Input
                      label="CVV"
                      name="cvv"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={handlePaymentChange}
                      fullWidth
                    />
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => setStep('shipping')}
                  variant="outline"
                  isFullWidth
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmitOrder}
                  isLoading={isLoading}
                  variant="primary"
                  isFullWidth
                  className="py-3 font-semibold"
                >
                  Place Order
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 sticky top-20 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 max-h-48 overflow-y-auto border-b border-gray-200 dark:border-gray-700 pb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 line-clamp-1">
                    {item.title} x {item.quantity}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatPriceSimple(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{formatPriceSimple(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>{formatPriceSimple(50)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax</span>
                <span>{formatPriceSimple(tax)}</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
              <span>Total</span>
              <span>{formatPriceSimple(total + 50)}</span>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                ✓ Secure Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

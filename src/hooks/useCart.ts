import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/index';
import {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  applyDiscount,
  clearCart,
} from '../store/cartSlice';
import type { CartItem } from '../types/index';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { items, subtotal, tax, discount, total } = useAppSelector((state) => state.cart);

  const addItem = useCallback(
    (item: Omit<CartItem, 'id'>) => {
      dispatch(addToCart(item));
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (productId: number) => {
      dispatch(removeFromCart(productId));
    },
    [dispatch]
  );

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      dispatch(updateCartQuantity({ productId, quantity }));
    },
    [dispatch]
  );

  const applyDisc = useCallback(
    (discountAmount: number) => {
      dispatch(applyDiscount(discountAmount));
    },
    [dispatch]
  );

  const clear = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    itemCount,
    subtotal,
    tax,
    discount,
    total,
    addItem,
    removeItem,
    updateQuantity,
    applyDiscount: applyDisc,
    clear,
  };
};

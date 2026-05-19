import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/index';
import {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} from '../store/wishlistSlice';
import type { WishlistItem } from '../types/index';

export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const { items, count } = useAppSelector((state) => state.wishlist);

  const addItem = useCallback(
    (item: WishlistItem) => {
      dispatch(addToWishlist(item));
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (productId: number) => {
      dispatch(removeFromWishlist(productId));
    },
    [dispatch]
  );

  const toggle = useCallback(
    (item: WishlistItem) => {
      dispatch(toggleWishlist(item));
    },
    [dispatch]
  );

  const clear = useCallback(() => {
    dispatch(clearWishlist(undefined));
  }, [dispatch]);

  const isInWishlist = useCallback(
    (productId: number) => {
      return items.some((item) => item.id === productId);
    },
    [items]
  );

  return {
    items,
    count,
    addItem,
    removeItem,
    toggle,
    clear,
    isInWishlist,
  };
};

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/index';
import {
  toggleTheme,
  setTheme,
  addToast,
  removeToast,
  clearToasts,
  setLoading,
  toggleSidebar,
} from '../store/uiSlice';
import type { Toast } from '../types/index';

export const useUI = () => {
  const dispatch = useAppDispatch();
  const { theme, toasts, isLoading, sidebarOpen } = useAppSelector((state) => state.ui);

  const handleToggleTheme = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  const handleSetTheme = useCallback(
    (newTheme: 'light' | 'dark') => {
      dispatch(setTheme(newTheme));
    },
    [dispatch]
  );

  const showToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      dispatch(addToast(toast));

      // Auto-remove toast after duration
      if (toast.duration) {
        setTimeout(() => {
          dispatch(removeToast(''));
        }, toast.duration);
      }
    },
    [dispatch]
  );

  const hideToast = useCallback(
    (id: string) => {
      dispatch(removeToast(id));
    },
    [dispatch]
  );

  const clearAllToasts = useCallback(() => {
    dispatch(clearToasts());
  }, [dispatch]);

  const setPageLoading = useCallback(
    (loading: boolean) => {
      dispatch(setLoading(loading));
    },
    [dispatch]
  );

  const handleToggleSidebar = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  return {
    theme,
    toasts,
    isLoading,
    sidebarOpen,
    toggleTheme: handleToggleTheme,
    setTheme: handleSetTheme,
    showToast,
    hideToast,
    clearToasts: clearAllToasts,
    setLoading: setPageLoading,
    toggleSidebar: handleToggleSidebar,
  };
};

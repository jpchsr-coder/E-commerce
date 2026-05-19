import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, message, duration = 5000, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const icons = {
    success: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4v2m.973-6H7.08c-1.071 0-2.157.427-2.992 1.188C3.269 7.859 3 8.814 3 9.809V19c0 1.922.778 3.754 2.162 5.091C6.546 25.359 8.564 26 10.604 26h2.792c2.04 0 4.058-.641 5.442-1.909C20.222 22.754 21 20.922 21 19V9.809c0-.995-.269-1.95-.996-2.621C19.077 6.504 17.99 6.078 16.92 6.078h-3.947z"
        />
      </svg>
    ),
  };

  const styles = {
    success: 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200',
    error: 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200',
    info: 'bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    warning: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={clsx(
        'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg',
        styles[type]
      )}
    >
      {icons[type]}
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="ml-auto text-lg font-semibold opacity-70 hover:opacity-100"
      >
        ×
      </button>
    </motion.div>
  );
};

export default Toast;

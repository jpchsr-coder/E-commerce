import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  variant?: 'standard' | 'filled' | 'outlined';
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helpText,
      variant = 'outlined',
      fullWidth = true,
      startIcon,
      endIcon,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'w-full px-4 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 dark:bg-gray-700 dark:text-white';

    const variants = {
      standard: 'border-b-2 border-gray-300 focus:border-blue-500 focus:ring-0',
      filled:
        'bg-gray-100 border-0 focus:bg-white focus:ring-blue-500 dark:bg-gray-600 dark:focus:bg-gray-700',
      outlined:
        'border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600',
    };

    return (
      <div className={fullWidth ? 'w-full' : 'inline-block'}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            {label}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {startIcon}
            </div>
          )}

          <input
            ref={ref}
            className={clsx(
              baseStyles,
              variants[variant],
              error && 'border-red-500 focus:ring-red-500',
              startIcon && 'pl-10',
              endIcon && 'pr-10',
              className
            )}
            {...props}
          />

          {endIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {endIcon}
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        {helpText && !error && <p className="text-gray-500 text-sm mt-1">{helpText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

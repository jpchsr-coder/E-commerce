import React from 'react';
import clsx from 'clsx';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  circle = false,
  className,
}) => {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      style={style}
      className={clsx(
        'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse',
        circle && 'rounded-full',
        !circle && 'rounded-lg',
        className
      )}
    />
  );
};

// Product Skeleton
export const ProductCardSkeleton: React.FC = () => (
  <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
    <Skeleton height={200} />
    <Skeleton height={20} width="80%" />
    <Skeleton height={16} width="60%" />
    <Skeleton height={16} width="40%" />
    <div className="flex gap-2 pt-2">
      <Skeleton height={40} className="flex-1" />
      <Skeleton height={40} width={40} />
    </div>
  </div>
);

// Checkout Skeleton
export const CheckoutSkeleton: React.FC = () => (
  <div className="space-y-4">
    <Skeleton height={60} />
    <Skeleton height={40} width="60%" />
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} height={40} />
      ))}
    </div>
  </div>
);

export default Skeleton;

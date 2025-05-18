import React from 'react';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

export default function Skeleton({
  className = '',
  ...props
}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-neutral-200 dark:bg-neutral-700 ${className}`}
      {...props}
    />
  );
}

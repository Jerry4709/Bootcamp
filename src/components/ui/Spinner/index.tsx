import React from 'react';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string;
}

export default function Spinner({
  size = 24,
  className = '',
  ...props
}: SpinnerProps) {
  return (
    <div
      className={`animate-spin border-2 border-current border-t-transparent rounded-full inline-block ${className}`}
      style={{ width: size, height: size }}
      {...props}
    />
  );
}

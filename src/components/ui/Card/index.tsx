import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white/80 dark:bg-neutral-800/80 p-4 rounded-xl shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

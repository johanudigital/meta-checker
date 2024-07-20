import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
}

export function Alert({ children, variant = 'default' }: AlertProps) {
  const baseClasses = 'p-4 rounded-md';
  const variantClasses = variant === 'destructive' ? 'bg-red-100 text-red-900' : 'bg-blue-100 text-blue-900';

  return <div className={`${baseClasses} ${variantClasses}`}>{children}</div>;
}

export function AlertTitle({ children }: { children: React.ReactNode }) {
  return <h5 className="font-medium mb-1">{children}</h5>;
}

export function AlertDescription({ children }: { children: React.ReactNode }) {
  return <div className="text-sm">{children}</div>;
}
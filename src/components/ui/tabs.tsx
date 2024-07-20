import React from 'react';

interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
}

export function Tabs({ children, defaultValue, className }: TabsProps) {
  return <div className={className}>{children}</div>;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return <div className={`flex space-x-2 mb-4 ${className}`}>{children}</div>;
}

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
}

export function TabsTrigger({ children, value }: TabsTriggerProps) {
  return (
    <button
      className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      data-value={value}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
}

export function TabsContent({ children, value }: TabsContentProps) {
  return <div data-value={value}>{children}</div>;
}
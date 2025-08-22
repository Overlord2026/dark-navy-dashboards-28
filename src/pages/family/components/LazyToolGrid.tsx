import React from 'react';

// Lazy component for tool grids to improve performance
export default function LazyToolGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="tool-grid">
      {children}
    </div>
  );
}
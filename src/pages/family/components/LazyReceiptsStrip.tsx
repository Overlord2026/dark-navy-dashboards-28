import React from 'react';

// Lazy component for receipts strip
export default function LazyReceiptsStrip({ children }: { children: React.ReactNode }) {
  return (
    <div className="receipts-strip">
      {children}
    </div>
  );
}
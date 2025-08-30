import React from 'react';

export default function SimpleSubHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="bfo-subheader bfo-no-blur fixed top-[calc(var(--header-h))] left-0 right-0 z-[90]">
      <div className="mx-auto h-10 px-4 sm:px-6 lg:px-8 flex items-center">
        {children}
      </div>
    </div>
  );
}
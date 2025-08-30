import React from 'react';

export function PersonaSubHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-[var(--header-h)] left-0 right-0 z-40 bfo-subheader bfo-no-blur">
      <div className="mx-auto h-10 px-4 sm:px-6 lg:px-8 flex items-center">
        {children /* make its text gold or white per item */}
      </div>
    </div>
  );
}
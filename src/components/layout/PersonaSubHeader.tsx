import React from 'react';

export function PersonaSubHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-[56px] z-40 bfo-subheader">
      <div className="mx-auto h-10 px-4 sm:px-6 lg:px-8 flex items-center">
        {children /* make its text gold or white per item */}
      </div>
    </div>
  );
}
import React from 'react';

export const TopBanner: React.FC = () => {
  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center"
      style={{ backgroundColor: '#001F3F', height: '80px' }}
    >
      <img
        src="/brand/bfo-horizontal-4x8.png"
        alt="Boutique Family Office"
        className="h-12 w-auto"
      />
    </div>
  );
};
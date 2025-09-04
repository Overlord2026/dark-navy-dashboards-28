import React from 'react';

export const TopBanner: React.FC = () => {
  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center"
      style={{ backgroundColor: '#000000', height: '70px' }}
    >
      <img
        src="/brand/bfo-horizontal-4x8.png"
        alt="Boutique Family Office"
        className="h-full w-full px-4 object-contain"
      />
    </div>
  );
};
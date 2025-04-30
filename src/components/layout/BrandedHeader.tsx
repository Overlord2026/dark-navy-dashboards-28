
import React from 'react';

interface BrandedHeaderProps {
  title?: string;
}

export const BrandedHeader: React.FC<BrandedHeaderProps> = ({ title }) => {
  return (
    <div className="text-center py-4 mt-[100px]">
      <h1 className="text-2xl font-bold">
        {title || 'Boutique Family Office'}
      </h1>
    </div>
  );
};

export default BrandedHeader;

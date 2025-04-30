
import React from 'react';
import Logo from '../common/Logo';

interface BrandedHeaderProps {
  title?: string;
}

export const BrandedHeader: React.FC<BrandedHeaderProps> = ({ title }) => {
  return (
    <div className="text-center py-4 mt-4">
      {!title ? <Logo size="medium" /> : <h1 className="text-2xl font-bold">{title}</h1>}
    </div>
  );
};

export default BrandedHeader;

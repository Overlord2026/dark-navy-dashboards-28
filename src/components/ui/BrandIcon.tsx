import React from 'react';

type BrandIconProps = {
  as: React.ElementType;
  color?: 'black' | 'gold' | 'inherit';
  className?: string;
  size?: number | string;
  [key: string]: any;
};

export default function BrandIcon({ 
  as: Icon, 
  color = 'black', 
  className = '', 
  size = 20, 
  ...rest 
}: BrandIconProps) {
  const tone = color === 'gold' ? 'icon-gold' : color === 'inherit' ? '' : 'icon-black';
  return <Icon className={`${tone} ${className}`} size={size} {...rest} />;
}
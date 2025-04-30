
import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true, className = '' }) => {
  const sizeClasses = {
    small: 'h-6 w-auto',
    medium: 'h-10 w-auto',
    large: 'h-16 w-auto'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src="/lovable-uploads/044929b9-43f4-4d21-afb5-c1a377579749.png" 
        alt="Boutique Family Office Logo" 
        className={sizeClasses[size]}
      />
      {showText && (
        <div className="text-center mt-1">
          <p className="text-sm sm:text-lg font-semibold text-[#D4AF37]">Organize & Maximize</p>
          <p className="text-xs sm:text-sm text-gray-300 uppercase tracking-wide">
            Your personalized path to lasting prosperity
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;

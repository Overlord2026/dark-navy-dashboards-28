
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
        src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
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

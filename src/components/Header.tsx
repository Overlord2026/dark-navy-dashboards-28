
import React from "react";

interface HeaderProps {
  isConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isConnected = false }) => {
  return (
    <header className="
      fixed top-0 left-0 w-full bg-black z-50
      flex flex-col items-center py-2
    ">
      <img
        src='/assets/logo-gold-tree.svg'
        alt='Boutique Family Office'
        className='h-10 mb-1'
      />
      <div className="text-center px-4">
        <p className="text-xl font-semibold text-[#D4AF37]">Organize & Maximize</p>
        <p className="text-sm text-gray-300 uppercase tracking-wide">
          Your personalized path to lasting prosperity
        </p>
      </div>
      {isConnected && (
        <div className="absolute right-4 top-4">
          <span className="bg-[#FFC700] text-black text-xs px-2 py-1 rounded-full font-medium">Connected</span>
        </div>
      )}
    </header>
  );
};

export default Header;

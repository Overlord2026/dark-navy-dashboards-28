
import React from 'react';

interface FooterProps {
  isMobile?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isMobile = false }) => {
  return (
    <footer className={`w-full py-${isMobile ? '6' : '8'} text-center border-t border-white/10 mt-auto`}>
      <p className="text-gray-400">© {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
    </footer>
  );
};

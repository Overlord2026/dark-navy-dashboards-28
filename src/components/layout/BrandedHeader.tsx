
import React from "react";

export const BrandedHeader: React.FC = () => {
  return (
    <header className="w-full flex justify-center items-center bg-black fixed top-0 left-0 right-0 z-50 py-2 shadow-md">
      <div className="flex flex-col items-center justify-center">
        {/* Logo and text */}
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
            alt="Boutique Family Office Logo" 
            className="h-10 w-auto mr-3"
          />
          <span className="text-white text-xl font-semibold">BOUTIQUE FAMILY OFFICE</span>
        </div>
        
        {/* Tagline */}
        <div className="text-center">
          <p className="text-[#D4AF37] text-xs uppercase tracking-wide">ORGANIZE &amp; MAXIMIZE</p>
        </div>
      </div>
    </header>
  );
};

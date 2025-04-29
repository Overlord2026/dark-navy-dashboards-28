
import React from "react";

export const BrandedHeader: React.FC = () => {
  return (
    <header className="w-full flex justify-center items-center bg-black fixed top-0 left-0 right-0 z-50 py-2">
      <div className="flex flex-col items-center justify-center">
        {/* Logo and text */}
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/dcc6226b-47e8-4e6b-97ff-d902f2ef4f1c.png" 
            alt="Boutique Family Office Logo" 
            className="h-10 w-auto"
          />
          <span className="text-white text-lg font-semibold ml-2">BOUTIQUE FAMILY OFFICE</span>
        </div>
        
        {/* Tagline */}
        <div className="text-center mt-1">
          <p className="text-[#D4AF37] text-xs uppercase tracking-wide">ORGANIZE &amp; MAXIMIZE</p>
        </div>
      </div>
    </header>
  );
};

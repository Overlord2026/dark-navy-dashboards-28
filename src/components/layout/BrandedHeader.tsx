
import React from "react";

export const BrandedHeader: React.FC = () => {
  return (
    <header className="w-full flex justify-center items-center bg-black fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="flex items-center justify-center py-1">
        <div className="flex flex-col">
          <span className="text-white text-xl font-semibold">BOUTIQUE FAMILY OFFICE</span>
          <p className="text-[#D4AF37] text-xs uppercase tracking-wide">ORGANIZE &amp; MAXIMIZE</p>
        </div>
      </div>
    </header>
  );
};

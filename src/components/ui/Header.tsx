
import React from "react";

export const Header = () => {
  return (
    <div className="w-full px-4 py-1 flex flex-col items-center justify-center bg-gradient-to-r from-[#0A1F44] to-[#1B1B32] z-10">
      {/* Header container with space for logo */}
      <div className="w-full max-w-7xl flex justify-between items-center h-16">
        {/* Left section spacing */}
        <div className="flex-1"></div>
        
        {/* Centered area for future logo */}
        <div className="flex justify-center">
          {/* Logo placeholder - to be added by user */}
          <div className="h-16 w-48 flex items-center justify-center text-white opacity-50">
            Logo Area
          </div>
        </div>
        
        {/* Right section spacing */}
        <div className="flex-1"></div>
      </div>
    </div>
  );
};

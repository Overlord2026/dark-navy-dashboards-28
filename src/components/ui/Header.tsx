
import React from "react";

export const Header = () => {
  return (
    <div className="w-full px-4 py-1 flex flex-col items-center justify-center bg-gradient-to-r from-[#0A1F44] to-[#1B1B32] z-10">
      {/* Header container with logo */}
      <div className="w-full max-w-7xl flex justify-between items-center h-16">
        {/* Left section spacing */}
        <div className="flex-1"></div>
        
        {/* Centered area with logo */}
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/5d3bcbf7-9c7e-4071-8db1-b7011ac1a630.png" 
            alt="Boutique Family Office Logo" 
            className="h-16 w-auto"
          />
        </div>
        
        {/* Right section spacing */}
        <div className="flex-1"></div>
      </div>
    </div>
  );
};

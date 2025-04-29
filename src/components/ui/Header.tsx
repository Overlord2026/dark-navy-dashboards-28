
import React from "react";

export const Header = () => {
  return (
    <div className="w-full px-4 py-1 flex flex-col items-center justify-center bg-black fixed top-0 left-0 right-0 z-50">
      {/* Header container with logo */}
      <div className="w-full max-w-7xl flex flex-col justify-center items-center h-auto py-3">
        {/* Logo */}
        <div className="font-dwite">
          <img 
            src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
            alt="Boutique Family Office Logo" 
            className="h-16 w-auto"
          />
        </div>
        
        {/* Tagline */}
        <div className="mt-2 text-center">
          <h3 className="font-dwite text-[#D4AF37] text-xl">Organize & Maximize</h3>
          <p className="text-white text-xs uppercase tracking-wide mt-1">Your personalized path to lasting prosperity</p>
        </div>
      </div>
    </div>
  );
}

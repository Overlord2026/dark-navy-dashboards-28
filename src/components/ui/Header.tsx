
import React from "react";
import { toast } from "sonner";

export const Header = () => {
  const handleQuickAction = (label: string) => {
    toast.success(`Navigating to ${label}`);
  };

  return (
    <div className="w-full px-4 py-1 flex flex-col items-center justify-center bg-gradient-to-r from-[#0A1F44] to-[#1B1B32] z-10">
      {/* Header container with logo */}
      <div className="w-full max-w-7xl flex justify-between items-center">
        {/* Logo on the left */}
        <div className="flex-1"></div>
        
        {/* Centered logo */}
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/44608b26-0af4-4b77-998a-0d2cde72da54.png" 
            alt="Boutique Family Office Logo" 
            className="h-16 w-auto"
          />
        </div>
        
        {/* Right side spacing */}
        <div className="flex-1"></div>
      </div>
    </div>
  );
};


import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div className="w-full px-4 py-2 flex flex-col items-center justify-center bg-transparent z-10">
      {/* Prominent logo at top center with minimal spacing */}
      <div className="w-full flex justify-center mb-2">
        <img 
          src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
          alt="Boutique Family Office Logo" 
          className="h-16 w-auto"
        />
      </div>
      
      {/* No additional elements here - all menu items are in QuickActionsMenu */}
    </div>
  );
};

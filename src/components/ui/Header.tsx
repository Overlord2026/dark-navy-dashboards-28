
import React from "react";
import { toast } from "sonner";

export const Header = () => {
  return (
    <div className="w-full px-4 py-1 flex flex-col items-center justify-center bg-transparent z-10">
      {/* Header container with centered logo */}
      <div className="w-full max-w-7xl flex justify-center items-center">
        {/* Centered logo */}
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
            alt="Boutique Family Office Logo" 
            className="h-14 w-auto"
          />
        </div>
      </div>
    </div>
  );
};


import React from "react";

export const Header = () => {
  return (
    <div className="w-full px-4 py-1 flex flex-col items-center justify-center bg-[#0A1F44] z-10">
      {/* Header container with logo */}
      <div className="w-full max-w-7xl flex justify-center items-center h-16">
        {/* Centered area with logo */}
        <div className="mx-4 font-dwite">
          <img 
            src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
            alt="Boutique Family Office Logo" 
            className="h-16 w-auto"
          />
        </div>
      </div>
    </div>
  );
}

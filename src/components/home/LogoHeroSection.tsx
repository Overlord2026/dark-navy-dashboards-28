
import React from "react";

export const LogoHeroSection: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-[#1B1B32]">
      <img 
        src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
        alt="Boutique Family Office Logo" 
        className="h-40 w-auto mb-6 animate-fade-in"
      />
      <h2 className="text-2xl text-white font-light mb-6 tracking-wider">BOUTIQUE FAMILY OFFICE</h2>
      <div className="w-24 h-1 bg-[#DCD8C0] mb-6"></div>
      <p className="text-xl text-gray-300 max-w-2xl text-center px-4">
        Personalized wealth management solutions for high-net-worth individuals and families.
      </p>
    </div>
  );
};

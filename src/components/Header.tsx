
import React from "react";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  isConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isConnected = false }) => {
  return (
    <header className="w-full flex justify-center items-center bg-[#0F1E3A] fixed top-0 left-0 right-0 z-50 shadow-md border-b border-[#FFC700]/30">
      <div className="flex items-center justify-center py-3 relative w-full px-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/421ecf90-6573-4083-aaa4-765dcf0b7600.png" 
              alt="Boutique Family Office Logo" 
              className="h-10 w-auto"
            />
            {isConnected && (
              <Badge className="ml-2 bg-[#FFC700] text-[#0F1E3A] font-medium">Connected</Badge>
            )}
          </div>
          <p className="text-[#FFC700] text-xs uppercase tracking-wide font-medium mt-1">ORGANIZE &amp; MAXIMIZE</p>
        </div>
      </div>
    </header>
  );
};

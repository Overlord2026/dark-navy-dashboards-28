
import React from "react";
import { Badge } from "@/components/ui/badge";

interface BrandedHeaderProps {
  isConnected?: boolean;
}

export const BrandedHeader: React.FC<BrandedHeaderProps> = ({ isConnected = false }) => {
  return (
    <header className="w-full flex justify-center items-center bg-[#0F1E3A] fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="flex items-center justify-center py-1 relative w-full px-4">
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-white text-xl font-semibold">BOUTIQUE FAMILY OFFICE</span>
            {isConnected && (
              <Badge className="ml-2 bg-[#FFC700] text-[#0F1E3A] font-medium">Connected</Badge>
            )}
          </div>
          <p className="text-[#FFC700] text-xs uppercase tracking-wide">ORGANIZE &amp; MAXIMIZE</p>
        </div>
      </div>
    </header>
  );
};

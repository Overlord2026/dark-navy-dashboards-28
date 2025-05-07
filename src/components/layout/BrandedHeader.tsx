import React from "react";
import { Badge } from "@/components/ui/badge";
interface BrandedHeaderProps {
  isConnected?: boolean;
}
export const BrandedHeader: React.FC<BrandedHeaderProps> = ({
  isConnected = false
}) => {
  return <header className="w-full flex justify-center items-center bg-[#0F1E3A] fixed top-0 left-0 right-0 z-50 shadow-md border-b border-[#FFC700]/30">
      <div className="flex items-center justify-center py-3 relative w-full px-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <img src="/lovable-uploads/27271a88-28e0-4eab-a76b-3b44be771df0.png" alt="Boutique Family Office Logo" className="h-8 md:h-10" />
            {isConnected && <Badge className="ml-2 bg-[#FFC700] text-[#0F1E3A] font-medium">Connected</Badge>}
          </div>
          
        </div>
      </div>
    </header>;
};

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export const Header = () => {
  const handleQuickAction = (label: string) => {
    toast.success(`Navigating to ${label}`);
  };

  return (
    <div className="w-full px-4 py-1 flex flex-col items-center justify-center bg-transparent z-10">
      {/* Header container with logo and marketplace button */}
      <div className="w-full max-w-7xl flex justify-between items-center">
        {/* Logo on the left */}
        <div className="flex-1"></div>
        
        {/* Centered logo */}
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
            alt="Boutique Family Office Logo" 
            className="h-14 w-auto"
          />
        </div>
        
        {/* Marketplace button on the right */}
        <div className="flex-1 flex justify-end">
          <Button 
            variant="marketplace" 
            size="sm"
            className="gap-2 transition-all shadow-md border border-[#0EA5E9]/20 bg-gradient-to-r from-[#0EA5E9] to-[#0891CE] hover:bg-gradient-to-r hover:from-[#0891CE] hover:to-[#0EA5E9] font-medium tracking-wide text-xs md:text-sm rounded-lg px-3 py-1.5 animate-pulse" 
            asChild
            onClick={() => handleQuickAction("Family Office Marketplace")}
          >
            <Link to="/marketplace">
              <ShoppingBag className="h-4 w-4" />
              Family Office Marketplace
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

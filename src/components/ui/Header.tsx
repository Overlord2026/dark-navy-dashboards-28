
import React from "react";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import { Logo } from "@/components/ui/Logo";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export const Header = () => {
  return (
    <div className="w-full px-4 py-0.5 flex flex-col items-center justify-center bg-transparent z-10">
      {/* Header container with centered logo and notification */}
      <div className="w-full max-w-7xl flex justify-between items-center">
        {/* Left spacer for balance */}
        <div className="w-10" />
        
        {/* Centered logo */}
        <div className="flex justify-center">
          <Logo variant="tree" />
        </div>
        
        {/* Right side - notifications */}
        <div className="flex items-center">
          <NotificationBell />
        </div>
      </div>
    </div>
  );
};

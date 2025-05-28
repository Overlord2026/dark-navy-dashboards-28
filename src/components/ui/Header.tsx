
import React from "react";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export const Header = () => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";

  return (
    <div className="w-full px-4 py-0.5 flex flex-col items-center justify-center bg-transparent z-10">
      {/* Header container with centered logo */}
      <div className="w-full max-w-7xl flex justify-center items-center">
        {/* Centered logo */}
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
            alt="Boutique Family Office Logo" 
            className={cn(
              "h-10 w-auto",
              isLightTheme ? "filter-none" : "filter-none"
            )}
            style={{
              filter: isLightTheme ? 'brightness(0.8)' : 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
};

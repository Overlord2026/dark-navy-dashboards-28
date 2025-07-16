
import React from "react";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import { Logo } from "@/components/ui/Logo";

export const Header = () => {
  return (
    <div className="w-full px-4 py-0.5 flex flex-col items-center justify-center bg-transparent z-10">
      {/* Header container with centered logo */}
      <div className="w-full max-w-7xl flex justify-center items-center">
        {/* Centered logo */}
        <div className="flex justify-center">
          <Logo variant="tree" />
        </div>
      </div>
    </div>
  );
};

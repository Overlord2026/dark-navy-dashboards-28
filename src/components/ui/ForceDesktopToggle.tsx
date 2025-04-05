
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Laptop } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export function ForceDesktopToggle({ className }: { className?: string }) {
  const { isMobile, forceDesktop, toggleForceDesktop } = useIsMobile();
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const isDesktopDevice = window.innerWidth >= 1024;
  
  // Only show the toggle on devices that are laptop or larger
  if (!isDesktopDevice) {
    return null;
  }

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-md transition-all",
      isLightTheme ? "text-[#222222]" : "text-white",
      className
    )}>
      <Laptop className="h-4 w-4" />
      <Label htmlFor="force-desktop" className="text-xs cursor-pointer">
        Force Desktop View
      </Label>
      <Switch 
        id="force-desktop"
        checked={forceDesktop}
        onCheckedChange={toggleForceDesktop}
        aria-label="Toggle desktop view"
      />
    </div>
  );
}

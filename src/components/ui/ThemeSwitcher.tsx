
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { toast } from "sonner";

export function ThemeSwitcher({ onClose }: { onClose?: () => void }) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme} mode`);
    if (onClose) onClose();
  };

  return (
    <div className={`p-6 space-y-6 ${theme === "light" ? "bg-[#F9F7E8] text-[#222222]" : ""}`}>
      <h2 className="text-xl font-semibold mb-4">
        Change Theme
      </h2>
      
      <div className="flex flex-col gap-4">
        <div 
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            theme === "dark" 
              ? "border-primary bg-[#12121C]/80 text-white" 
              : "border-gray-300 bg-[#12121C]/20 text-white"
          }`}
          onClick={() => theme !== "dark" && toggleTheme()}
        >
          <div className="flex items-center gap-3 mb-2">
            <MoonIcon className="h-5 w-5 text-gray-400" />
            <h3 className="font-medium">Dark Mode</h3>
            {theme === "dark" && (
              <span className="ml-auto text-xs bg-primary/20 text-primary-foreground px-2 py-0.5 rounded-full">
                Current
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Dark interface with higher contrast and yellow accents
          </p>
        </div>
        
        <div 
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            theme === "light" 
              ? "border-primary bg-[#F9F7E8]/80 text-[#222222]" 
              : "border-gray-300 bg-[#F9F7E8]/20 text-[#666666]"
          }`}
          onClick={() => theme !== "light" && toggleTheme()}
        >
          <div className="flex items-center gap-3 mb-2">
            <SunIcon className="h-5 w-5 text-amber-500" />
            <h3 className="font-medium">Light Mode</h3>
            {theme === "light" && (
              <span className="ml-auto text-xs bg-primary/20 text-primary-foreground px-2 py-0.5 rounded-full">
                Current
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Soft yellow-tinted theme with enhanced readability
          </p>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button
          onClick={onClose}
          variant="outline"
          className="mr-2"
        >
          Cancel
        </Button>
        <Button
          onClick={toggleTheme}
        >
          Apply Theme
        </Button>
      </div>
    </div>
  );
}

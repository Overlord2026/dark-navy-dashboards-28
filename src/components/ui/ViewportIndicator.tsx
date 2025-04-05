
import React from "react";
import { useViewportOverride } from "@/hooks/useViewportOverride";

export const ViewportIndicator: React.FC = () => {
  const { effectiveIsMobile, isMobileSized, isLaptopOverride } = useViewportOverride();
  
  // Only show in development environment
  if (import.meta.env.MODE !== 'development') {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/70 text-white text-xs p-2 rounded-md z-50">
      <div>Width: {window.innerWidth}px</div>
      <div>Original: {isMobileSized ? "Mobile" : "Desktop"} UI</div>
      <div>Effective: {effectiveIsMobile ? "Mobile" : "Desktop"} UI</div>
      {isLaptopOverride && <div>Laptop Override Active</div>}
    </div>
  );
};

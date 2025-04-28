
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarToggleProps {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({
  isCollapsed,
  toggleCollapsed
}) => {
  return (
    <button
      onClick={toggleCollapsed}
      className="p-1 rounded hover:bg-muted"
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
    </button>
  );
};

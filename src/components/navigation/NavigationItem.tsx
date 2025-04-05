
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MainMenuItem } from "@/types/navigation";

interface NavigationItemProps {
  item: MainMenuItem & { label?: string };
  isActive: boolean;
  isCollapsed: boolean;
  isLightTheme: boolean;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  isActive,
  isCollapsed,
  isLightTheme
}) => {
  return (
    <Link
      to={item.href}
      className={cn(
        "flex items-center py-2 px-3 rounded-lg transition-colors",
        isActive 
          ? isLightTheme
              ? "bg-[#DCD8C0]/70 text-[#222222]"
              : "bg-white/10 text-white"
          : isLightTheme
              ? "hover:bg-[#DCD8C0]/40 text-[#222222]/90"
              : "hover:bg-white/5 text-[#E2E2E2]/90"
      )}
    >
      {item.icon && (
        <item.icon 
          className={cn(
            "w-5 h-5",
            isCollapsed ? "" : "mr-3"
          )}
        />
      )}
      {!isCollapsed && <span>{item.title || item.label}</span>}
    </Link>
  );
};


import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { NavSubItem, getSubMenuItems } from "./NavigationConfig";

interface SubNavigationProps {
  activeMainItem: string;
  activeSecondaryItem?: string;
  customItems?: NavSubItem[];
  collapsed?: boolean;
}

export const SubNavigation: React.FC<SubNavigationProps> = ({
  activeMainItem,
  activeSecondaryItem = "",
  customItems,
  collapsed = false
}) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  
  // Get menu items either from custom items or from the config
  const menuItems = customItems || getSubMenuItems(activeMainItem);
  
  // If no menu items, don't render anything
  if (menuItems.length === 0 || collapsed) {
    return null;
  }

  return (
    <div className="flex-1 py-6 overflow-y-auto">
      <nav className="px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = item.id === activeSecondaryItem || 
                           (activeSecondaryItem === "" && item.id === menuItems[0]?.id);
          
          return (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                "group flex items-center py-2 px-3 rounded-md transition-colors text-[14px] border",
                isActive
                  ? isLightTheme 
                    ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
                    : "bg-sidebar-accent text-accent border-primary"
                  : isLightTheme ? "text-[#222222] border-transparent" : "text-[#E2E2E2] border-transparent",
                isLightTheme ? "hover:bg-[#E9E7D8] hover:border-primary" : "hover:bg-sidebar-accent hover:border-primary"
              )}
            >
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

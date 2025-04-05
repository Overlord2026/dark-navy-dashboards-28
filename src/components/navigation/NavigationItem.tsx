
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavigationItemProps {
  item: {
    id: string;
    title: string;
    label?: string;
    icon?: React.ElementType;
    href: string;
  };
  isActive: boolean;
  isCollapsed: boolean;
  isLightTheme: boolean;
}

export const NavigationItem = ({ 
  item, 
  isActive, 
  isCollapsed, 
  isLightTheme 
}: NavigationItemProps) => {
  const Icon = item.icon;
  
  return (
    <Link
      key={item.id}
      to={item.href}
      className={cn(
        "flex items-center py-2 px-3 rounded-md transition-colors text-[14px] w-full whitespace-nowrap",
        isActive
          ? isLightTheme 
            ? "bg-[#DCD8C0]/70 text-[#222222]" 
            : "bg-white/10 text-white"
          : isLightTheme 
            ? "text-[#222222]/90 hover:bg-[#DCD8C0]/40" 
            : "text-[#E2E2E2]/90 hover:bg-white/5",
        isCollapsed ? "justify-center px-2" : ""
      )}
      title={isCollapsed ? (item.title || item.label) : undefined}
    >
      {Icon && (
        <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
      )}
      {!isCollapsed && <span className="truncate">{item.title || item.label}</span>}
    </Link>
  );
};

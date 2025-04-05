
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface NavigationItemProps {
  item: {
    id: string;
    title: string;
    label?: string;
    description?: string;
    href: string;
    icon?: React.ElementType;
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
  const Icon = item.icon || (() => null);
  
  return (
    <Link
      key={item.id}
      to={item.href}
      className={cn(
        "group flex items-center py-2 px-3 rounded-md transition-all duration-200 text-[14px] whitespace-nowrap border",
        isActive
          ? isLightTheme 
            ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
            : "bg-black text-[#E2E2E2] font-medium border-primary"
          : isLightTheme ? "text-[#222222] border-transparent" : "text-[#E2E2E2] border-transparent",
        isLightTheme 
          ? "hover:bg-[#E9E7D8] hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" 
          : "hover:bg-sidebar-accent hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
      )}
    >
      {Icon && (
        <Icon
          className="h-5 w-5 mr-3"
          style={{ 
            backgroundColor: isLightTheme ? '#222222' : '#000', 
            padding: '2px', 
            borderRadius: '2px' 
          }}
        />
      )}
      {!isCollapsed && <span>{item.title}</span>}
    </Link>
  );
};

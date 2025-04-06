
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavigationItemProps {
  item: {
    id: string;
    label: string;
    icon: React.ElementType | React.FC;
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
        "group flex items-center py-2 px-3 rounded-md transition-colors text-[14px] whitespace-nowrap border",
        isActive
          ? isLightTheme 
            ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
            : "bg-black text-[#E2E2E2] font-medium border-primary"
          : isLightTheme ? "text-[#222222] border-transparent" : "text-[#E2E2E2] border-transparent",
        isLightTheme ? "hover:bg-[#E9E7D8] hover:border-primary" : "hover:bg-sidebar-accent hover:border-primary",
        isCollapsed ? "justify-center px-2 my-2" : "justify-start"
      )}
      title={isCollapsed ? item.label : undefined}
    >
      <div className={cn("flex-shrink-0", !isCollapsed && "mr-3")}>
        {React.isValidElement(Icon) ? (
          Icon
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </div>
      
      {!isCollapsed && (
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
      )}
    </Link>
  );
};

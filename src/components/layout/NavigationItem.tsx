
import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(item.href);
  };
  
  return (
    <Link
      key={item.id}
      to={item.href}
      onClick={handleClick}
      className={cn(
        "group flex items-center py-2 px-3 rounded-md transition-colors text-[14px] whitespace-nowrap border",
        isActive
          ? isLightTheme 
            ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
            : "bg-black text-[#E2E2E2] font-medium border-primary"
          : isLightTheme ? "text-[#222222] border-transparent" : "text-[#E2E2E2] border-transparent",
        isLightTheme ? "hover:bg-[#E9E7D8] hover:border-primary" : "hover:bg-sidebar-accent hover:border-primary",
        isCollapsed ? "justify-center px-2 my-2" : ""
      )}
      title={isCollapsed ? item.label : undefined}
    >
      {typeof Icon === 'function' ? (
        <div className={`flex items-center justify-center rounded-sm p-0.5 ${isLightTheme ? 'bg-[#222222]' : 'bg-black'} ${!isCollapsed && "mr-3"}`}>
          <Icon />
        </div>
      ) : (
        <Icon 
          className={cn("h-5 w-5", !isCollapsed && "mr-3")} 
          style={{ 
            backgroundColor: isLightTheme ? '#222222' : '#000', 
            padding: '2px', 
            borderRadius: '2px' 
          }} 
        />
      )}
      {!isCollapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
    </Link>
  );
};

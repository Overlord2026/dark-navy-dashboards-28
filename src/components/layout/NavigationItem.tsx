
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavigationItemProps {
  item: {
    id: string;
    label: string;
    icon: React.ElementType | React.FC;
    href: string;
    comingSoon?: boolean;
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
  
  // Normalize href to ensure it starts with a forward slash
  const normalizedHref = item.href.startsWith("/") ? item.href : `/${item.href}`;
  
  const baseClasses = cn(
    "group flex items-center py-2 px-3 rounded-md transition-colors text-[14px] whitespace-nowrap border",
    isActive
      ? isLightTheme 
        ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
        : "bg-black text-[#E2E2E2] font-medium border-primary"
      : isLightTheme ? "text-[#222222] border-transparent" : "text-[#E2E2E2] border-transparent",
    isLightTheme ? "hover:bg-[#E9E7D8] hover:border-primary" : "hover:bg-sidebar-accent hover:border-primary",
    isCollapsed ? "justify-center px-2 my-2" : "justify-start",
    item.comingSoon ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
  );

  const content = (
    <>
      <div className={cn("flex-shrink-0", !isCollapsed && "mr-3")}>
        {React.isValidElement(Icon) ? (
          Icon
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </div>
      
      {/* Only visually hide the label when collapsed, keep it in the DOM for accessibility */}
      <span className={cn(
        "whitespace-nowrap overflow-hidden text-ellipsis",
        isCollapsed ? "hidden md:hidden" : ""
      )}>
        {item.label}
        {item.comingSoon && !isCollapsed && (
          <span className="ml-2 text-xs text-muted-foreground">(Coming Soon)</span>
        )}
      </span>
      {isCollapsed && <span className="sr-only">{item.label}</span>}
    </>
  );

  if (item.comingSoon) {
    return (
      <div
        className={baseClasses}
        title={isCollapsed ? `${item.label} (Coming Soon)` : undefined}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      key={item.id}
      to={normalizedHref}
      className={baseClasses}
      title={isCollapsed ? item.label : undefined}
    >
      {content}
    </Link>
  );
};

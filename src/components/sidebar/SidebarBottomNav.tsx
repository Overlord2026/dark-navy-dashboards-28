
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/navigation";

interface SidebarBottomNavProps {
  items: NavItem[];
  collapsed: boolean;
  isActive: (href: string) => boolean;
  isLightTheme: boolean;
}

export const SidebarBottomNav: React.FC<SidebarBottomNavProps> = ({
  items,
  collapsed,
  isActive,
  isLightTheme
}) => {
  // Helper to ensure consistent path handling
  const normalizePath = (path: string): string => {
    return path.startsWith("/") ? path : `/${path}`;
  };

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const normalizedHref = normalizePath(item.href);
        
        const baseClasses = cn(
          "group flex items-center py-2 px-3 rounded-md transition-colors border",
          isActive(normalizedHref)
            ? isLightTheme 
              ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
              : "bg-black text-white border-primary" 
            : isLightTheme ? "text-[#222222] border-transparent hover:bg-[#E9E7D8] hover:border-primary" 
              : "text-sidebar-foreground border-transparent hover:bg-sidebar-accent",
          item.comingSoon ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        );

        const content = (
          <>
            {item.icon && (
              <item.icon 
                className={cn(
                  "h-5 w-5 flex-shrink-0", 
                  !collapsed && "mr-3"
                )} 
              />
            )}
            {!collapsed && (
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                {item.title}
                {item.comingSoon && (
                  <span className="ml-2 text-xs text-muted-foreground">(Coming Soon)</span>
                )}
              </span>
            )}
            {collapsed && (
              <span className="sr-only">{item.title}</span>
            )}
          </>
        );

        if (item.comingSoon) {
          return (
            <div
              key={item.title}
              className={baseClasses}
              title={collapsed ? `${item.title} (Coming Soon)` : undefined}
            >
              {content}
            </div>
          );
        }

        return (
          <Link
            key={item.title}
            to={normalizedHref}
            className={baseClasses}
            title={collapsed ? item.title : undefined}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
};

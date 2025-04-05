
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SecondaryNavigationProps {
  hasSecondaryMenu: boolean;
  secondarySidebarCollapsed: boolean;
  isLightTheme: boolean;
  activeMainItem: string;
  sectionId?: string; 
  menuItems: { id: string; label?: string; name?: string; active?: boolean }[];
}

export function SecondaryNavigation({
  hasSecondaryMenu,
  secondarySidebarCollapsed,
  isLightTheme,
  activeMainItem,
  sectionId,
  menuItems
}: SecondaryNavigationProps) {
  // Handle case where menuItems might be undefined
  const safeMenuItems = menuItems || [];

  const getUrl = (id: string) => {
    // Handle different URL patterns based on the main section
    switch(activeMainItem) {
      case "education":
        return `/education?category=${id}`;
      case "investments":
        if (id === "models") return "/investments/all-models";
        if (id === "alternatives") return "/investments/alternatives";
        return `/investments/${id}`;
      case "sharing":
        return `/sharing/${id}`;
      case "documents":
        return `/documents/${id}`;
      default:
        return `/${activeMainItem}/${id}`;
    }
  };

  if (!hasSecondaryMenu) return null;

  return (
    <aside
      className={cn(
        "flex flex-col transition-all duration-300 ease-in-out border-r z-20",
        secondarySidebarCollapsed ? "w-[70px]" : "w-[200px] sm:w-[220px]",
        isLightTheme ? "bg-[#F9F7E8] border-[#DCD8C0]" : "bg-[#1B1B32] border-white/10"
      )}
    >
      <div className="p-2 overflow-y-auto flex-1">
        <nav className="space-y-1">
          {safeMenuItems.map((item) => {
            // Get the display name from either label or name property
            const displayName = item.label || item.name || item.id;
            const url = getUrl(item.id);
            const isActive = sectionId === item.id || item.active;

            return (
              <Link
                key={item.id}
                to={url}
                className={cn(
                  "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  isActive
                    ? isLightTheme
                      ? "bg-[#E9E7D8] text-[#222222] font-medium"
                      : "bg-slate-800 text-white font-medium"
                    : isLightTheme
                      ? "text-[#222222] hover:bg-[#E9E7D8]"
                      : "text-white hover:bg-slate-800",
                  secondarySidebarCollapsed ? "justify-center" : ""
                )}
              >
                {!secondarySidebarCollapsed && (
                  <span>{displayName}</span>
                )}
                {secondarySidebarCollapsed && (
                  <span className="text-xs">{displayName.charAt(0)}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

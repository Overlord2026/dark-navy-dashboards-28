
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type MenuItem = {
  id: string;
  label?: string;
  name?: string;
  active?: boolean;
};

interface SecondaryNavigationProps {
  hasSecondaryMenu: boolean;
  secondarySidebarCollapsed: boolean;
  isLightTheme: boolean;
  activeMainItem: string;
  sectionId: string;
  menuItems: MenuItem[];
}

export const SecondaryNavigation = ({
  hasSecondaryMenu,
  secondarySidebarCollapsed,
  isLightTheme,
  activeMainItem,
  sectionId,
  menuItems
}: SecondaryNavigationProps) => {
  if (!hasSecondaryMenu) return null;
  
  return (
    <aside
      className={cn(
        "flex flex-col transition-all duration-300 ease-in-out z-20",
        secondarySidebarCollapsed ? "w-[0px]" : "w-[200px]",
        isLightTheme ? "bg-[#F9F7E8] border-r border-[#DCD8C0]" : "bg-[#1B1B32] border-r border-sidebar-border"
      )}
    >
      <div className={`flex items-center h-[70px] px-6 border-b ${isLightTheme ? 'border-[#DCD8C0]' : 'border-sidebar-border'}`}>
        {!secondarySidebarCollapsed && (
          <span className={`font-medium truncate ${isLightTheme ? 'text-[#222222]' : 'text-[#E2E2E2]'}`}>Sections</span>
        )}
      </div>

      {!secondarySidebarCollapsed && (
        <div className="flex-1 py-6 overflow-y-auto">
          <nav className="px-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={`/${activeMainItem}/${item.id}`}
                className={cn(
                  "group flex items-center py-2 px-3 rounded-md transition-colors text-[14px] border",
                  item.id === sectionId || item.active
                    ? isLightTheme 
                      ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
                      : "bg-sidebar-accent text-accent border-primary"
                    : isLightTheme ? "text-[#222222] border-transparent" : "text-[#E2E2E2] border-transparent",
                  isLightTheme ? "hover:bg-[#E9E7D8] hover:border-primary" : "hover:bg-sidebar-accent hover:border-primary"
                )}
              >
                <span>{item.name || item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </aside>
  );
};

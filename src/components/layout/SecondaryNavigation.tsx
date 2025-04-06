
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SecondaryNavigationProps {
  hasSecondaryMenu: boolean;
  secondarySidebarCollapsed: boolean;
  isLightTheme: boolean;
  activeMainItem: string;
  menuItems: {
    id: string;
    label?: string;
    name?: string;
    active?: boolean;
  }[];
  sectionId?: string;
}

export const SecondaryNavigation: React.FC<SecondaryNavigationProps> = ({
  hasSecondaryMenu,
  secondarySidebarCollapsed,
  isLightTheme,
  activeMainItem,
  menuItems,
  sectionId
}) => {
  if (!hasSecondaryMenu) return null;

  // Enhanced path builder with better handling of edge cases
  const getLinkPath = (item: { id: string }) => {
    if (activeMainItem === "education" && item.id === "tax-planning") {
      return "/education/tax-planning";
    }
    
    if (["investments", "education", "sharing"].includes(activeMainItem)) {
      return `/${activeMainItem}/${item.id}`;
    }
    
    return `/${activeMainItem}/${item.id}`;
  };

  return (
    <aside
      className={cn(
        "flex flex-col transition-all duration-300 ease-in-out border-r",
        secondarySidebarCollapsed ? "w-[80px]" : "w-[220px]",
        isLightTheme ? "bg-[#F9F7E8] border-[#DCD8C0]" : "bg-[#1B1B32] border-white/10"
      )}
    >
      <div className="overflow-y-auto flex-1 p-2">
        <h3 className="text-sm font-semibold px-3 py-2 mb-2" style={{ color: isLightTheme ? '#222222' : '#E2E2E2' }}>
          {activeMainItem?.toUpperCase()} {sectionId ? `- ${sectionId}` : ''}
        </h3>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={getLinkPath(item)}
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md cursor-pointer",
                item.active
                  ? isLightTheme
                    ? "bg-[#E9E7D8] text-[#222222] font-medium"
                    : "bg-black text-white"
                  : isLightTheme
                    ? "text-[#222222] hover:bg-[#E9E7D8]"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <span>{item.name || item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

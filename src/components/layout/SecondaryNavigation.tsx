
import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
  sectionId?: string; // Making sectionId optional
}

export const SecondaryNavigation: React.FC<SecondaryNavigationProps> = ({
  hasSecondaryMenu,
  secondarySidebarCollapsed,
  isLightTheme,
  activeMainItem,
  menuItems,
  sectionId
}) => {
  const navigate = useNavigate();
  
  if (!hasSecondaryMenu) return null;

  // Build the link path based on the active main item
  const getLinkPath = (item: { id: string }) => {
    if (["investments", "education", "sharing"].includes(activeMainItem)) {
      // For standard secondary navigation
      return `/${activeMainItem}/${item.id}`;
    } else {
      // Default case for other items
      return `/${activeMainItem}/${item.id}`;
    }
  };
  
  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    console.log(`Secondary navigation to: ${path}`);
    
    // Direct navigation
    window.location.href = path;
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
              onClick={(e) => handleItemClick(e, getLinkPath(item))}
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

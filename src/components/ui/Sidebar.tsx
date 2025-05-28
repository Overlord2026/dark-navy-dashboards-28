
import React, { useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import SidebarNavCategory from "@/components/sidebar/SidebarNavCategory";
import { NavItem, SidebarProps } from "@/types/navigation";

// Make sure we export Sidebar as both default and named export
export const Sidebar: React.FC<SidebarProps> = ({
  isLightTheme,
  collapsed,
  navItems,
  expandedSubmenus,
  toggleSubmenu,
  toggleTheme,
  onExpand,
  onCollapse
}) => {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = useCallback((href: string) => {
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  }, [pathname]);

  const toggleCategory = useCallback((id: string) => {
    toggleSubmenu(id);
  }, [toggleSubmenu]);

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    // Prevent scroll behavior when clicking logo if already on dashboard
    if (location.pathname === "/dashboard") {
      e.preventDefault();
      e.stopPropagation();
    }
  }, [location.pathname]);

  // Helper to prevent default behavior for button clicks
  const handleButtonClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col w-full bg-sidebar border-r h-full transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[240px]",
        isLightTheme ? "bg-[#F6F6F6] border-[#E2E2E2]" : "bg-sidebar border-sidebar-border"
      )}
    >
      <div className="flex-1 flex flex-col gap-y-2 py-4">
        <div className="px-3 py-2 text-center">
          <Link to="/dashboard" onClick={handleLogoClick}>
            <h1 className={cn("font-bold transition-all", collapsed ? "text-xl" : "text-2xl")}>LOV</h1>
          </Link>
        </div>
        <div className="space-y-1 overflow-y-auto">
          {Object.entries(navItems).map(([key, items]) => (
            <SidebarNavCategory
              key={key}
              id={key}
              label={key}
              items={items}
              isExpanded={!!expandedSubmenus[key]}
              onToggle={toggleCategory}
              collapsed={collapsed}
              isActive={isActive}
              isLightTheme={isLightTheme}
              expandedSubmenus={expandedSubmenus}
              toggleSubmenu={toggleSubmenu}
            />
          ))}
        </div>
      </div>
      <div className="p-3 flex items-center justify-between">
        <button 
          type="button"
          onClick={(e) => {
            handleButtonClick(e);
            toggleTheme();
          }}
          className={cn(
            "text-sm transition-colors",
            isLightTheme ? "text-[#222222]" : "text-[#E2E2E2]"
          )}
          aria-label="Toggle theme"
        >
          {!collapsed && "Theme"}
          {collapsed && <span className="sr-only">Toggle Theme</span>}
        </button>
        <button 
          type="button"
          onClick={(e) => {
            handleButtonClick(e);
            collapsed ? onExpand() : onCollapse();
          }}
          className={cn(
            "text-sm transition-colors",
            isLightTheme ? "text-[#222222]" : "text-[#E2E2E2]"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {!collapsed && (collapsed ? "Expand" : "Collapse")}
          {collapsed && <span className="sr-only">{collapsed ? "Expand" : "Collapse"}</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

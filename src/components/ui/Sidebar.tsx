
import React from "react";
import { useLocation } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
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

  const isActive = (href: string) => {
    return pathname === href;
  };

  const toggleCategory = (id: string) => {
    toggleSubmenu(id);
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full bg-sidebar border-r h-full",
        isLightTheme ? "bg-[#F6F6F6] border-[#E2E2E2]" : "bg-sidebar border-sidebar-border"
      )}
    >
      <div className="flex-1 flex flex-col gap-y-2 py-4">
        <div className="px-3 py-2 text-center">
          <Link to="/dashboard">
            <h1 className="font-bold text-2xl">LOV</h1>
          </Link>
        </div>
        <div className="space-y-1">
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
          onClick={toggleTheme} 
          className={cn("text-sm", isLightTheme ? "text-[#222222]" : "text-[#E2E2E2]")}
        >
          {!collapsed && "Toggle Theme"}
          {collapsed && <span className="sr-only">Toggle Theme</span>}
        </button>
        <button 
          onClick={collapsed ? onExpand : onCollapse} 
          className={cn("text-sm", isLightTheme ? "text-[#222222]" : "text-[#E2E2E2]")}
        >
          {!collapsed && (collapsed ? "Expand" : "Collapse")}
          {collapsed && <span className="sr-only">{collapsed ? "Expand" : "Collapse"}</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

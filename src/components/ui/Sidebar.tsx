import React from "react";
import { useLocation } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Home, Plus, Settings } from "lucide-react";
import SidebarNavCategory from "@/components/sidebar/SidebarNavCategory";

export interface SidebarNavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  label?: string;
  items?: SidebarNavItem[];
}

// Define NavItem to match what SidebarNavCategory expects
export interface NavItem {
  title: string;
  href: string; // Required in NavItem
  disabled?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  label?: string;
  items?: SidebarNavItem[];
}

interface SidebarProps {
  isLightTheme: boolean;
  collapsed: boolean;
  navItems: {
    [key: string]: SidebarNavItem[];
  };
  expandedSubmenus: Record<string, boolean>;
  toggleSubmenu: (id: string) => void;
  toggleTheme: () => void;
  onExpand: () => void;
  onCollapse: () => void;
}

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
              items={items as NavItem[]} // Cast to NavItem to satisfy TypeScript
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
        <button onClick={toggleTheme} className="text-sm">
          Toggle Theme
        </button>
        <button onClick={collapsed ? onExpand : onCollapse} className="text-sm">
          {collapsed ? "Expand" : "Collapse"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

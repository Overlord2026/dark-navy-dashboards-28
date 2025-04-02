
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/navigation";

interface SidebarNavCategoryProps {
  id: string;
  label: string;
  items: NavItem[];
  isExpanded: boolean;
  onToggle: (id: string) => void;
  collapsed: boolean;
  isActive: (href: string) => boolean;
  isLightTheme: boolean;
  expandedSubmenus: Record<string, boolean>;
  toggleSubmenu: (itemTitle: string, e: React.MouseEvent) => void;
}

export const SidebarNavCategory: React.FC<SidebarNavCategoryProps> = ({
  id,
  label,
  items,
  isExpanded,
  onToggle,
  collapsed,
  isActive,
  isLightTheme,
  expandedSubmenus,
  toggleSubmenu
}) => {
  return (
    <div key={id} className="mb-3">
      {!collapsed && (
        <div 
          className={`flex items-center justify-between px-4 py-2 text-xs uppercase font-semibold tracking-wider ${
            isLightTheme ? 'text-[#222222]/70' : 'text-[#E2E2E2]/70'
          }`}
          onClick={() => onToggle(id)}
          style={{ cursor: 'pointer' }}
        >
          <span>{label}</span>
          {isExpanded ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
          }
        </div>
      )}
      
      {(collapsed || isExpanded) && (
        <nav className="px-2 space-y-1 mt-1">
          {items.map((item) => (
            <SidebarNavItem 
              key={item.title}
              item={item}
              collapsed={collapsed}
              isActive={isActive}
              isLightTheme={isLightTheme}
              expandedSubmenus={expandedSubmenus}
              toggleSubmenu={toggleSubmenu}
            />
          ))}
        </nav>
      )}
    </div>
  );
};

interface SidebarNavItemProps {
  item: NavItem;
  hasSubmenu?: boolean;
  collapsed: boolean;
  isActive: (href: string) => boolean;
  isLightTheme: boolean;
  expandedSubmenus: Record<string, boolean>;
  toggleSubmenu: (itemTitle: string, e: React.MouseEvent) => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  hasSubmenu = false,
  collapsed,
  isActive,
  isLightTheme,
  expandedSubmenus,
  toggleSubmenu
}) => {
  const hasSubItems = item.submenu && item.submenu.length > 0;
  const isSubmenuExpanded = expandedSubmenus[item.title] || false;
  
  const isItemActive = isActive(item.href);
  const isAnyChildActive = hasSubItems && item.submenu?.some(subItem => isActive(subItem.href));
  const shouldShowActive = isItemActive || isAnyChildActive;

  return (
    <div className="mb-1">
      <div className="flex flex-col">
        <div className="flex items-center">
          <Link
            to={hasSubItems ? "#" : item.href}
            onClick={(e) => hasSubItems ? toggleSubmenu(item.title, e) : undefined}
            className={cn(
              "group flex items-center py-2 px-3 rounded-md transition-colors border w-full",
              shouldShowActive
                ? isLightTheme 
                  ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
                  : "bg-black text-white border-primary" 
                : isLightTheme ? "text-[#222222] border-transparent hover:bg-[#E9E7D8] hover:border-primary" 
                  : "text-sidebar-foreground border-transparent hover:bg-sidebar-accent",
              hasSubmenu && "ml-4"
            )}
            title={collapsed ? item.title : undefined}
          >
            <item.icon 
              className={cn(
                "h-5 w-5 flex-shrink-0", 
                !collapsed && "mr-3"
              )} 
            />
            {!collapsed && (
              <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1">{item.title}</span>
            )}
            {!collapsed && hasSubItems && (
              <button
                className="h-5 w-5 p-0 flex items-center justify-center"
                onClick={(e) => toggleSubmenu(item.title, e)}
              >
                {isSubmenuExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            )}
          </Link>
        </div>
        
        {!collapsed && hasSubItems && isSubmenuExpanded && (
          <div className="pl-4 mt-1">
            {item.submenu!.map((subItem) => (
              <SidebarNavItem 
                key={subItem.title}
                item={subItem}
                hasSubmenu={true}
                collapsed={collapsed}
                isActive={isActive}
                isLightTheme={isLightTheme}
                expandedSubmenus={expandedSubmenus}
                toggleSubmenu={toggleSubmenu}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


import React from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { hierarchicalNav } from "@/components/navigation/HierarchicalNavigationConfig";
import { getRoleNavigation } from "@/utils/roleNavigation";
import { useRoleContext } from "@/context/RoleContext";
import { NavItem } from "@/types/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

// Recursive component for rendering hierarchical navigation
interface HierarchicalNavItemProps {
  item: NavItem;
  isActive: (href: string) => boolean;
  isLightTheme: boolean;
  expandedSubmenus: Record<string, boolean>;
  toggleSubmenu: (id: string) => void;
  depth?: number;
  collapsed?: boolean;
}

const HierarchicalNavItem: React.FC<HierarchicalNavItemProps> = ({
  item,
  isActive,
  isLightTheme,
  expandedSubmenus,
  toggleSubmenu,
  depth = 0,
  collapsed = false
}) => {
  const Icon = item.icon;
  const normalizedHref = item.href ? (item.href.startsWith("/") ? item.href : `/${item.href}`) : "";
  const hasChildren = item.children && item.children.length > 0;
  const itemKey = item.id || item.title;
  const itemExpanded = expandedSubmenus[itemKey] || false;
  
  // Skip nested items when collapsed
  if (collapsed && depth > 0) {
    return null;
  }
  
  // Get indentation style for nested items
  const getIndentationStyle = (level: number) => {
    if (collapsed) return {};
    const baseIndent = 12;
    const indentStep = 16;
    const totalIndent = baseIndent + (level * indentStep);
    return {
      paddingLeft: `${totalIndent}px`,
      paddingRight: '12px'
    };
  };

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <Collapsible
          open={itemExpanded}
          onOpenChange={() => toggleSubmenu(itemKey)}
        >
          <CollapsibleTrigger asChild>
            <div 
              className={cn(
                "group flex items-center w-full py-2 rounded-md transition-colors cursor-pointer border",
                isActive(normalizedHref)
                  ? isLightTheme 
                    ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
                    : "bg-black text-white border-primary"
                  : isLightTheme ? "text-[#222222] border-transparent hover:bg-[#E9E7D8] hover:border-primary" 
                    : "text-[#E2E2E2] border-transparent hover:bg-sidebar-accent",
                depth > 0 && "text-sm",
                depth > 1 && "text-xs"
              )}
              style={getIndentationStyle(depth)}
            >
              {Icon && (
                <Icon className={cn(
                  "mr-3 flex-shrink-0",
                  depth === 0 ? "h-5 w-5" : "h-4 w-4"
                )} />
              )}
              <span className="flex-1 truncate">{item.title}</span>
              {!collapsed && (
                <div className="flex-shrink-0 ml-2">
                  {itemExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-1">
            {item.children!.map((childItem) => (
              <HierarchicalNavItem
                key={childItem.id || childItem.title}
                item={childItem}
                isActive={isActive}
                isLightTheme={isLightTheme}
                expandedSubmenus={expandedSubmenus}
                toggleSubmenu={toggleSubmenu}
                depth={depth + 1}
                collapsed={collapsed}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }

  // Handle disabled/coming soon items
  if (item.comingSoon || item.disabled) {
    return (
      <div
        className={cn(
          "group flex items-center py-2 rounded-md transition-colors opacity-50 cursor-not-allowed border",
          isLightTheme ? "text-[#222222] border-transparent" : "text-[#E2E2E2] border-transparent",
          depth > 0 && "text-sm",
          depth > 1 && "text-xs"
        )}
        style={getIndentationStyle(depth)}
        title={`${item.title} ${item.comingSoon ? "(Coming Soon)" : "(Disabled)"}`}
      >
        {Icon && (
          <Icon className={cn(
            "mr-3 flex-shrink-0",
            depth === 0 ? "h-5 w-5" : "h-4 w-4"
          )} />
        )}
        <span className="flex-1 truncate">{item.title}</span>
        {!collapsed && item.comingSoon && (
          <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">(Coming Soon)</span>
        )}
      </div>
    );
  }

  // Handle items without href
  if (!normalizedHref) {
    return (
      <div 
        className={cn(
          "group flex items-center py-2 rounded-md transition-colors border",
          isLightTheme ? "text-[#222222] border-transparent" : "text-[#E2E2E2] border-transparent",
          depth > 0 && "text-sm",
          depth > 1 && "text-xs"
        )}
        style={getIndentationStyle(depth)}
      >
        {Icon && (
          <Icon className={cn(
            "mr-3 flex-shrink-0",
            depth === 0 ? "h-5 w-5" : "h-4 w-4"
          )} />
        )}
        <span className="flex-1 truncate">{item.title}</span>
      </div>
    );
  }

  // Regular navigation link
  return (
    <Link
      to={normalizedHref}
      className={cn(
        "group flex items-center py-2 rounded-md transition-colors border",
        isActive(normalizedHref)
          ? isLightTheme 
            ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
            : "bg-black text-white border-primary"
          : isLightTheme ? "text-[#222222] border-transparent hover:bg-[#E9E7D8] hover:border-primary" 
            : "text-[#E2E2E2] border-transparent hover:bg-sidebar-accent",
        depth > 0 && "text-sm",
        depth > 1 && "text-xs"
      )}
      style={getIndentationStyle(depth)}
    >
      {Icon && (
        <Icon className={cn(
          "mr-3 flex-shrink-0",
          depth === 0 ? "h-5 w-5" : "h-4 w-4"
        )} />
      )}
      <span className="truncate">{item.title}</span>
    </Link>
  );
};

// Updated SidebarProps interface
interface SidebarProps {
  isLightTheme: boolean;
  collapsed: boolean;
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
  expandedSubmenus,
  toggleSubmenu,
  toggleTheme,
  onExpand,
  onCollapse
}) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { getCurrentRole, getCurrentClientTier, isDevMode } = useRoleContext();
  
  // Always use role-specific navigation - dev users see emulated role navigation
  const currentRole = getCurrentRole();
  const currentTier = getCurrentClientTier();
  const navigationItems = getRoleNavigation(currentRole, currentTier);

  const isActive = (href: string) => {
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

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
          <Link to="/">
            <h1 className={cn("font-bold transition-all", collapsed ? "text-xl" : "text-2xl")}>LOV</h1>
          </Link>
        </div>
        <div className="space-y-1 overflow-y-auto px-3">
          {navigationItems.map((item) => (
            <HierarchicalNavItem
              key={item.id || item.title}
              item={item}
              isActive={isActive}
              isLightTheme={isLightTheme}
              expandedSubmenus={expandedSubmenus}
              toggleSubmenu={toggleSubmenu}
              depth={0}
              collapsed={collapsed}
            />
          ))}
        </div>
      </div>
      <div className="p-3 flex items-center justify-between">
        <button 
          onClick={toggleTheme} 
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
          onClick={collapsed ? onExpand : onCollapse} 
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

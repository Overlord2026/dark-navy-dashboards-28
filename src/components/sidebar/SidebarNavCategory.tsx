
import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  toggleSubmenu: (id: string) => void;
}

interface SidebarNavItemProps {
  item: NavItem;
  isActive: (href: string) => boolean;
  isLightTheme: boolean;
  expandedSubmenus: Record<string, boolean>;
  toggleSubmenu: (id: string) => void;
  depth?: number;
  collapsed?: boolean;
}

// Recursive component for rendering nested navigation items
const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
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
  const itemExpanded = expandedSubmenus[item.title] || false;
  const indentLevel = Math.min(depth, 4); // Cap indentation at 4 levels
  const paddingLeft = collapsed ? "px-3" : `pl-${Math.max(3, 3 + indentLevel * 4)} pr-3`;

  if (collapsed && depth > 0) {
    return null; // Don't render nested items when sidebar is collapsed
  }

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <Collapsible
          open={itemExpanded}
          onOpenChange={() => toggleSubmenu(item.title)}
        >
          <CollapsibleTrigger asChild>
            <div className={cn(
              "group flex items-center w-full py-2 rounded-md transition-colors cursor-pointer border",
              paddingLeft,
              isActive(normalizedHref)
                ? isLightTheme 
                  ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
                  : "bg-black text-white border-primary"
                : isLightTheme ? "text-[#222222] border-transparent hover:bg-[#E9E7D8] hover:border-primary" 
                  : "text-[#E2E2E2] border-transparent hover:bg-sidebar-accent"
            )}>
              {Icon && <Icon className="h-5 w-5 mr-3 flex-shrink-0" />}
              <span className="flex-1">{item.title}</span>
              {!collapsed && (
                itemExpanded ? (
                  <ChevronDown className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 ml-2" />
                )
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-1">
            {item.children!.map((childItem) => (
              <SidebarNavItem
                key={childItem.title}
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

  if (item.comingSoon || item.disabled) {
    return (
      <div
        className={cn(
          "group flex items-center py-2 rounded-md transition-colors opacity-50 cursor-not-allowed border",
          paddingLeft,
          isLightTheme ? "text-[#222222] border-transparent" : "text-[#E2E2E2] border-transparent"
        )}
        title={`${item.title} ${item.comingSoon ? "(Coming Soon)" : "(Disabled)"}`}
      >
        {Icon && <Icon className="h-5 w-5 mr-3 flex-shrink-0" />}
        <span className="flex-1">{item.title}</span>
        {!collapsed && item.comingSoon && (
          <span className="text-xs text-muted-foreground">(Coming Soon)</span>
        )}
      </div>
    );
  }

  if (!normalizedHref) {
    return (
      <div className={cn(
        "group flex items-center py-2 rounded-md transition-colors border",
        paddingLeft,
        isLightTheme ? "text-[#222222] border-transparent" : "text-[#E2E2E2] border-transparent"
      )}>
        {Icon && <Icon className="h-5 w-5 mr-3 flex-shrink-0" />}
        <span className="flex-1">{item.title}</span>
      </div>
    );
  }

  return (
    <Link
      to={normalizedHref}
      className={cn(
        "group flex items-center py-2 rounded-md transition-colors border",
        paddingLeft,
        isActive(normalizedHref)
          ? isLightTheme 
            ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
            : "bg-black text-white border-primary"
          : isLightTheme ? "text-[#222222] border-transparent hover:bg-[#E9E7D8] hover:border-primary" 
            : "text-[#E2E2E2] border-transparent hover:bg-sidebar-accent"
      )}
    >
      {Icon && <Icon className="h-5 w-5 mr-3 flex-shrink-0" />}
      <span>{item.title}</span>
    </Link>
  );
};

const SidebarNavCategory: React.FC<SidebarNavCategoryProps> = ({
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
  if (collapsed) {
    return (
      <div className="flex flex-col items-center space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const normalizedHref = item.href ? (item.href.startsWith("/") ? item.href : `/${item.href}`) : "";
          
          if (item.comingSoon || item.disabled || !normalizedHref) {
            return (
              <div
                key={item.title}
                className={cn(
                  "group flex items-center justify-center w-8 h-8 p-2 rounded-md transition-colors opacity-50 cursor-not-allowed",
                  isLightTheme ? "text-[#222222]" : "text-[#E2E2E2]"
                )}
                title={`${item.title} ${item.comingSoon ? "(Coming Soon)" : item.disabled ? "(Disabled)" : ""}`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span className="sr-only">{item.title}</span>
              </div>
            );
          }

          return (
            <Link
              key={item.title}
              to={normalizedHref}
              className={cn(
                "group flex items-center justify-center w-8 h-8 p-2 rounded-md transition-colors border",
                isActive(normalizedHref)
                  ? isLightTheme 
                    ? "bg-[#E9E7D8] text-[#222222] border-primary" 
                    : "bg-black text-white border-primary"
                  : isLightTheme ? "text-[#222222] border-transparent hover:bg-[#E9E7D8] hover:border-primary" 
                    : "text-[#E2E2E2] border-transparent hover:bg-sidebar-accent"
              )}
              title={item.title}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span className="sr-only">{item.title}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={() => onToggle(id)}
    >
      <CollapsibleTrigger asChild>
        <div className={cn(
          "flex items-center justify-between w-full p-2 text-xs uppercase tracking-wider font-semibold cursor-pointer transition-colors",
          isLightTheme ? "text-[#222222]/70 hover:text-[#222222]" : "text-[#E2E2E2]/70 hover:text-[#E2E2E2]"
        )}>
          <span>{label}</span>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1">
        {items.map((item) => (
          <SidebarNavItem
            key={item.title}
            item={item}
            isActive={isActive}
            isLightTheme={isLightTheme}
            expandedSubmenus={expandedSubmenus}
            toggleSubmenu={toggleSubmenu}
            depth={0}
            collapsed={collapsed}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SidebarNavCategory;

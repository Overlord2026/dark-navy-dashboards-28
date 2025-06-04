
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
  toggleSubmenu: (itemTitle: string, e?: React.MouseEvent) => void;
}

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
  const normalizePath = (path: string): string => {
    return path.startsWith("/") ? path : `/${path}`;
  };

  const renderNavItem = (item: NavItem) => {
    const normalizedHref = normalizePath(item.href);
    
    const baseClasses = cn(
      "group flex items-center py-2 px-3 rounded-md transition-colors text-[14px] whitespace-nowrap border",
      isActive(normalizedHref)
        ? isLightTheme 
          ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
          : "bg-black text-[#E2E2E2] font-medium border-primary"
        : isLightTheme ? "text-[#222222] border-transparent" : "text-[#E2E2E2] border-transparent",
      isLightTheme ? "hover:bg-[#E9E7D8] hover:border-primary" : "hover:bg-sidebar-accent hover:border-primary",
      collapsed ? "justify-center px-2 my-2" : "justify-start",
      item.comingSoon ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
    );

    const content = (
      <>
        {item.icon && (
          <div className={cn("flex-shrink-0", !collapsed && "mr-3")}>
            <item.icon className="h-5 w-5" />
          </div>
        )}
        
        {!collapsed && (
          <span className="whitespace-nowrap overflow-hidden text-ellipsis">
            {item.title}
            {item.comingSoon && (
              <span className="ml-2 text-xs text-muted-foreground">(Coming Soon)</span>
            )}
          </span>
        )}
        {collapsed && <span className="sr-only">{item.title}</span>}
      </>
    );

    if (item.comingSoon) {
      return (
        <div
          key={item.title}
          className={baseClasses}
          title={collapsed ? `${item.title} (Coming Soon)` : undefined}
        >
          {content}
        </div>
      );
    }

    // Handle items with subitems
    if (item.items && item.items.length > 0) {
      const hasExpandedSubmenu = expandedSubmenus[item.title];
      
      return (
        <div key={item.title}>
          <Collapsible
            open={hasExpandedSubmenu}
            onOpenChange={() => toggleSubmenu(item.title)}
          >
            <CollapsibleTrigger asChild>
              <div className={cn(baseClasses, "cursor-pointer")}>
                {content}
                {!collapsed && (
                  hasExpandedSubmenu ? (
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  ) : (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 ml-6">
              {item.items.map((subItem) => (
                <Link
                  key={subItem.href}
                  to={normalizePath(subItem.href)}
                  className={cn(
                    "group flex items-center py-1 px-3 rounded-md transition-colors text-[13px] border",
                    isActive(normalizePath(subItem.href))
                      ? isLightTheme 
                        ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
                        : "bg-black text-[#E2E2E2] font-medium border-primary"
                      : isLightTheme ? "text-[#222222] border-transparent" : "text-[#E2E2E2] border-transparent",
                    isLightTheme ? "hover:bg-[#E9E7D8] hover:border-primary" : "hover:bg-sidebar-accent hover:border-primary"
                  )}
                >
                  {subItem.icon && <subItem.icon className="h-4 w-4 mr-2" />}
                  <span>{subItem.title}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      );
    }

    // Regular nav item without subitems
    return (
      <Link
        key={item.title}
        to={normalizedHref}
        className={baseClasses}
        title={collapsed ? item.title : undefined}
      >
        {content}
      </Link>
    );
  };

  return (
    <div className="mb-2">
      {!collapsed && (
        <Collapsible
          open={isExpanded}
          onOpenChange={() => onToggle(id)}
        >
          <CollapsibleTrigger asChild>
            <div className={`flex items-center justify-between p-2 text-xs uppercase tracking-wider font-semibold ${isLightTheme ? 'text-[#222222]/70' : 'text-[#E2E2E2]/70'} cursor-pointer`}>
              <span>{label}</span>
              <div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1.5">
            {items.map(renderNavItem)}
          </CollapsibleContent>
        </Collapsible>
      )}
      
      {collapsed && (
        <div className="flex flex-col items-center space-y-1">
          {items.map(renderNavItem)}
        </div>
      )}
    </div>
  );
};

export default SidebarNavCategory;

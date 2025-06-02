
import React from "react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NavItem } from "@/types/navigation";
import { Badge } from "@/components/ui/badge";

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
  // Helper to ensure consistent path handling
  const normalizePath = (path: string): string => {
    return path.startsWith("/") ? path : `/${path}`;
  };

  const renderNavItem = (item: NavItem) => {
    const normalizedHref = normalizePath(item.href);
    const isItemActive = isActive(normalizedHref);
    
    // If coming soon, render as non-clickable
    if (item.comingSoon) {
      return (
        <div
          className={cn(
            "group flex w-full items-center rounded-md px-3 py-2 text-sm outline-none cursor-not-allowed opacity-60",
            isLightTheme
              ? "text-[#222222] bg-muted/30"
              : "text-white bg-muted/20"
          )}
        >
          {item.icon && (
            <item.icon className="mr-2 h-4 w-4" />
          )}
          <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1">{item.title}</span>
          <Badge variant="secondary" className="ml-2 text-xs">
            Coming Soon
          </Badge>
        </div>
      );
    }
    
    return (
      <a
        href={normalizedHref}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noreferrer" : undefined}
        className={cn(
          "group flex w-full items-center rounded-md px-3 py-2 text-sm outline-none transition-colors",
          isLightTheme
            ? "hover:bg-[#E5E5E5] text-[#222222]"
            : "hover:bg-accent hover:text-accent-foreground",
          isItemActive &&
            (isLightTheme
              ? "bg-[#D8D8D8] text-foreground font-medium"
              : "bg-secondary text-secondary-foreground font-medium"),
          item.disabled && "cursor-not-allowed opacity-50"
        )}
        onClick={(e) => {
          if (item.items && item.items.length > 0) {
            e.preventDefault();
            toggleSubmenu(item.title);
          }
        }}
      >
        {item.icon && (
          <item.icon className="mr-2 h-4 w-4" />
        )}
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</span>
        {item.label && (
          <span className="ml-auto rounded-sm bg-secondary px-2 text-xs font-semibold text-secondary-foreground">
            {item.label}
          </span>
        )}
      </a>
    );
  };

  const renderSubNavItem = (subItem: NavItem, depth: number = 1) => {
    const normalizedHref = normalizePath(subItem.href);
    const isItemActive = isActive(normalizedHref);
    const paddingLeft = `${(depth + 1) * 1}rem`;

    // If coming soon, render as non-clickable
    if (subItem.comingSoon) {
      return (
        <div
          style={{ paddingLeft }}
          className={cn(
            "group flex w-full items-center rounded-md py-2 pr-3 text-sm outline-none cursor-not-allowed opacity-60",
            isLightTheme
              ? "text-[#222222] bg-muted/30"
              : "text-white bg-muted/20"
          )}
        >
          {subItem.icon && (
            <subItem.icon className="mr-2 h-4 w-4" />
          )}
          <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1">{subItem.title}</span>
          <Badge variant="secondary" className="ml-2 text-xs">
            Coming Soon
          </Badge>
        </div>
      );
    }

    return (
      <a
        href={normalizedHref}
        target={subItem.external ? "_blank" : undefined}
        rel={subItem.external ? "noreferrer" : undefined}
        style={{ paddingLeft }}
        className={cn(
          "group flex w-full items-center rounded-md py-2 pr-3 text-sm outline-none transition-colors",
          isLightTheme
            ? "hover:bg-[#E5E5E5] text-[#222222]"
            : "hover:bg-accent hover:text-accent-foreground",
          isItemActive &&
            (isLightTheme
              ? "bg-[#D8D8D8] text-foreground font-medium"
              : "bg-secondary text-secondary-foreground font-medium"),
          subItem.disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {subItem.icon && (
          <subItem.icon className="mr-2 h-4 w-4" />
        )}
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">{subItem.title}</span>
        {subItem.label && (
          <span className="ml-auto rounded-sm bg-secondary px-2 text-xs font-semibold text-secondary-foreground">
            {subItem.label}
          </span>
        )}
      </a>
    );
  };
  
  return (
    <div className="px-3 py-2">
      <Collapsible
        open={isExpanded}
        onOpenChange={() => onToggle(id)}
        className="space-y-1"
      >
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium",
              isLightTheme
                ? "hover:bg-[#E5E5E5] text-[#222222]"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {!collapsed ? (
              <>
                <span>{label}</span>
                <div className="ml-auto">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </>
            ) : (
              // When collapsed, still show a minimal indicator
              <div className="flex justify-center w-full">
                <span className="sr-only">{label}</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            )}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.href ? (
                renderNavItem(item)
              ) : (
                item.items && item.items.length > 0 ? (
                  <div className="space-y-1">
                    <Collapsible
                      open={!!expandedSubmenus[item.title]}
                      onOpenChange={() => toggleSubmenu(item.title)}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
                        <div className="flex items-center">
                          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                          <span>{item.title}</span>
                        </div>
                        {expandedSubmenus[item.title] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1">
                        {item.items.map((subItem, subIndex) => (
                          <React.Fragment key={subIndex}>
                            {subItem.href && renderSubNavItem(subItem)}
                            {subItem.items && subItem.items.length > 0 && (
                              <div className="space-y-1">
                                <Collapsible
                                  open={!!expandedSubmenus[subItem.title]}
                                  onOpenChange={() => toggleSubmenu(subItem.title)}
                                >
                                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2 pr-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground" style={{ paddingLeft: '2rem' }}>
                                    <div className="flex items-center">
                                      {subItem.icon && <subItem.icon className="mr-2 h-4 w-4" />}
                                      <span>{subItem.title}</span>
                                    </div>
                                    {expandedSubmenus[subItem.title] ? (
                                      <ChevronDown className="w-4 h-4" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4" />
                                    )}
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className="space-y-1">
                                    {subItem.items.map((nestedItem, nestedIndex) => (
                                      <React.Fragment key={nestedIndex}>
                                        {nestedItem.href && renderSubNavItem(nestedItem, 2)}
                                      </React.Fragment>
                                    ))}
                                  </CollapsibleContent>
                                </Collapsible>
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ) : null
              )}
            </React.Fragment>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default SidebarNavCategory;

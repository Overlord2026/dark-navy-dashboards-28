
import React from "react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
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
                  <div className="pl-4">
                    <Collapsible
                      open={!!expandedSubmenus[item.title]}
                      onOpenChange={() => toggleSubmenu(item.title)}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
                        <span>{item.title}</span>
                        {expandedSubmenus[item.title] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1">
                        {item.items.map((subItem, subIndex) => (
                          <React.Fragment key={subIndex}>
                            {subItem.href && renderNavItem(subItem)}
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

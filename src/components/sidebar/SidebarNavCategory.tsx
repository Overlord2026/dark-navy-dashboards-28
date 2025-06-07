
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
  console.log(`SidebarNavCategory ${id} - expandedSubmenus:`, expandedSubmenus);

  if (collapsed) {
    return (
      <div className="flex flex-col items-center space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const normalizedHref = item.href.startsWith("/") ? item.href : `/${item.href}`;
          
          if (item.comingSoon) {
            return (
              <div
                key={item.title}
                className={cn(
                  "group flex items-center justify-center w-8 h-8 p-2 rounded-md transition-colors opacity-50 cursor-not-allowed",
                  isLightTheme ? "text-[#222222]" : "text-[#E2E2E2]"
                )}
                title={`${item.title} (Coming Soon)`}
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
        {items.map((item) => {
          const Icon = item.icon;
          const normalizedHref = item.href.startsWith("/") ? item.href : `/${item.href}`;
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const submenuKey = `${id}-${item.title}`;
          const submenuExpanded = expandedSubmenus[submenuKey] || false;

          console.log(`Item ${item.title} - hasSubmenu: ${hasSubmenu}, submenuKey: ${submenuKey}, submenuExpanded: ${submenuExpanded}`);

          if (hasSubmenu) {
            return (
              <div key={item.title} className="space-y-1">
                <Collapsible
                  open={submenuExpanded}
                  onOpenChange={() => {
                    console.log(`Toggling submenu for key: ${submenuKey}`);
                    toggleSubmenu(submenuKey);
                  }}
                >
                  <CollapsibleTrigger asChild>
                    <div className={cn(
                      "group flex items-center w-full py-2 px-3 rounded-md transition-colors cursor-pointer border",
                      isActive(normalizedHref)
                        ? isLightTheme 
                          ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
                          : "bg-black text-white border-primary"
                        : isLightTheme ? "text-[#222222] border-transparent hover:bg-[#E9E7D8] hover:border-primary" 
                          : "text-[#E2E2E2] border-transparent hover:bg-sidebar-accent"
                    )}>
                      {Icon && <Icon className="h-5 w-5 mr-3 flex-shrink-0" />}
                      <span className="flex-1">{item.title}</span>
                      {submenuExpanded ? (
                        <ChevronDown className="h-4 w-4 ml-2" />
                      ) : (
                        <ChevronRight className="h-4 w-4 ml-2" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-6 space-y-1 mt-1">
                    {item.submenu!.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const subNormalizedHref = subItem.href.startsWith("/") ? subItem.href : `/${subItem.href}`;
                      
                      return (
                        <Link
                          key={subItem.title}
                          to={subNormalizedHref}
                          className={cn(
                            "group flex items-center py-2 px-3 rounded-md transition-colors text-sm border",
                            isActive(subNormalizedHref)
                              ? isLightTheme 
                                ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
                                : "bg-black text-white border-primary"
                              : isLightTheme ? "text-[#222222] border-transparent hover:bg-[#E9E7D8] hover:border-primary" 
                                : "text-[#E2E2E2] border-transparent hover:bg-sidebar-accent"
                          )}
                        >
                          {SubIcon && <SubIcon className="h-4 w-4 mr-3 flex-shrink-0" />}
                          <span>{subItem.title}</span>
                        </Link>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            );
          }

          if (item.comingSoon) {
            return (
              <div
                key={item.title}
                className={cn(
                  "group flex items-center py-2 px-3 rounded-md transition-colors opacity-50 cursor-not-allowed border",
                  isLightTheme ? "text-[#222222] border-transparent" : "text-[#E2E2E2] border-transparent"
                )}
                title={`${item.title} (Coming Soon)`}
              >
                {Icon && <Icon className="h-5 w-5 mr-3 flex-shrink-0" />}
                <span className="flex-1">{item.title}</span>
                <span className="text-xs text-muted-foreground">(Coming Soon)</span>
              </div>
            );
          }

          return (
            <Link
              key={item.title}
              to={normalizedHref}
              className={cn(
                "group flex items-center py-2 px-3 rounded-md transition-colors border",
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
        })}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SidebarNavCategory;

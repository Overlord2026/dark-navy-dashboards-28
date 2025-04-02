
import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NavItem } from "@/types/navigation";
import { cn } from "@/lib/utils";

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
  toggleSubmenu: (title: string, e: React.MouseEvent) => void;
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
    <div className="mb-4">
      {!collapsed && (
        <div 
          className={`flex items-center justify-between px-4 py-2 text-xs uppercase tracking-wider font-semibold cursor-pointer ${
            isLightTheme ? 'text-[#222222]/70' : 'text-white/70'
          }`}
          onClick={() => onToggle(id)}
        >
          <span>{label}</span>
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </div>
      )}
      
      {(isExpanded || collapsed) && (
        <div className="space-y-1 px-3">
          {items.map((item) => {
            const itemIsActive = isActive(item.href);
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const submenuIsExpanded = expandedSubmenus[item.title];
            
            return (
              <div key={item.href} className="group">
                <Link
                  to={hasSubmenu ? "#" : item.href}
                  className={cn(
                    "group flex items-center rounded-md py-2 px-3 text-sm transition-colors border whitespace-nowrap",
                    itemIsActive
                      ? isLightTheme
                        ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary"
                        : "bg-black text-white border-primary"
                      : isLightTheme
                        ? "text-[#222222] border-transparent hover:bg-[#E9E7D8] hover:border-primary"
                        : "text-white border-transparent hover:bg-sidebar-accent",
                    hasSubmenu && "justify-between"
                  )}
                  onClick={(e) => {
                    if (hasSubmenu) {
                      e.preventDefault();
                      toggleSubmenu(item.title, e);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <item.icon className={cn("h-5 w-5 flex-shrink-0", !collapsed && "mr-3")} />
                    {!collapsed && <span>{item.title}</span>}
                  </div>
                  
                  {!collapsed && hasSubmenu && (
                    submenuIsExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )
                  )}
                </Link>
                
                {!collapsed && hasSubmenu && submenuIsExpanded && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.submenu?.map((subItem) => (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        className={cn(
                          "flex items-center rounded-md py-1.5 px-3 text-sm transition-colors border border-transparent",
                          isActive(subItem.href)
                            ? isLightTheme
                              ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary"
                              : "bg-black text-white border-primary"
                            : isLightTheme
                              ? "text-[#222222] hover:bg-[#E9E7D8] hover:border-primary"
                              : "text-white hover:bg-sidebar-accent"
                        )}
                      >
                        <subItem.icon className="h-4 w-4 mr-2" />
                        <span>{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

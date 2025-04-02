
import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NavItem } from "@/types/navigation";
import { cn } from "@/lib/utils";
import { logger } from "@/services/logging/loggingService";

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
  hasActiveChild: (submenuItems: any[]) => boolean;
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
  toggleSubmenu,
  hasActiveChild
}) => {
  // Debug render to help track component updates
  React.useEffect(() => {
    logger.debug(`SidebarNavCategory "${id}" rendered`, { 
      isExpanded, 
      collapsed,
      items: items.map(i => i.title),
      expandedSubmenus
    }, "SidebarNavCategory");
  }, [id, isExpanded, collapsed, items, expandedSubmenus]);

  return (
    <div className="mb-4" data-sidebar-category={id} data-expanded={isExpanded}>
      {!collapsed && (
        <div 
          className={`flex items-center justify-between px-4 py-2 text-xs uppercase tracking-wider font-semibold cursor-pointer ${
            isLightTheme ? 'text-[#222222]/70' : 'text-white/70'
          }`}
          onClick={() => onToggle(id)}
          data-sidebar-category-header={id}
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
        <div className="space-y-1 px-3" data-sidebar-category-content={id}>
          {items.map((item) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            // Ensure boolean value with double negation
            const submenuIsExpanded = !!expandedSubmenus[item.title]; 
            
            // For items with submenu, check if any submenu item is active
            let itemIsActive = isActive(item.href);
            
            // Only check submenu items if this is a parent menu with submenus
            if (hasSubmenu) {
              const anySubmenuActive = hasActiveChild(item.submenu || []);
              // A parent menu with # href should only be considered active if a submenu item is active
              itemIsActive = item.href === "#" ? anySubmenuActive : itemIsActive || anySubmenuActive;
            }
            
            return (
              <div 
                key={item.title} 
                className="group mb-1 relative" 
                data-sidebar-item={item.title}
                data-has-submenu={hasSubmenu ? "true" : "false"}
                data-item-active={itemIsActive ? "true" : "false"}
              >
                {/* For items with submenu, we'll handle the click event to toggle submenu */}
                {hasSubmenu ? (
                  <div
                    className={cn(
                      "group flex items-center rounded-md py-2 px-3 text-sm transition-colors border whitespace-nowrap cursor-pointer",
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
                      logger.debug(`Submenu item clicked: ${item.title}`, 
                        { title: item.title, hasSubmenu }, "SidebarNavCategory");
                      toggleSubmenu(item.title, e);
                    }}
                    data-submenu-trigger={item.title}
                    data-item-title={item.title}
                    data-expanded={submenuIsExpanded ? "true" : "false"}
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
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "group flex items-center rounded-md py-2 px-3 text-sm transition-colors border whitespace-nowrap",
                      itemIsActive
                        ? isLightTheme
                          ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary"
                          : "bg-black text-white border-primary"
                        : isLightTheme
                          ? "text-[#222222] border-transparent hover:bg-[#E9E7D8] hover:border-primary"
                          : "text-white border-transparent hover:bg-sidebar-accent"
                    )}
                    data-item-link={item.title}
                  >
                    <div className="flex items-center">
                      <item.icon className={cn("h-5 w-5 flex-shrink-0", !collapsed && "mr-3")} />
                      {!collapsed && <span>{item.title}</span>}
                    </div>
                  </Link>
                )}
                
                {/* Render submenu with improved visibility and z-index */}
                {!collapsed && hasSubmenu && submenuIsExpanded && (
                  <div 
                    className="ml-8 mt-1 space-y-1 z-50 bg-inherit overflow-visible"
                    style={{
                      position: 'static', // Static position for proper layout flow
                      display: 'block',
                      opacity: 1,
                      width: '100%',
                      marginTop: '0.25rem',
                      paddingLeft: '0.5rem',
                    }}
                    data-submenu-content={item.title}
                    data-expanded="true"
                    data-submenu-visible="true"
                    data-parent-item={item.title}
                  >
                    {item.submenu?.map((subItem) => (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        className={cn(
                          "flex items-center rounded-md py-1.5 px-3 text-sm transition-colors border border-transparent w-full",
                          isActive(subItem.href)
                            ? isLightTheme
                              ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary"
                              : "bg-black text-white border-primary"
                            : isLightTheme
                              ? "text-[#222222] hover:bg-[#E9E7D8] hover:border-primary"
                              : "text-white hover:bg-sidebar-accent"
                        )}
                        data-submenu-item={subItem.title}
                        data-parent-menu={item.title}
                        data-active={isActive(subItem.href) ? "true" : "false"}
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

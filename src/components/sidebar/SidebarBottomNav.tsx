
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { logger } from "@/services/logging/loggingService";

interface SidebarBottomNavProps {
  items: NavItem[];
  collapsed: boolean;
  isActive: (href: string) => boolean;
  isLightTheme: boolean;
  expandedSubmenus?: Record<string, boolean>;
  toggleSubmenu?: (title: string, e: React.MouseEvent) => void;
  hasActiveChild?: (submenuItems: any[]) => boolean;
}

export const SidebarBottomNav: React.FC<SidebarBottomNavProps> = ({
  items,
  collapsed,
  isActive,
  isLightTheme,
  expandedSubmenus = {},
  toggleSubmenu,
  hasActiveChild = () => false
}) => {
  // Enhanced debugging - log when component renders and what submenu states are
  useEffect(() => {
    logger.debug("SidebarBottomNav rendered", {
      itemCount: items.length,
      expandedSubmenus: JSON.stringify(expandedSubmenus),
      collapsed,
      itemTitles: items.map(i => i.title)
    }, "SidebarBottomNav");
    
    // Special focus on Banking submenu
    const bankingItem = items.find(item => item.title === "Banking");
    if (bankingItem) {
      logger.debug("Banking item in BottomNav", {
        expanded: !!expandedSubmenus["Banking"],
        hasSubmenu: !!bankingItem.submenu && bankingItem.submenu.length > 0,
        submenuItems: bankingItem.submenu?.map(s => s.title).join(", ")
      }, "SidebarBottomNav");
    }
  }, [items, expandedSubmenus, collapsed]);

  return (
    <nav 
      className="space-y-1"
      data-sidebar-section="bottom-nav"
    >
      {items.map((item) => {
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const submenuIsExpanded = !!expandedSubmenus[item.title];
        
        // For items with submenu, check if any submenu item is active
        let itemIsActive = isActive(item.href);
        
        // Only check submenu items if this is a parent menu with submenus
        if (hasSubmenu) {
          const anySubmenuActive = hasActiveChild(item.submenu || []);
          // A parent menu with # href should only be considered active if a submenu item is active
          itemIsActive = item.href === "#" ? anySubmenuActive : itemIsActive || anySubmenuActive;
        }
        
        // Additional debugging for Banking item
        if (item.title === "Banking") {
          logger.debug(`Rendering Banking menu item`, {
            hasSubmenu,
            submenuIsExpanded,
            itemIsActive,
            submenuLength: item.submenu?.length || 0
          }, "SidebarBottomNav");
        }
        
        return (
          <div 
            key={item.title} 
            className="group relative" 
            data-bottom-nav-item={item.title}
            data-has-submenu={hasSubmenu ? "true" : "false"}
            data-active={itemIsActive ? "true" : "false"}
            data-expanded={submenuIsExpanded ? "true" : "false"}
          >
            {hasSubmenu && toggleSubmenu ? (
              <div
                className={cn(
                  "group flex items-center py-2 px-3 rounded-md transition-colors border",
                  itemIsActive
                    ? isLightTheme 
                      ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
                      : "bg-black text-white border-primary" 
                    : isLightTheme 
                      ? "text-[#222222] border-transparent hover:bg-[#E9E7D8] hover:border-primary" 
                      : "text-sidebar-foreground border-transparent hover:bg-sidebar-accent",
                  hasSubmenu && !collapsed && "justify-between",
                  "cursor-pointer"
                )}
                onClick={(e) => {
                  logger.debug(`Bottom nav submenu clicked: ${item.title}`, 
                    { title: item.title, hasSubmenu, currentlyExpanded: submenuIsExpanded }, "SidebarBottomNav");
                  toggleSubmenu(item.title, e);
                }}
                title={collapsed ? item.title : undefined}
                data-submenu-trigger={item.title}
                data-expanded={submenuIsExpanded ? "true" : "false"}
              >
                <div className="flex items-center">
                  <item.icon 
                    className={cn(
                      "h-5 w-5 flex-shrink-0", 
                      !collapsed && "mr-3"
                    )} 
                  />
                  {!collapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</span>}
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
                  "group flex items-center py-2 px-3 rounded-md transition-colors border",
                  itemIsActive
                    ? isLightTheme 
                      ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
                      : "bg-black text-white border-primary" 
                    : isLightTheme 
                      ? "text-[#222222] border-transparent hover:bg-[#E9E7D8] hover:border-primary" 
                      : "text-sidebar-foreground border-transparent hover:bg-sidebar-accent",
                )}
                title={collapsed ? item.title : undefined}
                data-bottom-nav-link={item.title}
                data-active={isActive(item.href) ? "true" : "false"}
              >
                <item.icon 
                  className={cn(
                    "h-5 w-5 flex-shrink-0", 
                    !collapsed && "mr-3"
                  )} 
                />
                {!collapsed && (
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</span>
                )}
              </Link>
            )}
            
            {/* Render submenu with improved visibility and z-index */}
            {!collapsed && hasSubmenu && submenuIsExpanded && (
              <div 
                className="ml-8 mt-1 space-y-1 z-50 overflow-visible"
                style={{
                  position: 'static', // Static position for proper layout flow
                  display: 'block',
                  opacity: 1,
                  width: '100%',
                  marginTop: '0.25rem',
                  paddingLeft: '0.5rem',
                  backgroundColor: isLightTheme ? '#F9F7E8' : '#1B1B32', // Match parent background
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
    </nav>
  );
};

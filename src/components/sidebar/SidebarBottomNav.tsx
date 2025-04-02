
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
    
    // Check for items with submenus in bottom nav
    const itemsWithSubmenus = items.filter(item => item.submenu && item.submenu.length > 0);
    if (itemsWithSubmenus.length > 0) {
      logger.debug("Bottom nav items with submenus", {
        count: itemsWithSubmenus.length,
        items: itemsWithSubmenus.map(i => ({
          title: i.title,
          expanded: !!expandedSubmenus[i.title],
          submenuCount: i.submenu?.length
        }))
      }, "BottomNavSubmenus");
    }
  }, [items, expandedSubmenus, collapsed]);
  
  const handleSubmenuToggle = (title: string, e: React.MouseEvent) => {
    logger.debug(`Bottom nav submenu toggle: ${title}`, {
      currentExpanded: expandedSubmenus[title] ? "yes" : "no",
    }, "BottomNavToggle");
    
    // Prevent default browser behavior
    e.preventDefault();
    e.stopPropagation();
    
    if (toggleSubmenu) {
      toggleSubmenu(title, e);
    }
  };

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
        
        // Additional debugging for items
        if (hasSubmenu) {
          logger.debug(`Rendering bottom nav item with submenu: ${item.title}`, {
            hasSubmenu,
            submenuIsExpanded,
            itemIsActive,
            submenuItems: item.submenu?.map(i => i.title).join(', ')
          }, "BottomNavRender");
        }
        
        return (
          <div 
            key={item.title} 
            className="group relative mb-1" 
            data-bottom-nav-item={item.title}
            data-has-submenu={hasSubmenu ? "true" : "false"}
            data-active={itemIsActive ? "true" : "false"}
            data-expanded={submenuIsExpanded ? "true" : "false"}
          >
            {hasSubmenu && toggleSubmenu ? (
              <button
                className={cn(
                  "group flex items-center py-2 px-3 rounded-md transition-colors border w-full",
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
                onClick={(e) => handleSubmenuToggle(item.title, e)}
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
              </button>
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
            
            {/* Enhanced submenu rendering with better visibility */}
            {!collapsed && hasSubmenu && submenuIsExpanded && (
              <div 
                className="ml-8 mt-1 space-y-1 bg-sidebar-accent/10 rounded-md p-1 z-50"
                style={{
                  display: 'block',
                  opacity: 1,
                  maxHeight: '500px',
                  width: '100%',
                  marginTop: '0.25rem',
                  paddingLeft: '0.5rem',
                  overflow: 'visible',
                  position: 'relative'
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

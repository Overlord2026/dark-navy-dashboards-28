
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
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
  expandedSubmenus?: Record<string, boolean>;
  toggleSubmenu?: (title: string, e: React.MouseEvent) => void;
  hasActiveChild?: (submenuItems: any[]) => boolean;
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
  expandedSubmenus = {},
  toggleSubmenu,
  hasActiveChild = () => false
}) => {
  // Enhanced logging for debugging
  useEffect(() => {
    logger.debug(`SidebarNavCategory ${id} render`, {
      categoryId: id,
      isExpanded,
      expandedSubmenus: JSON.stringify(expandedSubmenus),
      submenuItems: items.filter(item => item.submenu).map(item => item.title).join(', ')
    }, "SidebarCategory");
  }, [id, items, isExpanded, expandedSubmenus]);

  // Handle clicks on category headers
  const handleCategoryClick = () => {
    logger.debug(`Category header clicked: ${id}`, { 
      wasExpanded: isExpanded, 
      willBe: !isExpanded 
    }, "CategoryToggle");
    onToggle(id);
  };

  // Enhanced submenu toggle handler with extra logging
  const handleSubmenuToggle = (title: string, e: React.MouseEvent) => {
    logger.debug(`Submenu toggle clicked: ${title} in ${id}`, {
      categoryId: id,
      itemTitle: title,
      currentExpanded: expandedSubmenus[title] ? "yes" : "no",
    }, "SubmenuToggleClick");
    
    // Call the actual toggle function
    if (toggleSubmenu) {
      toggleSubmenu(title, e);
    }
  };

  return (
    <div 
      className="mb-4"
      data-sidebar-category={id}
      data-expanded={isExpanded ? "true" : "false"}
    >
      {/* Category Label */}
      {!collapsed && (
        <div 
          className={`flex items-center justify-between p-2 cursor-pointer ${isLightTheme ? 'text-[#222222]/70' : 'text-[#E2E2E2]/70'}`} 
          onClick={handleCategoryClick}
          data-category-header={id}
        >
          <span className="text-xs uppercase tracking-wider font-semibold">{label}</span>
          <div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        </div>
      )}
      
      {/* Category Items */}
      {(isExpanded || collapsed) && (
        <div 
          className="px-2 py-1 space-y-1"
          data-category-items={id}
        >
          {items.map((item) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const submenuIsExpanded = expandedSubmenus[item.title] === true;
            
            // For items with submenu, check if any submenu item is active
            let itemIsActive = isActive(item.href);
            
            // Only check submenu items if this is a parent menu with submenus
            if (hasSubmenu) {
              const anySubmenuActive = hasActiveChild(item.submenu || []);
              // A parent menu with # href should only be considered active if a submenu item is active
              itemIsActive = item.href === "#" ? anySubmenuActive : itemIsActive || anySubmenuActive;
            }
            
            // Additional logging for menu items with submenus
            if (hasSubmenu) {
              logger.debug(`Rendering menu item with submenu: ${item.title}`, {
                hasSubmenu,
                submenuIsExpanded,
                itemIsActive,
                submenuItems: item.submenu?.map(i => i.title).join(', ')
              }, "SidebarMenuRender");
            }
            
            return (
              <div 
                key={item.title} 
                className="group relative mb-1"
                data-nav-item={item.title}
                data-has-submenu={hasSubmenu ? "true" : "false"}
                data-active={itemIsActive ? "true" : "false"}
                data-submenu-expanded={submenuIsExpanded ? "true" : "false"}
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
                    data-nav-link={item.title}
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
                    className="ml-8 space-y-1 mt-1 relative bg-sidebar-accent/10 rounded-md p-1"
                    style={{
                      display: 'block',
                      opacity: 1,
                      maxHeight: '500px',
                      overflow: 'visible',
                      zIndex: 20,
                      position: 'relative'
                    }}
                    data-submenu-content={item.title}
                    data-expanded="true"
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

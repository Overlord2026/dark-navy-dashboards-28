
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  homeNavItems,
  educationSolutionsNavItems,
  familyWealthNavItems,
  collaborationNavItems,
  bottomNavItems 
} from "@/components/navigation/NavigationConfig.ts"; // Using the TS file
import { NavCategory } from "@/types/navigation";
import { useTheme } from "@/context/ThemeContext";
import { UserProfileSection } from "@/components/sidebar/UserProfileSection";
import { AdvisorSection } from "@/components/profile/AdvisorSection";
import { SidebarNavCategory } from "@/components/sidebar/SidebarNavCategory";
import { SidebarBottomNav } from "@/components/sidebar/SidebarBottomNav";
import { useSidebarState } from "@/hooks/useSidebarState";
import { logger } from "@/services/logging/loggingService";

/**
 * Main sidebar component for the application
 * This is the primary sidebar implementation used throughout the app
 */
export const Sidebar = () => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  
  const navigationCategories: NavCategory[] = [
    {
      id: "home",
      label: "HOME",
      items: homeNavItems,
      defaultExpanded: true
    },
    {
      id: "education-solutions",
      label: "EDUCATION & SOLUTIONS",
      items: educationSolutionsNavItems,
      defaultExpanded: true
    },
    {
      id: "family-wealth",
      label: "FAMILY WEALTH",
      items: familyWealthNavItems,
      defaultExpanded: true
    },
    {
      id: "collaboration",
      label: "COLLABORATION & SHARING",
      items: collaborationNavItems,
      defaultExpanded: true
    }
  ];

  const { 
    collapsed, 
    expandedCategories, 
    expandedSubmenus,
    forceUpdate,
    toggleSidebar, 
    toggleCategory, 
    toggleSubmenu, 
    expandSubmenu,
    collapseSubmenu,
    isActive,
    hasActiveChild,
    debugState,
    setForceUpdate
  } = useSidebarState(navigationCategories);

  // Debug logging on mount and when state changes
  useEffect(() => {
    logger.debug("Sidebar component rendered", {
      expandedSubmenus: JSON.stringify(expandedSubmenus),
      expandedCategories: JSON.stringify(expandedCategories),
      collapsed,
      forceUpdate
    }, "SidebarComponent");
    
    // Log all items with submenus for debugging
    navigationCategories.forEach(category => {
      category.items.forEach(item => {
        if (item.submenu && item.submenu.length > 0) {
          logger.debug(`Menu item with submenu: ${item.title}`, {
            categoryId: category.id,
            isExpanded: expandedSubmenus[item.title] ? "yes" : "no",
            submenuItems: item.submenu.map(i => i.title).join(', ')
          }, "MenuItemsWithSubmenus");
        }
      });
    });

    // Check for Banking and Collaboration menus specifically
    const bankingItem = familyWealthNavItems.find(item => item.title === "Banking");
    if (bankingItem) {
      logger.debug("Banking menu state", {
        hasSubmenu: !!bankingItem.submenu && bankingItem.submenu.length > 0,
        submenuItems: bankingItem.submenu?.map(s => s.title).join(", "),
        expanded: !!expandedSubmenus["Banking"],
        href: bankingItem.href
      }, "BankingMenuDebug");
    }
    
  }, [expandedSubmenus, expandedCategories, collapsed, forceUpdate, navigationCategories]);

  // Helper function to toggle a specific submenu
  const toggleSpecificSubmenu = (submenuTitle: string) => {
    const mockEvent = { 
      preventDefault: () => {}, 
      stopPropagation: () => {} 
    } as React.MouseEvent;
    
    logger.debug(`Manual toggle for ${submenuTitle} menu`, {
      currentState: expandedSubmenus[submenuTitle] ? "expanded" : "collapsed"
    }, "ManualSubmenuToggle");
    
    toggleSubmenu(submenuTitle, mockEvent);
  };

  // Force expand a specific submenu
  const forceExpandSubmenu = (submenuTitle: string) => {
    expandSubmenu(submenuTitle);
  };

  // Force collapse a specific submenu
  const forceCollapseSubmenu = (submenuTitle: string) => {
    collapseSubmenu(submenuTitle);
  };

  const advisorInfo = {
    name: "Daniel Zamora",
    title: "Senior Financial Advisor",
    email: "Daniel@awmfl.com",
    phone: "(555) 123-4567",
    location: "Sarasota, FL",
    office: "Sarasota Office",
    bio: "Daniel has over 15 years of experience in wealth management and financial planning."
  };

  const handleBookSession = () => {
    logger.debug("Book session clicked", {}, "Sidebar");
  };

  const handleViewProfile = (tabId: string) => {
    logger.debug("View profile tab clicked", { tabId }, "Sidebar");
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out z-50",
        collapsed ? "w-[70px]" : "w-[240px]",
        isLightTheme ? "bg-[#F9F7E8] border-[#DCD8C0]" : "bg-[#1B1B32] border-white/10"
      )}
      data-sidebar="main-sidebar"
      data-collapsed={collapsed ? "true" : "false"}
      data-theme={isLightTheme ? "light" : "dark"}
      data-force-update={forceUpdate} // Add key to force remount when needed
    >
      <div 
        className="py-4 overflow-y-auto flex-1"
        data-sidebar-content="main"
      >
        <div 
          className={`px-4 ${isLightTheme ? 'border-[#DCD8C0]' : 'border-white/10'} mt-2 mb-4`}
          data-sidebar-section="user-profile"
        >
          <UserProfileSection showLogo={false} />
        </div>

        {navigationCategories.map((category) => (
          <SidebarNavCategory
            key={category.id}
            id={category.id}
            label={category.label}
            items={category.items}
            isExpanded={expandedCategories[category.id]}
            onToggle={toggleCategory}
            collapsed={collapsed}
            isActive={isActive}
            isLightTheme={isLightTheme}
            expandedSubmenus={expandedSubmenus}
            toggleSubmenu={toggleSubmenu}
            hasActiveChild={hasActiveChild}
          />
        ))}
        
        {/* Enhanced debug panel for menu testing */}
        {!collapsed && (
          <div className="px-3 mt-4 space-y-2">
            <h4 className="text-xs font-semibold px-2 text-gray-500">MENU DEBUG PANEL</h4>
            
            {/* Banking submenu debug buttons */}
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleSpecificSubmenu("Banking")}
                className={cn(
                  "flex-1 text-xs", 
                  isLightTheme 
                    ? "border-primary bg-[#E9E7D8] text-[#222222] hover:bg-[#DCD8C0]" 
                    : "border-primary bg-black text-white hover:bg-sidebar-accent"
                )}
                data-menu-toggle="Banking"
              >
                {expandedSubmenus["Banking"] ? "Close" : "Open"} Banking
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => forceExpandSubmenu("Banking")}
                className={cn(
                  "flex-1 text-xs", 
                  isLightTheme 
                    ? "border-green-500 bg-green-100 text-green-800 hover:bg-green-200" 
                    : "border-green-500 bg-green-900/20 text-green-400 hover:bg-green-900/30"
                )}
                data-menu-expand="Banking"
              >
                Force Expand
              </Button>
            </div>
            
            {/* Collaboration submenu debug buttons */}
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleCategory("collaboration")}
                className={cn(
                  "flex-1 text-xs", 
                  isLightTheme 
                    ? "border-primary bg-[#E9E7D8] text-[#222222] hover:bg-[#DCD8C0]" 
                    : "border-primary bg-black text-white hover:bg-sidebar-accent"
                )}
                data-category-toggle="collaboration"
              >
                {expandedCategories["collaboration"] ? "Close" : "Open"} Collab
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => setForceUpdate(prev => prev + 1)}
                className={cn(
                  "flex-1 text-xs", 
                  isLightTheme 
                    ? "border-blue-500 bg-blue-100 text-blue-800 hover:bg-blue-200" 
                    : "border-blue-500 bg-blue-900/20 text-blue-400 hover:bg-blue-900/30"
                )}
                data-force-update="trigger"
              >
                Force Update
              </Button>
            </div>
            
            {/* State debug button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const state = debugState();
                logger.debug("Sidebar state debug", state, "SidebarStateDebug");
              }}
              className={cn(
                "w-full text-xs", 
                isLightTheme 
                  ? "border-primary bg-[#E9E7D8] text-[#222222] hover:bg-[#DCD8C0]" 
                  : "border-primary bg-black text-white hover:bg-sidebar-accent"
              )}
              data-debug="state"
            >
              Log Menu State
            </Button>
          </div>
        )}
      </div>

      <div 
        className="p-2 border-t mt-auto" 
        style={{ borderColor: isLightTheme ? '#DCD8C0' : 'rgba(255,255,255,0.1)' }}
        data-sidebar-section="footer"
      >
        <div 
          className={`px-2 mb-3 ${isLightTheme ? 'border-[#DCD8C0]' : 'border-white/10'}`}
          data-sidebar-section="advisor"
        >
          <AdvisorSection 
            advisorInfo={advisorInfo} 
            onViewProfile={handleViewProfile} 
            onBookSession={handleBookSession} 
            collapsed={collapsed} 
          />
        </div>

        <SidebarBottomNav 
          items={bottomNavItems}
          collapsed={collapsed}
          isActive={isActive}
          isLightTheme={isLightTheme}
          expandedSubmenus={expandedSubmenus}
          toggleSubmenu={toggleSubmenu}
          hasActiveChild={hasActiveChild}
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 -right-4 h-8 w-8 rounded-full bg-background border border-gray-700 text-foreground hover:bg-accent hover:text-sidebar-primary-foreground"
        onClick={toggleSidebar}
        data-sidebar-toggle="main"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRightIcon className="h-4 w-4" />
        ) : (
          <ChevronLeftIcon className="h-4 w-4" />
        )}
      </Button>
    </aside>
  );
};

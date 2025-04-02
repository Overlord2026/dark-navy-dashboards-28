
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
 * 
 * NOTE: There is another sidebar implementation in `src/components/ui/sidebar-new.tsx` which
 * is a more generic implementation based on shadcn/ui. That component could eventually replace
 * this one for better consistency, but both are kept for now to avoid breaking changes.
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
    isActive,
    hasActiveChild 
  } = useSidebarState(navigationCategories);

  // Enhanced diagnostic logging that runs on every state change
  useEffect(() => {
    logger.debug("Sidebar state diagnostic", {
      expandedSubmenus: JSON.stringify(expandedSubmenus),
      expandedCategories: JSON.stringify(expandedCategories),
      collapsed,
      forceUpdate
    }, "Sidebar");
    
    // Check specifically for Banking submenu
    const bankingItem = familyWealthNavItems.find(item => item.title === "Banking");
    if (bankingItem) {
      logger.debug("Banking submenu state", {
        title: bankingItem.title,
        href: bankingItem.href,
        hasSubmenu: !!bankingItem.submenu && bankingItem.submenu.length > 0,
        submenuExpanded: !!expandedSubmenus["Banking"],
        submenuItems: bankingItem.submenu?.map(item => ({
          title: item.title,
          href: item.href,
          isActive: isActive(item.href)
        }))
      }, "Sidebar");
    }
  }, [expandedSubmenus, expandedCategories, collapsed, forceUpdate, familyWealthNavItems, isActive]);

  // Test function to manually toggle Banking submenu
  const handleBankingClick = () => {
    const mockEvent = { 
      preventDefault: () => {}, 
      stopPropagation: () => {} 
    } as React.MouseEvent;
    
    logger.debug("Manually toggling Banking menu", {
      currentState: expandedSubmenus["Banking"] ? "expanded" : "collapsed"
    }, "BankingToggle");
    
    toggleSubmenu("Banking", mockEvent);
    
    // Log state after toggling
    setTimeout(() => {
      logger.debug("Banking menu state after toggle", {
        nowExpanded: expandedSubmenus["Banking"] ? "yes" : "no"
      }, "BankingToggle");
    }, 100);
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

  // Check if any banking submenu item is active
  const isBankingActive = () => {
    const bankingItem = familyWealthNavItems.find(item => item.title === "Banking");
    if (bankingItem && bankingItem.submenu) {
      return hasActiveChild(bankingItem.submenu);
    }
    return false;
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
        
        {/* Test button for Banking submenu */}
        {!collapsed && (
          <div className="px-3 mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleBankingClick}
              className={cn(
                "w-full text-xs", 
                isLightTheme 
                  ? "border-primary bg-[#E9E7D8] text-[#222222] hover:bg-[#DCD8C0]" 
                  : "border-primary bg-black text-white hover:bg-sidebar-accent"
              )}
              data-banking-toggle="test"
            >
              {expandedSubmenus["Banking"] ? "Close" : "Open"} Banking Menu
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

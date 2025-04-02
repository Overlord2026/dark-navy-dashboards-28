
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
    toggleSidebar, 
    toggleCategory, 
    toggleSubmenu, 
    isActive,
    hasActiveChild 
  } = useSidebarState(navigationCategories);

  // Enhanced diagnostic logging
  useEffect(() => {
    console.log("=== SIDEBAR STATE DIAGNOSTIC ===");
    console.log("Current expandedSubmenus state:", expandedSubmenus);
    console.log("Family wealth expanded:", expandedCategories["family-wealth"]);
    
    // Check specifically for Banking submenu
    const bankingItem = familyWealthNavItems.find(item => item.title === "Banking");
    if (bankingItem) {
      console.log("Banking item config:", {
        title: bankingItem.title,
        href: bankingItem.href,
        hasSubmenu: !!bankingItem.submenu && bankingItem.submenu.length > 0,
        submenuExpanded: !!expandedSubmenus["Banking"]
      });
    } else {
      console.log("Banking item not found in familyWealthNavItems");
    }
  }, [expandedSubmenus, expandedCategories, familyWealthNavItems]);

  // Add debugging click handler to help diagnose Banking menu issues
  const handleManualBankingToggle = () => {
    const bankingItem = familyWealthNavItems.find(item => item.title === "Banking");
    if (bankingItem) {
      const mockEvent = { preventDefault: () => {}, stopPropagation: () => {} } as React.MouseEvent;
      console.log("Manually toggling Banking submenu");
      toggleSubmenu("Banking", mockEvent);
    }
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
    console.log("Book session clicked");
  };

  const handleViewProfile = (tabId: string) => {
    console.log("View profile tab:", tabId);
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out z-50",
        collapsed ? "w-[70px]" : "w-[240px]",
        isLightTheme ? "bg-[#F9F7E8] border-[#DCD8C0]" : "bg-[#1B1B32] border-white/10"
      )}
    >
      <div className="py-4 overflow-y-auto flex-1">
        <div className={`px-4 ${isLightTheme ? 'border-[#DCD8C0]' : 'border-white/10'} mt-2 mb-4`}>
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
        
        {/* Debugging button - will be hidden in production */}
        {process.env.NODE_ENV !== 'production' && !collapsed && (
          <div className="px-3 mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleManualBankingToggle}
              className="w-full text-xs"
            >
              Debug: Toggle Banking Menu
            </Button>
          </div>
        )}
      </div>

      <div className="p-2 border-t mt-auto" style={{ borderColor: isLightTheme ? '#DCD8C0' : 'rgba(255,255,255,0.1)' }}>
        <div className={`px-2 mb-3 ${isLightTheme ? 'border-[#DCD8C0]' : 'border-white/10'}`}>
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
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 -right-4 h-8 w-8 rounded-full bg-background border border-gray-700 text-foreground hover:bg-accent hover:text-sidebar-primary-foreground"
        onClick={toggleSidebar}
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

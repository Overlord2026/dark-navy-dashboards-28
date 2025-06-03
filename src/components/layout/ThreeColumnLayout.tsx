
import { ReactNode, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserProfileSection } from "@/components/sidebar/UserProfileSection";
import { Header } from "@/components/ui/Header";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { AdvisorSection } from "@/components/profile/AdvisorSection";
import { NavigationCategory } from "./NavigationCategory";
import { SecondaryNavigation } from "./SecondaryNavigation";
import { navigationCategories } from "@/components/navigation/NavigationRegistry";
import { getSecondaryMenuItems } from "./navigationData";

interface ThreeColumnLayoutProps {
  children: ReactNode;
  title?: string;
  activeMainItem?: string;
  activeSecondaryItem?: string;
  secondaryMenuItems?: { id: string; label?: string; name?: string; active?: boolean }[];
  breadcrumbs?: { name: string; href: string; active?: boolean }[];
}

export function ThreeColumnLayout({ 
  children, 
  title = "Dashboard", 
  activeMainItem = "home",
  activeSecondaryItem = "",
  secondaryMenuItems,
  breadcrumbs
}: ThreeColumnLayoutProps) {
  const [mainSidebarCollapsed, setMainSidebarCollapsed] = useState(false);
  const [secondarySidebarCollapsed, setSecondarySidebarCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    navigationCategories.reduce((acc, category) => {
      acc[category.id] = category.defaultExpanded ?? true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const handleBookSession = () => {
    console.log("Book session clicked");
  };

  const handleViewProfile = (tabId: string) => {
    console.log("View profile tab:", tabId);
  };

  const { theme } = useTheme();
  const { userProfile } = useUser();
  
  const params = useParams();
  const location = useLocation();
  
  const sectionId = params.sectionId || activeSecondaryItem;
  
  let currentActiveMainItem = activeMainItem;
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  if (pathSegments.includes('alternative')) {
    const categoryId = pathSegments[pathSegments.length - 1];
    if (['private-equity', 'private-debt', 'real-assets', 'digital-assets'].includes(categoryId)) {
      currentActiveMainItem = categoryId;
    }
  }
  
  const menuItems = secondaryMenuItems || getSecondaryMenuItems(currentActiveMainItem);
  
  const isMainInvestmentsPage = location.pathname === "/investments";
  const isEducationPage = location.pathname === "/client-education" || location.pathname.startsWith("/client-education");
  
  const hasSecondaryMenu = !isMainInvestmentsPage && !isEducationPage && menuItems.length > 0;
  
  const isLightTheme = theme === "light";
  const isHomePage = location.pathname === "/";
  const isDashboardPage = location.pathname === "/client-dashboard";
  const isLegacyVaultPage = location.pathname === "/client-legacy-vault";

  const getCurrentPath = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) return 'home';
    
    if (pathSegments.includes('tax-planning')) {
      return 'tax-planning';
    }
    
    return pathSegments[0];
  };

  const currentPath = getCurrentPath();

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleProfileMenuItemClick = (itemId: string) => {
    console.log(`Profile menu item clicked in layout: ${itemId}`);
  };

  return (
    <div className={cn(
      "flex flex-col h-screen overflow-hidden",
      "bg-background text-foreground"
    )}>
      <div className="w-full flex justify-center items-center py-1 border-b border-border z-50 bg-background sticky top-0">
        <Header />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={cn(
            "flex flex-col transition-all duration-300 ease-in-out z-30 bg-sidebar-background border-r border-sidebar-border",
            mainSidebarCollapsed ? "w-[70px]" : "w-[280px]"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="px-4 border-sidebar-border mt-2 mb-2">
              <UserProfileSection onMenuItemClick={handleProfileMenuItemClick} showLogo={false} />
            </div>
            
            <div className="overflow-y-auto mt-0 flex-1">
              <nav className="px-2 space-y-1">
                {navigationCategories.map((category) => (
                  <NavigationCategory
                    key={category.id}
                    category={category}
                    isExpanded={expandedCategories[category.id]}
                    toggleCategory={toggleCategory}
                    currentPath={currentPath}
                    isCollapsed={mainSidebarCollapsed}
                    isLightTheme={isLightTheme}
                  />
                ))}
              </nav>
            </div>
            
            <div className="px-4 mt-auto mb-3 border-sidebar-border">
              <AdvisorSection 
                onViewProfile={handleViewProfile} 
                onBookSession={handleBookSession} 
                collapsed={mainSidebarCollapsed} 
              />
            </div>
          </div>
        </aside>

        {hasSecondaryMenu && (
          <SecondaryNavigation 
            hasSecondaryMenu={hasSecondaryMenu}
            secondarySidebarCollapsed={secondarySidebarCollapsed}
            isLightTheme={isLightTheme}
            activeMainItem={currentActiveMainItem}
            sectionId={sectionId}
            menuItems={menuItems}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          {isHomePage ? (
            <div className="flex flex-col items-center w-full">
            </div>
          ) : null}
          
          <main className="flex-1 overflow-y-auto p-3 font-sans w-full">
            {!isDashboardPage && !isLegacyVaultPage && (
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

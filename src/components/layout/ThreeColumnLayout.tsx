
import { ReactNode, useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserProfileSection } from "@/components/sidebar/UserProfileSection";
import { Header } from "@/components/ui/Header";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { AdvisorSection } from "@/components/profile/AdvisorSection";
import { NavigationCategory } from "./NavigationCategory";
import { SecondaryNavigation } from "./SecondaryNavigation";
import { navigationCategories } from "@/components/navigation/NavigationRegistry";
import { getSecondaryMenuItems } from "./navigationData";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    navigationCategories.reduce((acc, category) => {
      acc[category.id] = category.defaultExpanded ?? true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const isMobile = useIsMobile();

  // Close mobile menu when route changes
  const location = useLocation();
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const handleBookSession = () => {
    console.log("Book session clicked");
  };

  const handleViewProfile = (tabId: string) => {
    console.log("View profile tab:", tabId);
  };

  const { theme } = useTheme();
  const { userProfile } = useAuth();
  
  const params = useParams();
  
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

  // Sidebar Content Component
  const SidebarContent = () => (
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
              isCollapsed={mainSidebarCollapsed && !isMobile}
              isLightTheme={isLightTheme}
            />
          ))}
        </nav>
      </div>
      
      <div className="px-4 mt-auto mb-3 border-sidebar-border">
        <AdvisorSection 
          onViewProfile={handleViewProfile} 
          onBookSession={handleBookSession} 
          collapsed={mainSidebarCollapsed && !isMobile} 
        />
      </div>
    </div>
  );

  return (
    <div className={cn(
      "flex flex-col h-screen overflow-hidden",
      "bg-background text-foreground"
    )}>
      <div className="w-full flex justify-center items-center py-1 border-b border-border z-50 bg-background sticky top-0">
        {isMobile && (
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-50">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 p-0 hover:bg-accent focus:bg-accent active:bg-accent touch-manipulation"
                  aria-label="Toggle navigation menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className="w-[280px] p-0 bg-sidebar-background border-sidebar-border"
              >
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>
        )}
        <Header />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside
            className={cn(
              "flex flex-col transition-all duration-300 ease-in-out z-30 bg-sidebar-background border-r border-sidebar-border",
              mainSidebarCollapsed ? "w-[70px]" : "w-[280px]"
            )}
          >
            <SidebarContent />
          </aside>
        )}

        {/* Secondary Navigation for Desktop */}
        {!isMobile && hasSecondaryMenu && (
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
          
          <main className={cn(
            "flex-1 overflow-y-auto font-sans w-full",
            isMobile ? "p-4" : "p-3"
          )}>
            {!isDashboardPage && !isLegacyVaultPage && title && (
              <div className="flex justify-between items-center mb-4">
                <h1 className={cn(
                  "font-bold text-foreground",
                  isMobile ? "text-xl" : "text-2xl"
                )}>{title}</h1>
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

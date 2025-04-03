
import { ReactNode, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserProfileSection } from "@/components/sidebar/UserProfileSection";
import { Header } from "@/components/ui/Header";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { TutorialButton } from "@/components/navigation/TutorialButton";
import { AdvisorSection } from "@/components/profile/AdvisorSection";
import { NavigationCategory } from "./NavigationCategory";
import { SecondaryNavigation } from "./SecondaryNavigation";
import { navigationCategories, getSecondaryMenuItems } from "./navigationData";

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
      acc[category.id] = category.defaultExpanded ?? false;
      return acc;
    }, {} as Record<string, boolean>)
  );
  
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
    // This would typically open a booking calendar or external link
  };

  const handleViewProfile = (tabId: string) => {
    console.log("View profile tab:", tabId);
    // Navigate to advisor profile or open a modal
  };

  const { theme } = useTheme();
  const { userProfile } = useUser();
  
  const params = useParams();
  const location = useLocation();
  
  const sectionId = params.sectionId || activeSecondaryItem;
  
  const menuItems = secondaryMenuItems || getSecondaryMenuItems(activeMainItem);
  
  const hasSecondaryMenu = menuItems.length > 0;
  const isLightTheme = theme === "light";
  const isHomePage = location.pathname === "/";

  const getCurrentPath = () => {
    const path = location.pathname.split('/')[1];
    return path === '' ? 'home' : path;
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
    <div className={`flex flex-col h-screen overflow-hidden ${isLightTheme ? 'bg-[#F9F7E8]' : 'bg-[#12121C]'}`}>
      <div className="w-full flex justify-center items-center py-2 border-b z-50 bg-inherit sticky top-0" style={{ borderColor: isLightTheme ? '#DCD8C0' : 'rgba(255,255,255,0.1)' }}>
        <Header />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main Sidebar */}
        <aside
          className={cn(
            "flex flex-col transition-all duration-300 ease-in-out z-30",
            mainSidebarCollapsed ? "w-[70px]" : "w-[220px]",
            isLightTheme ? "bg-[#F9F7E8] border-r border-[#DCD8C0]" : "bg-[#1B1B32] border-r border-white/10"
          )}
        >
          <div className="flex flex-col h-full">
            <div className={`px-4 ${isLightTheme ? 'border-[#DCD8C0]' : 'border-white/10'} mt-2 mb-2`}>
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
            
            <div className={`px-4 mt-auto mb-3 ${isLightTheme ? 'border-[#DCD8C0]' : 'border-white/10'}`}>
              <AdvisorSection 
                advisorInfo={advisorInfo} 
                onViewProfile={handleViewProfile} 
                onBookSession={handleBookSession} 
                collapsed={mainSidebarCollapsed} 
              />
            </div>
          </div>
        </aside>

        {/* Secondary Sidebar */}
        <SecondaryNavigation 
          hasSecondaryMenu={hasSecondaryMenu}
          secondarySidebarCollapsed={secondarySidebarCollapsed}
          isLightTheme={isLightTheme}
          activeMainItem={activeMainItem}
          sectionId={sectionId}
          menuItems={menuItems}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {isHomePage ? (
            <div className="flex flex-col items-center w-full">
            </div>
          ) : null}
          
          <main className="flex-1 overflow-y-auto p-3 font-sans w-full">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">{title}</h1>
              <TutorialButton tabId={currentPath} size="default" variant="default" />
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

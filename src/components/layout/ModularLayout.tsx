
import { ReactNode, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserProfileSection } from "@/components/sidebar/UserProfileSection";
import { Header } from "@/components/ui/Header";
import { useTheme } from "@/context/ThemeContext";
import { AdvisorSection } from "@/components/profile/AdvisorSection";
import { MainNavigation } from "@/components/navigation/MainNavigation";
import { SubNavigation } from "@/components/navigation/SubNavigation";
import { NavSubItem } from "@/components/navigation/NavigationConfig";

interface ModularLayoutProps {
  children: ReactNode;
  title?: string;
  activeMainItem?: string;
  activeSecondaryItem?: string;
  secondaryMenuItems?: NavSubItem[];
  breadcrumbs?: { name: string; href: string; active?: boolean }[];
}

export function ModularLayout({ 
  children, 
  title = "Dashboard", 
  activeMainItem = "home",
  activeSecondaryItem = "",
  secondaryMenuItems,
  breadcrumbs
}: ModularLayoutProps) {
  const [mainSidebarCollapsed, setMainSidebarCollapsed] = useState(false);
  const [secondarySidebarCollapsed, setSecondarySidebarCollapsed] = useState(false);
  
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

  const { theme } = useTheme();
  
  const params = useParams();
  const location = useLocation();
  
  const sectionId = params.sectionId || activeSecondaryItem;
  
  const isLightTheme = theme === "light";
  const isHomePage = location.pathname === "/";

  const getCurrentPath = () => {
    const path = location.pathname.split('/')[1];
    return path === '' ? 'home' : path;
  };

  const currentPath = getCurrentPath();

  const toggleMainSidebar = () => {
    setMainSidebarCollapsed(!mainSidebarCollapsed);
  };

  const toggleSecondarySidebar = () => {
    setSecondarySidebarCollapsed(!secondarySidebarCollapsed);
  };

  const handleProfileMenuItemClick = (itemId: string) => {
    console.log(`Profile menu item clicked in layout: ${itemId}`);
  };

  const hasSecondaryMenu = secondaryMenuItems ? secondaryMenuItems.length > 0 : false;

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
              <MainNavigation collapsed={mainSidebarCollapsed} />
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

          {/* Toggle button for main sidebar */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 -right-4 h-8 w-8 rounded-full bg-background border border-gray-700 text-foreground hover:bg-accent hover:text-sidebar-primary-foreground"
            onClick={toggleMainSidebar}
          >
            {mainSidebarCollapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4" />
            )}
          </Button>
        </aside>

        {/* Secondary Sidebar */}
        {hasSecondaryMenu && (
          <aside
            className={cn(
              "flex flex-col transition-all duration-300 ease-in-out z-20",
              secondarySidebarCollapsed ? "w-[0px]" : "w-[200px]",
              isLightTheme ? "bg-[#F9F7E8] border-r border-[#DCD8C0]" : "bg-[#1B1B32] border-r border-sidebar-border"
            )}
          >
            <div className={`flex items-center h-[70px] px-6 border-b ${isLightTheme ? 'border-[#DCD8C0]' : 'border-sidebar-border'}`}>
              {!secondarySidebarCollapsed && (
                <span className={`font-medium truncate ${isLightTheme ? 'text-[#222222]' : 'text-[#E2E2E2]'}`}>Sections</span>
              )}
            </div>

            {!secondarySidebarCollapsed && (
              <SubNavigation 
                activeMainItem={activeMainItem}
                activeSecondaryItem={sectionId}
                customItems={secondaryMenuItems}
              />
            )}
          </aside>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {isHomePage ? (
            <div className="flex flex-col items-center w-full">
            </div>
          ) : null}
          
          <main className="flex-1 overflow-y-auto p-3 font-sans w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

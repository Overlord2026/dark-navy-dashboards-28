
import { ReactNode, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/ui/Header";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { SecondaryNavigation } from "./SecondaryNavigation";
import { getSecondaryMenuItems } from "./navigationData";
import { NavBar } from "@/components/navigation/NavBar";

export interface ThreeColumnLayoutProps {
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
  const [secondarySidebarCollapsed, setSecondarySidebarCollapsed] = useState(false);

  const { theme } = useTheme();
  const { userProfile } = useUser();
  
  const params = useParams();
  const location = useLocation();
  
  const sectionId = params.sectionId || activeSecondaryItem;
  
  // Determine the active main item for investment subcategories
  let currentActiveMainItem = activeMainItem;
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Special handling for alternative investment subcategories
  if (pathSegments.includes('alternative')) {
    const categoryId = pathSegments[pathSegments.length - 1];
    if (['private-equity', 'private-debt', 'real-assets', 'digital-assets'].includes(categoryId)) {
      currentActiveMainItem = categoryId;
    }
  }
  
  const menuItems = secondaryMenuItems || getSecondaryMenuItems(currentActiveMainItem);
  
  // Hide secondary menu for main investments page but show it for subcategories
  const isMainInvestmentsPage = location.pathname === "/investments";
  const hasSecondaryMenu = !isMainInvestmentsPage && menuItems.length > 0;
  
  const isLightTheme = theme === "light";
  const isHomePage = location.pathname === "/";

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${isLightTheme ? 'bg-[#F9F7E8]' : 'bg-[#12121C]'}`}>
      <div className="w-full flex justify-center items-center py-2 border-b z-50 bg-inherit sticky top-0" style={{ borderColor: isLightTheme ? '#DCD8C0' : 'rgba(255,255,255,0.1)' }}>
        <Header />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main Navigation Bar */}
        <NavBar />

        {/* Secondary Sidebar - Hidden for main investments page */}
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {isHomePage ? (
            <div className="flex flex-col items-center w-full">
            </div>
          ) : null}
          
          <main className="flex-1 overflow-y-auto p-3 font-sans w-full">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">{title}</h1>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

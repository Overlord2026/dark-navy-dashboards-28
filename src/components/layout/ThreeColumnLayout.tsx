
import React from "react";
import { LayoutDashboard, CreditCard, FileLineChart, Brain, Settings, User, Share2 } from "lucide-react";
import { MainNavItem, SidebarNavItem } from "@/types";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { MobileDashboardSidebar } from "@/components/layout/MobileDashboardSidebar";
import { CourseCategory } from "@/types/education";

interface ThreeColumnLayoutProps {
  children: React.ReactNode;
  activeMainItem?: string;
  hideLeftSidebar?: boolean;
  hideRightSidebar?: boolean;
  hideHeader?: boolean;
  title?: string;
  secondaryMenuItems?: CourseCategory[];
}

export function ThreeColumnLayout({ 
  children, 
  activeMainItem = "dashboard",
  hideLeftSidebar = false,
  hideRightSidebar = true,
  hideHeader = false,
  title,
  secondaryMenuItems
}: ThreeColumnLayoutProps) {
  const mainNavigationItems: MainNavItem[] = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, id: "dashboard" },
    { name: "Accounts", href: "/accounts", icon: CreditCard, id: "accounts" },
    { name: "Financial Plans", href: "/financial-plans", icon: FileLineChart, id: "financial-plans" },
    { name: "Project Integration", href: "/integration", icon: Share2, id: "integration" },
    { name: "AI Insights", href: "/ai-insights", icon: Brain, id: "ai-insights" },
  ];

  const sidebarNavigationItems: SidebarNavItem[] = [
    { name: "Profile", href: "/profile", icon: User, id: "profile" },
    { name: "Settings", href: "/settings", icon: Settings, id: "settings" },
  ];

  return (
    <div className="flex h-screen bg-background antialiased">
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <MobileDashboardSidebar 
          mainNavigationItems={mainNavigationItems}
          sidebarNavigationItems={sidebarNavigationItems}
        />
      </div>

      {/* Desktop Sidebar */}
      {!hideLeftSidebar && (
        <DashboardSidebar 
          mainNavigationItems={mainNavigationItems}
          sidebarNavigationItems={sidebarNavigationItems}
          activeMainItem={activeMainItem}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        {!hideHeader && (
          <header className="h-16 fixed top-0 left-0 right-0 z-50 bg-[#1B1B32]">
            <div className="flex items-center justify-center h-full">
              <img 
                src="/lovable-uploads/b14f5b06-cfde-4097-8454-4b672d706cba.png"
                alt="Boutique Family Office"
                className="h-auto w-[200px]"
              />
            </div>
          </header>
        )}

        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${!hideHeader ? 'pt-16' : ''}`}>
          {children}
        </main>
      </div>

      {/* Right Sidebar */}
      {!hideRightSidebar && (
        <aside className="hidden md:block w-80 border-l border-border py-4 px-3 flex-shrink-0">
          {/* Right sidebar content */}
        </aside>
      )}
    </div>
  );
}

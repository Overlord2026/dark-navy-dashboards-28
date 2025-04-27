import React from "react";
import { LayoutDashboard, CreditCard, FileLineChart, Brain, Settings, User, Share2 } from "lucide-react";
import { MainNavItem, SidebarNavItem } from "@/types";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { MobileDashboardSidebar } from "@/components/layout/MobileDashboardSidebar";
import { AudiencePersonaCards } from "@/components/audience/AudiencePersonaCards";

interface ThreeColumnLayoutProps {
  children: React.ReactNode;
  title?: string;
  activeMainItem?: string;
  hideLeftSidebar?: boolean;
  hideRightSidebar?: boolean;
  secondaryMenuItems?: any[];
}

export function ThreeColumnLayout({ 
  children, 
  title = "Wealth Management Platform",
  activeMainItem = "dashboard",
  hideLeftSidebar = false,
  hideRightSidebar = true,
  secondaryMenuItems = []
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
      <MobileDashboardSidebar 
        mainNavigationItems={mainNavigationItems}
        sidebarNavigationItems={sidebarNavigationItems}
      />

      {/* Left Sidebar - Always visible and expanded on desktop */}
      {!hideLeftSidebar && (
        <DashboardSidebar 
          mainNavigationItems={mainNavigationItems}
          sidebarNavigationItems={sidebarNavigationItems}
          activeMainItem={activeMainItem}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader title={title} />
        <AudiencePersonaCards />
        <main className="flex-1 overflow-x-hidden overflow-y-auto pt-24">
          {children}
        </main>
      </div>

      {/* Right Sidebar (Optional) */}
      {!hideRightSidebar && (
        <aside className="hidden md:block w-80 border-l border-border py-4 px-3 flex-shrink-0">
          {/* Add right sidebar content here */}
        </aside>
      )}
    </div>
  );
}

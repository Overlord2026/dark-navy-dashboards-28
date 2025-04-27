
import React from "react";
import { LayoutDashboard, CreditCard, FileLineChart, Brain, Settings, User, Share2 } from "lucide-react";
import { MainNavItem, SidebarNavItem } from "@/types";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { MobileDashboardSidebar } from "@/components/layout/MobileDashboardSidebar";
import { Network } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

interface ThreeColumnLayoutProps {
  children: React.ReactNode;
  activeMainItem?: string;
  hideLeftSidebar?: boolean;
  hideRightSidebar?: boolean;
}

export function ThreeColumnLayout({ 
  children, 
  activeMainItem = "dashboard",
  hideLeftSidebar = false,
  hideRightSidebar = true,
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
        <header className="h-24 border-b border-border bg-card fixed top-0 left-0 right-0 z-50">
          <div className="relative h-full">
            {/* Centered logo */}
            <div className="flex justify-center items-center h-full">
              <img 
                src="/lovable-uploads/7917640e-0a5d-4111-8e2e-d3faf741374b.png" 
                alt="Boutique Family Office" 
                className="h-20 w-auto"
              />
            </div>
            {/* Connected badge absolute positioned */}
            <div className="absolute top-1/2 -translate-y-1/2 right-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/integration" className="flex items-center rounded-md bg-primary/10 px-2 py-1.5 text-primary">
                      <Network className="h-4 w-4 mr-1.5" />
                      <span className="text-xs font-medium">Connected</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Part of Family Office Architecture</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto pt-24">
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

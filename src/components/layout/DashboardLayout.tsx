import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useTheme } from "@/context/ThemeContext";
// Debug components removed for production
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export function DashboardLayout() {
  const { theme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSubmenus, setExpandedSubmenus] = useState<Record<string, boolean>>({});

  const isLightTheme = theme === 'light';

  const toggleSubmenu = (id: string) => {
    setExpandedSubmenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleTheme = () => {
    // This will be handled by the theme context if needed
  };

  const onExpand = () => {
    setSidebarCollapsed(false);
  };

  const onCollapse = () => {
    setSidebarCollapsed(true);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background flex flex-col w-full">
        {/* QA mode header removed for production */}
        
        <div className="flex flex-1">
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex">
            <ErrorBoundary>
              <Sidebar
                isLightTheme={isLightTheme}
                collapsed={sidebarCollapsed}
                expandedSubmenus={expandedSubmenus}
                toggleSubmenu={toggleSubmenu}
                toggleTheme={toggleTheme}
                onExpand={onExpand}
                onCollapse={onCollapse}
              />
            </ErrorBoundary>
          </div>
          
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Mobile Header with Hamburger */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[320px] max-w-[90vw] p-0 overflow-y-auto">
                  <ErrorBoundary>
                    <Sidebar
                      isLightTheme={isLightTheme}
                      collapsed={false}
                      expandedSubmenus={expandedSubmenus}
                      toggleSubmenu={toggleSubmenu}
                      toggleTheme={toggleTheme}
                      onExpand={onExpand}
                      onCollapse={onCollapse}
                    />
                  </ErrorBoundary>
                </SheetContent>
              </Sheet>
              <h1 className="font-bold text-xl">LOV</h1>
              <div /> {/* Spacer for center alignment */}
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block">
              <ErrorBoundary>
                <Header />
              </ErrorBoundary>
            </div>
            
            <main className="flex-1 p-3 sm:p-4 lg:p-6 min-h-0">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </main>
          </div>
        </div>
        
        {/* Debug components removed for production */}
      </div>
    </ErrorBoundary>
  );
}
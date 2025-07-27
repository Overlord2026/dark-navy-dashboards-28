import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useTheme } from 'next-themes';

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
      <div className="min-h-screen bg-background flex w-full">
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
        
        <div className="flex-1 flex flex-col min-h-screen">
          <ErrorBoundary>
            <Header />
          </ErrorBoundary>
          
          <main className="flex-1 p-6">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
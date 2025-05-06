
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/ui/Sidebar";
import { navigationData } from "@/components/sidebar/navigationData";

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [expandedSubmenus, setExpandedSubmenus] = useState<Record<string, boolean>>({
    integration: true // Pre-expand the integration section
  });

  const toggleSubmenu = (id: string) => {
    setExpandedSubmenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleTheme = () => {
    setIsLightTheme(!isLightTheme);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isLightTheme={isLightTheme}
        collapsed={isCollapsed}
        navItems={navigationData}
        expandedSubmenus={expandedSubmenus}
        toggleSubmenu={toggleSubmenu}
        toggleTheme={toggleTheme}
        onExpand={() => setIsCollapsed(false)}
        onCollapse={() => setIsCollapsed(true)}
      />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

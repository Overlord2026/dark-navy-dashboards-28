
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavCategory, NavItem } from "@/types/navigation";
import { useTheme } from "@/context/ThemeContext";
import { navigationCategories } from "@/navigation/navCategories";
import { bottomNavItems } from "@/navigation/bottomNavigation";
import { UserProfileSection } from "@/components/sidebar/UserProfileSection";
import { AdvisorSection } from "@/components/profile/AdvisorSection";
import { SidebarNavCategory } from "@/components/sidebar/SidebarNavCategory";
import { SidebarBottomNav } from "@/components/sidebar/SidebarBottomNav";

export const NavBar: React.FC = () => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const location = useLocation();
  
  // Sidebar state
  const [collapsed, setCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    navigationCategories.reduce((acc, category) => {
      acc[category.id] = category.defaultExpanded ?? false;
      return acc;
    }, {} as Record<string, boolean>)
  );
  const [expandedSubmenus, setExpandedSubmenus] = useState<Record<string, boolean>>({});
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleSubmenu = (itemTitle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedSubmenus(prev => ({
      ...prev,
      [itemTitle]: !prev[itemTitle]
    }));
  };

  const isActive = (href: string) => {
    return location.pathname === href || 
           (href !== "/" && location.pathname.startsWith(href));
  };

  const handleBookSession = () => {
    console.log("Book session clicked");
  };

  const handleViewProfile = (tabId: string) => {
    console.log("View profile tab:", tabId);
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out z-50",
        collapsed ? "w-[70px]" : "w-[240px]",
        isLightTheme ? "bg-[#F9F7E8] border-[#DCD8C0]" : "bg-[#1B1B32] border-white/10"
      )}
    >
      <div className="py-4 overflow-y-auto flex-1">
        <div className={`px-4 ${isLightTheme ? 'border-[#DCD8C0]' : 'border-white/10'} mt-2 mb-4`}>
          <UserProfileSection showLogo={false} />
        </div>

        {navigationCategories.map((category) => (
          <SidebarNavCategory
            key={category.id}
            id={category.id}
            label={category.label}
            items={category.items}
            isExpanded={expandedCategories[category.id]}
            onToggle={toggleCategory}
            collapsed={collapsed}
            isActive={isActive}
            isLightTheme={isLightTheme}
            expandedSubmenus={expandedSubmenus}
            toggleSubmenu={toggleSubmenu}
          />
        ))}
      </div>

      <div className="p-2 border-t mt-auto" style={{ borderColor: isLightTheme ? '#DCD8C0' : 'rgba(255,255,255,0.1)' }}>
        <div className={`px-2 mb-3 ${isLightTheme ? 'border-[#DCD8C0]' : 'border-white/10'}`}>
          <AdvisorSection 
            onViewProfile={handleViewProfile} 
            onBookSession={handleBookSession} 
            collapsed={collapsed} 
          />
        </div>

        <SidebarBottomNav 
          items={bottomNavItems}
          collapsed={collapsed}
          isActive={isActive}
          isLightTheme={isLightTheme}
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 -right-4 h-8 w-8 rounded-full bg-background border border-gray-700 text-foreground hover:bg-accent hover:text-sidebar-primary-foreground"
        onClick={toggleSidebar}
      >
        {collapsed ? (
          <ChevronRightIcon className="h-4 w-4" />
        ) : (
          <ChevronLeftIcon className="h-4 w-4" />
        )}
      </Button>
    </aside>
  );
};

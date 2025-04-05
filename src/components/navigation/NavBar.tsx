
import React from "react";
import {
  Home,
  FileText,
  BarChart,
  Users,
  Settings,
  CreditCard,
} from "lucide-react";
import { useSidebarState } from "@/hooks/useSidebarState";
import { useTheme } from "@/hooks/useTheme";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BottomNavItem } from "@/types/navigation";
import { UserProfileSection } from "@/components/sidebar/UserProfileSection";
import { useViewportOverride } from "@/hooks/useViewportOverride";
import { 
  homeNavItems, 
  educationSolutionsNavItems, 
  familyWealthNavItems, 
  collaborationNavItems,
  bottomNavItems 
} from '@/navigation';
import { adaptNavItemsToMainMenuItems } from '@/utils/navigationUtils';

export const NavBar = () => {
  const { isDark, setTheme } = useTheme();
  const location = useLocation();
  const { effectiveIsMobile } = useViewportOverride();

  // Create navigation categories from modular structure
  const navigationCategories = [
    {
      id: "home",
      label: "Home",
      defaultExpanded: true,
      items: adaptNavItemsToMainMenuItems(homeNavItems),
    },
    {
      id: "education-solutions",
      label: "Education & Solutions",
      defaultExpanded: true,
      items: adaptNavItemsToMainMenuItems(educationSolutionsNavItems),
    },
    {
      id: "family-wealth",
      label: "Family Wealth",
      defaultExpanded: true,
      items: adaptNavItemsToMainMenuItems(familyWealthNavItems),
    },
    {
      id: "collaboration",
      label: "Collaboration & Sharing",
      defaultExpanded: false,
      items: adaptNavItemsToMainMenuItems(collaborationNavItems),
    }
  ];

  const {
    collapsed,
    expandedCategories,
    toggleSidebar,
    toggleCategory,
    isActive,
  } = useSidebarState(navigationCategories);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="flex h-full">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen border-r border-r-border-muted transition-all duration-300 fixed left-0 top-0 z-30 bg-sidebar",
          collapsed ? "w-[60px]" : "w-[260px]"
        )}
      >
        {/* User Profile Section at the Top */}
        {!collapsed && <UserProfileSection showLogo={true} />}
        {collapsed && (
          <div className="flex items-center justify-center h-16 px-4 border-b border-b-border-muted">
            <Link to="/" className="flex items-center text-lg font-semibold">
              <img
                src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png"
                alt="Boutique Family Office Logo"
                className="h-8 w-auto mx-auto"
              />
            </Link>
          </div>
        )}

        <div className="flex items-center justify-between h-16 px-4 border-b border-b-border-muted">
          <Link to="/" className="flex items-center text-lg font-semibold">
            {!collapsed && (
              <span className="truncate">Navigation</span>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-accent"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar">
          <nav className="py-4">
            {navigationCategories.map((category) => (
              <div key={category.id} className="mb-2">
                {!collapsed && (
                  <div
                    className={`flex items-center justify-between p-2 text-xs uppercase tracking-wider font-semibold ${isDark ? 'text-[#E2E2E2]/70' : 'text-[#222222]/70'} cursor-pointer`}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <span>{category.label}</span>
                    <div>
                      {expandedCategories[category.id] ? (
                        <span className="h-4 w-4">▼</span>
                      ) : (
                        <span className="h-4 w-4">▶</span>
                      )}
                    </div>
                  </div>
                )}
                
                {(!collapsed && expandedCategories[category.id]) && (
                  <div className="space-y-1.5">
                    {category.items.map((item) => (
                      <Link
                        key={item.id}
                        to={item.href}
                        className={cn(
                          "group flex items-center py-2 px-3 rounded-md transition-all duration-200 text-[14px] whitespace-nowrap border",
                          isActive(item.href)
                            ? isDark 
                              ? "bg-black text-[#E2E2E2] font-medium border-primary" 
                              : "bg-[#E9E7D8] text-[#222222] font-medium border-primary"
                            : isDark ? "text-[#E2E2E2] border-transparent" : "text-[#222222] border-transparent",
                          isDark 
                            ? "hover:bg-sidebar-accent hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" 
                            : "hover:bg-[#E9E7D8] hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
                        )}
                      >
                        {item.icon && (
                          <item.icon
                            className="h-5 w-5 mr-3"
                            style={{ 
                              backgroundColor: isDark ? '#000' : '#222222', 
                              padding: '2px', 
                              borderRadius: '2px' 
                            }}
                          />
                        )}
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
                
                {collapsed && (
                  <div>
                    {category.items.map((item) => (
                      <Link
                        key={item.id}
                        to={item.href}
                        title={item.title}
                        className={cn(
                          "group flex items-center justify-center py-2 px-2 my-2 rounded-md transition-all duration-200 text-[14px] whitespace-nowrap border",
                          isActive(item.href)
                            ? isDark 
                              ? "bg-black text-[#E2E2E2] font-medium border-primary" 
                              : "bg-[#E9E7D8] text-[#222222] font-medium border-primary"
                            : isDark ? "text-[#E2E2E2] border-transparent" : "text-[#222222] border-transparent",
                          isDark 
                            ? "hover:bg-sidebar-accent hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" 
                            : "hover:bg-[#E9E7D8] hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
                        )}
                      >
                        {item.icon && (
                          <item.icon
                            className="h-5 w-5"
                            style={{ 
                              backgroundColor: isDark ? '#000' : '#222222', 
                              padding: '2px', 
                              borderRadius: '2px' 
                            }}
                          />
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Advisor Profile Section at Bottom */}
        <div className="p-4 mt-auto border-t border-t-border-muted">
          <Link to="/advisor-profile">
            <button
              className="w-full py-2 px-3 rounded-md text-sm font-medium hover:bg-accent flex items-center"
            >
              {collapsed ? (
                <Users className="h-5 w-5" />
              ) : (
                <>
                  <Users className="h-5 w-5 mr-2" />
                  <span>Advisor Profile</span>
                </>
              )}
            </button>
          </Link>
          
          <button
            onClick={toggleTheme}
            className="w-full py-2 px-3 mt-2 rounded-md text-sm font-medium hover:bg-accent"
          >
            {collapsed ? (isDark ? "☀️" : "🌙") : `Theme: ${isDark ? "Dark" : "Light"}`}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation - Only visible on mobile AND when effectiveIsMobile is true */}
      {effectiveIsMobile && (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-sidebar border-t border-t-border-muted py-2 z-30">
          <div className="flex justify-around items-center">
            {bottomNavItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center text-muted-foreground",
                  location.pathname === item.href
                    ? "text-secondary-foreground"
                    : ""
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

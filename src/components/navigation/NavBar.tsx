
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
import { navigationCategories } from "@/navigation/navCategories";
import { useTheme } from "@/hooks/useTheme";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BottomNavItem } from "@/types/navigation";
import { NavigationCategory } from "@/components/layout/NavigationCategory";

export const NavBar = () => {
  const { isDark, setTheme } = useTheme();
  const location = useLocation();

  const {
    collapsed,
    expandedCategories,
    expandedSubmenus,
    forceUpdate,
    toggleSidebar,
    toggleCategory,
    toggleSubmenu,
    isActive,
    setCollapsed
  } = useSidebarState(navigationCategories);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const bottomNavItems: BottomNavItem[] = [
    {
      id: "home",
      title: "Home",
      icon: Home,
      href: "/",
    },
    {
      id: "accounts",
      title: "Accounts",
      icon: CreditCard,
      href: "/accounts",
    },
    {
      id: "investments",
      title: "Investments",
      icon: BarChart,
      href: "/investments",
    },
    {
      id: "profile",
      title: "Profile",
      icon: Users,
      href: "/profile",
    }
  ];

  // Determine if we should show desktop or mobile view based on screen size
  // This will be handled with CSS

  return (
    <div className="flex h-full">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen border-r border-r-border-muted transition-all duration-300 fixed left-0 top-0 z-30 bg-sidebar",
          collapsed ? "w-[60px]" : "w-[260px]"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-b-border-muted">
          <Link to="/" className="flex items-center text-lg font-semibold">
            {!collapsed && (
              <>
                <img
                  src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png"
                  alt="Boutique Family Office Logo"
                  className="h-8 w-auto mr-2"
                />
                <span className="truncate">BFO</span>
              </>
            )}
            {collapsed && (
              <img
                src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png"
                alt="Boutique Family Office Logo"
                className="h-8 w-auto mx-auto"
              />
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
              <NavigationCategory
                key={category.id}
                category={category}
                isExpanded={expandedCategories[category.id]}
                toggleCategory={() => toggleCategory(category.id)}
                currentPath={location.pathname}
                isCollapsed={collapsed}
                isLightTheme={!isDark}
              />
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-t-border-muted">
          <button
            onClick={toggleTheme}
            className="w-full py-2 px-3 rounded-md text-sm font-medium hover:bg-accent"
          >
            {collapsed ? (isDark ? "☀️" : "🌙") : `Theme: ${isDark ? "Dark" : "Light"}`}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation - Only visible on mobile */}
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
    </div>
  );
};

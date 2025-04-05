
import React from "react";
import {
  Home,
  FileText,
  BarChart,
  Users,
  Settings,
  CreditCard,
} from "lucide-react";
import { Sidebar } from "@/components/ui/Sidebar";
import { useSidebarState } from "@/hooks/useSidebarState";
import { navigationCategories } from "@/navigation/navCategories";
import { useTheme } from "@/hooks/useTheme";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BottomNavItem } from "@/types/navigation";

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

  return (
    <div className="flex h-full">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col w-[260px] bg-sidebar border-r border-r-border-muted transition-transform duration-300",
          collapsed ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-b-border-muted">
          <Link to="/" className="flex items-center text-lg font-semibold">
            <img
              src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png"
              alt="Boutique Family Office Logo"
              className="h-8 w-auto mr-2"
            />
            BFO
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-accent"
          >
            {collapsed ? "Open" : "Close"}
          </button>
        </div>

        <nav className="flex-grow overflow-y-auto py-4">
          {navigationCategories.map((category) => (
            <div key={category.id} className="mb-2">
              <div
                className="flex items-center justify-between p-2 text-xs uppercase tracking-wider font-semibold text-muted-foreground cursor-pointer hover:bg-accent"
                onClick={() => toggleCategory(category.id)}
              >
                <span>{category.label}</span>
                <div>{expandedCategories[category.id] ? "▲" : "▼"}</div>
              </div>
              {expandedCategories[category.id] && (
                <ul className="space-y-1.5">
                  {category.items.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={item.href}
                        className={cn(
                          "group flex items-center py-2 px-3 rounded-md transition-colors text-[14px]",
                          isActive(item.href)
                            ? "bg-secondary text-secondary-foreground font-medium"
                            : "text-muted-foreground",
                          "hover:bg-accent"
                        )}
                      >
                        {item.icon && (
                          <item.icon className="h-4 w-4 mr-2 opacity-70" />
                        )}
                        <span>{item.title || item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-t-border-muted">
          <button
            onClick={toggleTheme}
            className="w-full py-2 px-3 rounded-md text-sm font-medium hover:bg-accent"
          >
            Toggle Theme ({isDark ? "Light" : "Dark"})
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-sidebar border-t border-t-border-muted py-2">
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

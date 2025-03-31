
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  ChevronLeftIcon,
  ChevronRightIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { 
  mainNavItems,
  servicesNavItems,
  planningNavItems,
  propertiesNavItems,
  bottomNavItems
} from "@/components/navigation/NavigationConfig";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const isActive = (href: string) => {
    return location.pathname === href || 
           (href !== "/" && location.pathname.startsWith(href));
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="py-4 overflow-y-auto">
        {/* Main Navigation */}
        <nav className="px-2 space-y-1">
          {!collapsed && (
            <div className="px-3 mb-2">
              <h3 className="px-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                Dashboard
              </h3>
            </div>
          )}
          {mainNavItems.map((item, index) => (
            <Link
              key={item.title}
              to={item.href}
              className={cn(
                "group flex items-center py-2 px-3 rounded-md transition-colors",
                "hover:bg-sidebar-accent",
                isActive(item.href)
                  ? "bg-black text-white" 
                  : "text-sidebar-foreground"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0 bg-black p-0.5 rounded-sm" />
              {!collapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</span>}
            </Link>
          ))}
        </nav>
        
        {/* Financial Services Section */}
        {!collapsed && (
          <div className="mt-6 px-3">
            <h3 className="px-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
              Financial Services
            </h3>
          </div>
        )}
        <nav className="mt-2 px-2 space-y-1">
          {servicesNavItems.map((item, index) => (
            <Link
              key={item.title}
              to={item.href}
              className={cn(
                "group flex items-center py-2 px-3 rounded-md transition-colors",
                "hover:bg-sidebar-accent",
                isActive(item.href)
                  ? "bg-black text-white" 
                  : "text-sidebar-foreground"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0 bg-black p-0.5 rounded-sm" />
              {!collapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</span>}
            </Link>
          ))}
        </nav>
        
        {/* Planning & Management Section */}
        {!collapsed && (
          <div className="mt-6 px-3">
            <h3 className="px-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
              Planning & Management
            </h3>
          </div>
        )}
        <nav className="mt-2 px-2 space-y-1">
          {planningNavItems.map((item, index) => (
            <Link
              key={item.title}
              to={item.href}
              className={cn(
                "group flex items-center py-2 px-3 rounded-md transition-colors",
                "hover:bg-sidebar-accent",
                isActive(item.href)
                  ? "bg-black text-white" 
                  : "text-sidebar-foreground"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0 bg-black p-0.5 rounded-sm" />
              {!collapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</span>}
            </Link>
          ))}
        </nav>
        
        {/* Properties Management Section */}
        {!collapsed && (
          <div className="mt-6 px-3">
            <h3 className="px-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
              Properties Management
            </h3>
          </div>
        )}
        <nav className="mt-2 px-2 space-y-1">
          {propertiesNavItems.map((item, index) => (
            <Link
              key={item.title}
              to={item.href}
              className={cn(
                "group flex items-center py-2 px-3 rounded-md transition-colors",
                "hover:bg-sidebar-accent",
                isActive(item.href)
                  ? "bg-black text-white" 
                  : "text-sidebar-foreground"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0 bg-black p-0.5 rounded-sm" />
              {!collapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-2 border-t border-sidebar-border mt-auto">
        <nav className="space-y-1">
          {bottomNavItems.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className="group flex items-center py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors border border-gray-700"
            >
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0 bg-black p-0.5 rounded-sm" />
              {!collapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</span>}
            </Link>
          ))}
        </nav>
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
}

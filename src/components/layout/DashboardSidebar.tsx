
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MainNavItem, SidebarNavItem } from "@/types";

interface DashboardSidebarProps {
  mainNavigationItems: MainNavItem[];
  sidebarNavigationItems: SidebarNavItem[];
  activeMainItem?: string;
  isLightTheme?: boolean;
}

export function DashboardSidebar({ 
  mainNavigationItems, 
  sidebarNavigationItems,
  activeMainItem,
  isLightTheme = false
}: DashboardSidebarProps) {
  const location = useLocation();
  
  return (
    <aside className="hidden md:flex w-64 border-r h-full flex-shrink-0 border-border">
      <div className="h-full flex flex-col">
        <div className="p-4">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
              alt="Logo" 
              className="h-10 w-auto"
            />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {mainNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeMainItem || location.pathname === item.href;
              
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <div className="space-y-1">
            {sidebarNavigationItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

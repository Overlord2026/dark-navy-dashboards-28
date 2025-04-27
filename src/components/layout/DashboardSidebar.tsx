
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MainNavItem, SidebarNavItem } from "@/types";
import { ChevronDown, ChevronRight } from "lucide-react";

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
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    main: true,
    secondary: true
  });
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <aside className="hidden md:flex w-64 border-r border-border bg-card h-screen flex-shrink-0 flex-col overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Navigation</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-4">
          {/* Main Navigation Section */}
          <div>
            <button
              onClick={() => toggleSection('main')}
              className="flex items-center justify-between w-full p-2 text-sm font-medium"
            >
              Main Navigation
              {expandedSections.main ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {expandedSections.main && (
              <div className="mt-1 space-y-1">
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
            )}
          </div>

          {/* Settings Section */}
          <div>
            <button
              onClick={() => toggleSection('secondary')}
              className="flex items-center justify-between w-full p-2 text-sm font-medium"
            >
              Settings & Profile
              {expandedSections.secondary ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {expandedSections.secondary && (
              <div className="mt-1 space-y-1">
                {sidebarNavigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

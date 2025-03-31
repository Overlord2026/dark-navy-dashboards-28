
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useTheme } from "@/context/ThemeContext";
import { NavCategory, NavItem, navigationCategories } from "./NavigationConfig";

interface MainNavigationProps {
  collapsed?: boolean;
  onItemClick?: (itemId: string) => void;
}

export const MainNavigation = ({ 
  collapsed = false,
  onItemClick
}: MainNavigationProps) => {
  const location = useLocation();
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    navigationCategories.reduce((acc, category) => {
      acc[category.id] = category.defaultExpanded ?? false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const getCurrentPath = () => {
    const path = location.pathname.split('/')[1];
    return path === '' ? 'home' : path;
  };

  const currentPath = getCurrentPath();

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Reset expanded categories when collapsed state changes
  useEffect(() => {
    if (collapsed) {
      // Close all categories when sidebar is collapsed
      const closedState = Object.keys(expandedCategories).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as Record<string, boolean>);
      setExpandedCategories(closedState);
    } else {
      // Restore default expanded state when sidebar is expanded
      const defaultState = navigationCategories.reduce((acc, category) => {
        acc[category.id] = category.defaultExpanded ?? false;
        return acc;
      }, {} as Record<string, boolean>);
      setExpandedCategories(defaultState);
    }
  }, [collapsed]);

  // Handle item click
  const handleItemClick = (itemId: string) => {
    if (onItemClick) {
      onItemClick(itemId);
    }
  };

  return (
    <nav className="px-2 space-y-1 overflow-y-auto">
      {navigationCategories.map((category) => (
        <div key={category.id} className="mb-2">
          {!collapsed && (
            <Collapsible
              open={expandedCategories[category.id]}
              onOpenChange={() => toggleCategory(category.id)}
            >
              <CollapsibleTrigger asChild>
                <div className={`flex items-center justify-between p-2 text-xs uppercase tracking-wider font-semibold ${
                  isLightTheme ? 'text-[#222222]/70' : 'text-[#E2E2E2]/70'
                } cursor-pointer`}>
                  <span>{category.label}</span>
                  <div>
                    {expandedCategories[category.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1.5">
                {category.items.map((item) => (
                  <NavItemLink 
                    key={item.id} 
                    item={item} 
                    isActive={item.id === currentPath}
                    isCollapsed={false}
                    isLightTheme={isLightTheme}
                    onClick={() => handleItemClick(item.id)}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
          
          {collapsed && (
            <>
              {category.items.map((item) => (
                <NavItemLink 
                  key={item.id} 
                  item={item} 
                  isActive={item.id === currentPath}
                  isCollapsed={true}
                  isLightTheme={isLightTheme}
                  onClick={() => handleItemClick(item.id)}
                />
              ))}
            </>
          )}
        </div>
      ))}
    </nav>
  );
};

interface NavItemLinkProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
  isLightTheme: boolean;
  onClick?: () => void;
}

const NavItemLink = ({ 
  item, 
  isActive, 
  isCollapsed, 
  isLightTheme,
  onClick 
}: NavItemLinkProps) => {
  const IconComponent = item.icon;
  
  return (
    <Link
      to={item.href}
      className={cn(
        "group flex items-center py-2 px-3 rounded-md transition-colors text-[14px] whitespace-nowrap border",
        isActive
          ? isLightTheme 
            ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
            : "bg-black text-[#E2E2E2] font-medium border-primary"
          : isLightTheme ? "text-[#222222] border-transparent" : "text-[#E2E2E2] border-transparent",
        isLightTheme ? "hover:bg-[#E9E7D8] hover:border-primary" : "hover:bg-white/10 hover:border-primary",
        isCollapsed && "justify-center px-2 my-2"
      )}
      onClick={onClick}
      title={isCollapsed ? item.label : undefined}
    >
      {IconComponent && (
        <div className={cn(
          "flex items-center justify-center rounded-sm p-0.5",
          isLightTheme ? 'bg-[#222222]' : 'bg-black',
          !isCollapsed && "mr-3"
        )}>
          <IconComponent className="h-5 w-5 text-white" />
        </div>
      )}
      {!isCollapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
    </Link>
  );
};

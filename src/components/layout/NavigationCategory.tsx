
import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NavigationItem } from "./NavigationItem";
import { Link, useLocation } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavItem, NavCategory } from "@/types/navigation";
import { cn } from "@/lib/utils";

interface MainMenuItem {
  id: string;
  label: string;
  icon: React.ElementType | React.FC;
  href: string;
}

interface NavigationCategoryProps {
  category: NavCategory | {
    id: string;
    label: string;
    items: MainMenuItem[] | NavItem[];
  };
  isExpanded: boolean;
  toggleCategory: (categoryId: string) => void;
  currentPath: string;
  isCollapsed: boolean;
  isLightTheme: boolean;
}

export const NavigationCategory = ({
  category,
  isExpanded,
  toggleCategory,
  currentPath,
  isCollapsed,
  isLightTheme
}: NavigationCategoryProps) => {
  const location = useLocation();

  // Helper function to check if a path is active
  const isActivePath = (path: string): boolean => {
    // Normalize both paths for comparison
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const normalizedCurrentPath = currentPath.startsWith("/") ? currentPath : `/${currentPath}`;
    
    return normalizedPath === normalizedCurrentPath;
  };

  // Prevent default and stop propagation on category toggle
  const handleCategoryToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCategory(category.id);
  };

  return (
    <div key={category.id} className="mb-2">
      {!isCollapsed && (
        <Collapsible
          open={isExpanded}
          onOpenChange={() => toggleCategory(category.id)}
        >
          <CollapsibleTrigger asChild>
            <button 
              type="button" // Explicitly set type to prevent form submission
              onClick={handleCategoryToggle}
              className={`flex items-center justify-between p-2 text-xs uppercase tracking-wider font-semibold ${isLightTheme ? 'text-[#222222]/70' : 'text-[#E2E2E2]/70'} cursor-pointer w-full`}
            >
              <span>{category.label}</span>
              <div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1.5">
            {category.items.map((item: any) => (
              <NavigationItem
                key={item.id || item.href}
                item={{
                  id: item.id || item.href.replace('/', ''),
                  label: item.label || item.title,
                  icon: item.icon,
                  href: item.href
                }}
                isActive={isActivePath(item.href)}
                isCollapsed={false}
                isLightTheme={isLightTheme}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
      
      {isCollapsed && (
        <div className="flex flex-col items-center space-y-1">
          {category.items.map((item: any) => (
            <NavigationItem
              key={item.id || item.href}
              item={{
                id: item.id || item.href.replace('/', ''),
                label: item.label || item.title,
                icon: item.icon,
                href: item.href
              }}
              isActive={isActivePath(item.href)}
              isCollapsed={true}
              isLightTheme={isLightTheme}
            />
          ))}
        </div>
      )}
    </div>
  );
};

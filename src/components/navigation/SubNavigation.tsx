
import React from "react";
import { NavItem, NavSubItem, navigationCategories } from "./NavigationConfig";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

interface SubNavigationProps {
  activeMainItem: string;
  activeSecondaryItem: string | undefined;
  customItems?: NavSubItem[];
}

export function SubNavigation({ 
  activeMainItem,
  activeSecondaryItem,
  customItems
}: SubNavigationProps) {
  const location = useLocation();
  
  // Find the correct navigation category based on activeMainItem
  const currentCategory = navigationCategories.find(
    (category) => category.items.some((item) => item.id === activeMainItem)
  );
  
  // Find the active item within that category
  const activeItem = currentCategory?.items.find(
    (item) => item.id === activeMainItem
  );
  
  // Use custom items if provided, otherwise use the sub-items from the active item
  const subItems = customItems || activeItem?.subItems || [];
  
  if (subItems.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-col py-4">
      <nav className="space-y-1 px-3">
        {subItems.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm rounded-md",
              "transition-colors duration-200 ease-in-out",
              item.id === activeSecondaryItem
                ? "bg-accent text-accent-foreground font-medium"
                : "text-foreground/70 hover:text-foreground hover:bg-muted"
            )}
          >
            {item.label} {/* Use only label property since 'name' doesn't exist on NavSubItem */}
          </Link>
        ))}
      </nav>
    </div>
  );
}


import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NavigationItem } from "./NavigationItem";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MainMenuItem {
  id: string;
  label: string;
  icon: React.ElementType | React.FC;
  href: string;
}

interface NavigationCategoryProps {
  category: {
    id: string;
    label: string;
    items: MainMenuItem[];
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
  // Improved active item detection
  const isItemActive = (item: MainMenuItem): boolean => {
    // Remove trailing slashes from paths for comparison
    const normalizedCurrentPath = currentPath.replace(/\/+$/, '');
    const normalizedItemId = item.id.replace(/\/+$/, '');
    const normalizedHref = item.href.replace(/^\/+/, '').replace(/\/+$/, '');
    
    // Direct match with item href
    if (normalizedCurrentPath === normalizedHref) {
      return true;
    }
    
    // Direct match with item ID
    if (normalizedCurrentPath === normalizedItemId) {
      return true;
    }
    
    // Special case for legacy-vault
    if (normalizedItemId === 'legacy-vault' && normalizedCurrentPath.includes('legacy-vault')) {
      return true;
    }
    
    // Special case handling for specific routes
    if (normalizedItemId === 'tax-planning' && normalizedCurrentPath.includes('tax-planning')) {
      return true;
    }
    
    if (normalizedItemId === 'education' && normalizedCurrentPath.startsWith('education')) {
      return true;
    }
    
    if (normalizedItemId === 'investments' && normalizedCurrentPath.startsWith('investments')) {
      return true;
    }
    
    if (normalizedItemId === 'insurance' && 
        (normalizedCurrentPath === 'insurance' || normalizedCurrentPath === 'personal-insurance')) {
      return true;
    }
    
    // Check if the current path starts with the item id (for nested routes)
    if (normalizedCurrentPath.startsWith(`${normalizedItemId}/`)) {
      return true;
    }

    // Check if the current path starts with the item href
    if (normalizedItemId && normalizedCurrentPath.startsWith(`${normalizedItemId}`)) {
      return true;
    }
    
    return false;
  };

  return (
    <div key={category.id} className="mb-2">
      {!isCollapsed && (
        <Collapsible
          open={isExpanded}
          onOpenChange={() => toggleCategory(category.id)}
        >
          <CollapsibleTrigger asChild>
            <div className={`flex items-center justify-between p-2 text-xs uppercase tracking-wider font-semibold ${isLightTheme ? 'text-[#222222]/70' : 'text-[#E2E2E2]/70'} cursor-pointer`}>
              <span>{category.label}</span>
              <div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1.5">
            {category.items.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
                isActive={isItemActive(item)}
                isCollapsed={false}
                isLightTheme={isLightTheme}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
      
      {isCollapsed && (
        <>
          {category.items.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={isItemActive(item)}
              isCollapsed={true}
              isLightTheme={isLightTheme}
            />
          ))}
        </>
      )}
    </div>
  );
};

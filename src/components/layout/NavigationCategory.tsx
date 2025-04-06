
import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NavigationItem } from "./NavigationItem";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavItem } from "@/types/navigation";

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
            {category.items.map((item: any) => (
              <NavigationItem
                key={item.id || item.href}
                item={{
                  id: item.id || item.href.replace('/', ''),
                  label: item.label || item.title,
                  icon: item.icon,
                  href: item.href
                }}
                isActive={currentPath === (item.id || item.href.replace('/', ''))}
                isCollapsed={false}
                isLightTheme={isLightTheme}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
      
      {isCollapsed && (
        <>
          {category.items.map((item: any) => (
            <NavigationItem
              key={item.id || item.href}
              item={{
                id: item.id || item.href.replace('/', ''),
                label: item.label || item.title,
                icon: item.icon,
                href: item.href
              }}
              isActive={currentPath === (item.id || item.href.replace('/', ''))}
              isCollapsed={true}
              isLightTheme={isLightTheme}
            />
          ))}
        </>
      )}
    </div>
  );
};

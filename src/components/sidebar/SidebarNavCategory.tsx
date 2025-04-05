
import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NavigationItem } from "@/components/navigation/NavigationItem";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MainMenuItem } from "@/types/navigation";

interface SidebarNavCategoryProps {
  id: string;
  label: string;
  items: MainMenuItem[];
  isExpanded: boolean;
  onToggle: (categoryId: string) => void;
  collapsed: boolean;
  isActive: (href: string) => boolean;
  isLightTheme: boolean;
  expandedSubmenus: Record<string, boolean>;
  toggleSubmenu: (itemTitle: string, e: React.MouseEvent) => void;
}

export const SidebarNavCategory: React.FC<SidebarNavCategoryProps> = ({
  id,
  label,
  items,
  isExpanded,
  onToggle,
  collapsed,
  isActive,
  isLightTheme,
  expandedSubmenus,
  toggleSubmenu
}) => {
  return (
    <div className="mb-2">
      {!collapsed && (
        <Collapsible
          open={isExpanded}
          onOpenChange={() => onToggle(id)}
        >
          <CollapsibleTrigger asChild>
            <div className={`flex items-center justify-between p-2 text-xs uppercase tracking-wider font-semibold ${isLightTheme ? 'text-[#222222]/70' : 'text-[#E2E2E2]/70'} cursor-pointer`}>
              <span>{label}</span>
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
            {items.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
                isActive={isActive(item.href)}
                isCollapsed={false}
                isLightTheme={isLightTheme}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
      
      {collapsed && (
        <>
          {items.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={isActive(item.href)}
              isCollapsed={true}
              isLightTheme={isLightTheme}
            />
          ))}
        </>
      )}
    </div>
  );
};

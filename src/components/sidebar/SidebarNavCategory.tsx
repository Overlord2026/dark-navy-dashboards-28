
import React from "react";
import { NavItem } from "@/types/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavCategoryProps {
  id: string;
  label: string;
  items: NavItem[];
  isExpanded: boolean;
  onToggle: (id: string) => void;
  collapsed: boolean;
  isActive: (path: string) => boolean;
  isLightTheme: boolean;
  expandedSubmenus: Record<string, boolean>;
  toggleSubmenu: (id: string) => void;
}

const SidebarNavCategory = ({
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
}: SidebarNavCategoryProps) => {
  // Skip rendering empty categories
  if (items.length === 0) return null;

  const renderItems = () => {
    return items.map((item) => {
      const Icon = item.icon;
      const active = isActive(item.href);
      
      return (
        <div key={item.href || item.title}>
          <a
            href={item.href}
            className={cn(
              "flex items-center py-2 px-3 rounded-md transition-colors text-[14px] whitespace-nowrap border",
              active
                ? isLightTheme 
                  ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
                  : "bg-black text-[#E2E2E2] font-medium border-primary"
                : isLightTheme ? "text-[#222222] border-transparent" : "text-[#E2E2E2] border-transparent",
              isLightTheme ? "hover:bg-[#E9E7D8] hover:border-primary" : "hover:bg-sidebar-accent hover:border-primary",
              collapsed ? "justify-center px-2 my-2" : "justify-start"
            )}
          >
            {Icon && (
              <div className={cn("flex-shrink-0", !collapsed && "mr-3")}>
                <Icon className="h-5 w-5" />
              </div>
            )}
            
            {!collapsed && (
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                {item.title}
              </span>
            )}
          </a>
        </div>
      );
    });
  };

  if (collapsed) {
    return (
      <div className="mb-4">
        <div className="flex flex-col items-center space-y-1">
          {renderItems()}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div
        className={`flex items-center justify-between p-2 text-xs uppercase tracking-wider font-semibold cursor-pointer ${
          isLightTheme ? 'text-[#222222]/70' : 'text-[#E2E2E2]/70'
        }`}
        onClick={() => onToggle(id)}
      >
        <span>{label}</span>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </div>
      
      {isExpanded && (
        <div className="pl-2 space-y-1">
          {renderItems()}
        </div>
      )}
    </div>
  );
};

export default SidebarNavCategory;

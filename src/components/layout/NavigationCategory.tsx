
import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavCategory } from "@/types/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavigationCategoryProps {
  category: NavCategory;
  isExpanded: boolean;
  toggleCategory: (categoryId: string) => void;
  currentPath: string;
  isCollapsed: boolean;
  isLightTheme: boolean;
}

export const NavigationCategory: React.FC<NavigationCategoryProps> = ({
  category,
  isExpanded,
  toggleCategory,
  currentPath,
  isCollapsed,
  isLightTheme
}) => {
  const isActive = (href: string) => {
    const normalizedHref = href.startsWith("/") ? href : `/${href}`;
    const normalizedPath = `/${currentPath}`;
    
    return normalizedPath === normalizedHref || 
           (normalizedHref !== "/" && normalizedPath.startsWith(normalizedHref));
  };

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center space-y-1">
        {category.items.map((item) => {
          const Icon = item.icon;
          const normalizedHref = item.href.startsWith("/") ? item.href : `/${item.href}`;
          
          if (item.comingSoon) {
            return (
              <div
                key={item.title}
                className={cn(
                  "group flex items-center justify-center w-8 h-8 p-2 rounded-md transition-colors opacity-50 cursor-not-allowed",
                  isLightTheme ? "text-sidebar-foreground" : "text-sidebar-foreground"
                )}
                title={`${item.title} (Coming Soon)`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span className="sr-only">{item.title}</span>
              </div>
            );
          }

          return (
            <Link
              key={item.title}
              to={normalizedHref}
              className={cn(
                "group flex items-center justify-center w-8 h-8 p-2 rounded-md transition-colors border touch-manipulation",
                isActive(normalizedHref)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-accent"
                  : "text-sidebar-foreground border-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              title={item.title}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span className="sr-only">{item.title}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={() => toggleCategory(category.id)}
    >
      <CollapsibleTrigger asChild>
        <div className={cn(
          "flex items-center justify-between w-full p-3 text-xs uppercase tracking-wider font-semibold cursor-pointer transition-colors touch-manipulation rounded-md",
          "hover:bg-sidebar-accent/50",
          isLightTheme ? "text-sidebar-foreground/70 hover:text-sidebar-foreground" : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
        )}>
          <span>{category.label}</span>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 pb-2">
        {category.items.map((item) => {
          const Icon = item.icon;
          const normalizedHref = item.href.startsWith("/") ? item.href : `/${item.href}`;

          if (item.comingSoon) {
            return (
              <div
                key={item.title}
                className={cn(
                  "group flex items-center py-3 px-3 rounded-md transition-colors opacity-50 cursor-not-allowed border",
                  "text-sidebar-foreground/50 border-transparent"
                )}
                title={`${item.title} (Coming Soon)`}
              >
                {Icon && <Icon className="h-5 w-5 mr-3 flex-shrink-0" />}
                <span className="flex-1 text-sm">{item.title}</span>
                <span className="text-xs text-muted-foreground">(Coming Soon)</span>
              </div>
            );
          }

          return (
            <Link
              key={item.title}
              to={normalizedHref}
              className={cn(
                "group flex items-center py-3 px-3 rounded-md transition-colors border touch-manipulation text-sm",
                isActive(normalizedHref)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-accent font-medium"
                  : "text-sidebar-foreground border-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              {Icon && <Icon className="h-5 w-5 mr-3 flex-shrink-0" />}
              <span>{item.title}</span>
            </Link>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
};

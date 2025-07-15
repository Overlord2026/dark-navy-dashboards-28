
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavCategory, NavItem } from "@/types/navigation";
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

interface NavigationItemProps {
  item: NavItem;
  currentPath: string;
  isCollapsed: boolean;
  isLightTheme: boolean;
  level?: number;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  currentPath,
  isCollapsed,
  isLightTheme,
  level = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isActive = (href?: string) => {
    if (!href) return false;
    const normalizedHref = href.startsWith("/") ? href : `/${href}`;
    const normalizedPath = `/${currentPath}`;
    
    return normalizedPath === normalizedHref || 
           (normalizedHref !== "/" && normalizedPath.startsWith(normalizedHref));
  };

  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  const indentLevel = level * 12; // 12px per level

  if (isCollapsed) {
    if (item.comingSoon || item.disabled) {
      return (
        <div
          className={cn(
            "group flex items-center justify-center w-8 h-8 p-2 rounded-md transition-colors opacity-50 cursor-not-allowed",
            isLightTheme ? "text-sidebar-foreground" : "text-sidebar-foreground"
          )}
          title={`${item.title} ${item.comingSoon ? '(Coming Soon)' : '(Disabled)'}`}
        >
          {Icon && <Icon className="h-4 w-4" />}
          <span className="sr-only">{item.title}</span>
        </div>
      );
    }

    if (hasChildren || !item.href) {
      return (
        <div
          className={cn(
            "group flex items-center justify-center w-8 h-8 p-2 rounded-md transition-colors",
            "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
          title={item.title}
        >
          {Icon && <Icon className="h-4 w-4" />}
          <span className="sr-only">{item.title}</span>
        </div>
      );
    }

    return (
      <Link
        to={item.href}
        className={cn(
          "group flex items-center justify-center w-8 h-8 p-2 rounded-md transition-colors border touch-manipulation",
          isActive(item.href)
            ? "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-accent"
            : "text-sidebar-foreground border-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        title={item.title}
      >
        {Icon && <Icon className="h-4 w-4" />}
        <span className="sr-only">{item.title}</span>
      </Link>
    );
  }

  if (item.comingSoon || item.disabled) {
    return (
      <div
        className={cn(
          "group flex items-center py-3 rounded-md transition-colors opacity-50 cursor-not-allowed border",
          "text-sidebar-foreground/50 border-transparent"
        )}
        style={{ paddingLeft: `${12 + indentLevel}px` }}
        title={`${item.title} ${item.comingSoon ? '(Coming Soon)' : '(Disabled)'}`}
      >
        {Icon && <Icon className="h-5 w-5 mr-3 flex-shrink-0" />}
        <span className="flex-1 text-sm">{item.title}</span>
        <span className="text-xs text-muted-foreground">
          {item.comingSoon ? '(Coming Soon)' : '(Disabled)'}
        </span>
      </div>
    );
  }

  if (hasChildren) {
    return (
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              "group flex items-center py-3 rounded-md transition-colors border touch-manipulation text-sm cursor-pointer w-full",
              isActive(item.href)
                ? "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-accent font-medium"
                : "text-sidebar-foreground border-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            style={{ paddingLeft: `${12 + indentLevel}px` }}
          >
            {Icon && <Icon className="h-5 w-5 mr-3 flex-shrink-0" />}
            <span className="flex-1">{item.title}</span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 mr-2" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {item.children?.map((childItem) => (
            <NavigationItem
              key={childItem.id || childItem.title}
              item={childItem}
              currentPath={currentPath}
              isCollapsed={isCollapsed}
              isLightTheme={isLightTheme}
              level={level + 1}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  if (!item.href) {
    return (
      <div
        className={cn(
          "group flex items-center py-3 rounded-md transition-colors border",
          "text-sidebar-foreground border-transparent"
        )}
        style={{ paddingLeft: `${12 + indentLevel}px` }}
      >
        {Icon && <Icon className="h-5 w-5 mr-3 flex-shrink-0" />}
        <span className="text-sm">{item.title}</span>
      </div>
    );
  }

  return (
    <Link
      to={item.href}
      className={cn(
        "group flex items-center py-3 rounded-md transition-colors border touch-manipulation text-sm",
        isActive(item.href)
          ? "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-accent font-medium"
          : "text-sidebar-foreground border-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
      style={{ paddingLeft: `${12 + indentLevel}px` }}
    >
      {Icon && <Icon className="h-5 w-5 mr-3 flex-shrink-0" />}
      <span>{item.title}</span>
    </Link>
  );
};

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
        {category.items.map((item) => (
          <NavigationItem
            key={item.id || item.title}
            item={item}
            currentPath={currentPath}
            isCollapsed={false}
            isLightTheme={isLightTheme}
            level={0}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

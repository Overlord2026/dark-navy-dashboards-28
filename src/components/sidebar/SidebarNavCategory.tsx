
import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarNavCategoryProps {
  id: string;
  label: string;
  items: NavItem[];
  isExpanded: boolean;
  onToggle: (id: string) => void;
  collapsed: boolean;
  isActive: (href: string) => boolean;
  isLightTheme: boolean;
  expandedSubmenus: Record<string, boolean>;
  toggleSubmenu: (id: string) => void;
}

interface SidebarNavItemProps {
  item: NavItem;
  isActive: (href: string) => boolean;
  isLightTheme: boolean;
  expandedSubmenus: Record<string, boolean>;
  toggleSubmenu: (id: string) => void;
  depth?: number;
  collapsed?: boolean;
}

// Recursive component for rendering nested navigation items with enhanced deep nesting support
const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  isActive,
  isLightTheme,
  expandedSubmenus,
  toggleSubmenu,
  depth = 0,
  collapsed = false
}) => {
  const Icon = item.icon;
  const normalizedHref = item.href ? (item.href.startsWith("/") ? item.href : `/${item.href}`) : "";
  const hasChildren = item.children && item.children.length > 0;
  const itemExpanded = expandedSubmenus[item.title] || false;
  
  // Enhanced indentation system for deeper nesting (supports up to 8 levels)
  const getIndentationClasses = (level: number) => {
    if (collapsed) return "px-3";
    
    const baseIndent = 12; // Base left padding in px (pl-3)
    const indentStep = 16; // 16px per level (pl-4 increment)
    const totalIndent = baseIndent + (level * indentStep);
    
    // Use style for precise control over deep indentation
    return "";
  };
  
  const getIndentationStyle = (level: number) => {
    if (collapsed) return {};
    
    const baseIndent = 12;
    const indentStep = 16;
    const totalIndent = baseIndent + (level * indentStep);
    
    return {
      paddingLeft: `${totalIndent}px`,
      paddingRight: '12px'
    };
  };
  
  // Visual hierarchy indicators
  const getDepthIndicator = (level: number) => {
    if (collapsed || level === 0) return null;
    
    return (
      <div className="absolute left-0 top-0 bottom-0 flex items-center">
        {Array.from({ length: level }, (_, i) => (
          <div
            key={i}
            className={cn(
              "w-px h-full",
              isLightTheme ? "bg-border/30" : "bg-border/20"
            )}
            style={{ left: `${12 + (i * 16) + 8}px` }}
          />
        ))}
      </div>
    );
  };

  if (collapsed && depth > 0) {
    return null; // Don't render nested items when sidebar is collapsed
  }

  if (hasChildren) {
    return (
      <div className="space-y-1 relative">
        {getDepthIndicator(depth)}
        <Collapsible
          open={itemExpanded}
          onOpenChange={() => toggleSubmenu(item.title)}
        >
          <CollapsibleTrigger asChild>
            <div 
              className={cn(
                "group flex items-center w-full py-2 rounded-md transition-colors cursor-pointer border relative",
                isActive(normalizedHref)
                  ? isLightTheme 
                    ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
                    : "bg-black text-white border-primary"
                  : isLightTheme ? "text-[#222222] border-transparent hover:bg-[#E9E7D8] hover:border-primary" 
                    : "text-[#E2E2E2] border-transparent hover:bg-sidebar-accent",
                // Add depth-based styling
                depth > 0 && "text-sm",
                depth > 1 && "text-xs",
                depth > 2 && isLightTheme ? "text-muted-foreground" : "text-muted-foreground"
              )}
              style={getIndentationStyle(depth)}
            >
              {/* Connection indicator for nested items */}
              {depth > 0 && (
                <div 
                  className={cn(
                    "absolute w-2 h-px",
                    isLightTheme ? "bg-border/40" : "bg-border/30"
                  )}
                  style={{ 
                    left: `${12 + ((depth - 1) * 16) + 8}px`,
                    top: "50%"
                  }}
                />
              )}
              
              {Icon && (
                <Icon className={cn(
                  "mr-3 flex-shrink-0",
                  depth === 0 ? "h-5 w-5" : "h-4 w-4"
                )} />
              )}
              <span className="flex-1 truncate">{item.title}</span>
              {!collapsed && (
                <div className="flex-shrink-0 ml-2">
                  {itemExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-1 relative">
            {item.children!.map((childItem) => (
              <SidebarNavItem
                key={childItem.title}
                item={childItem}
                isActive={isActive}
                isLightTheme={isLightTheme}
                expandedSubmenus={expandedSubmenus}
                toggleSubmenu={toggleSubmenu}
                depth={depth + 1}
                collapsed={collapsed}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }

  if (item.comingSoon || item.disabled) {
    return (
      <div className="relative">
        {getDepthIndicator(depth)}
        <div
          className={cn(
            "group flex items-center py-2 rounded-md transition-colors opacity-50 cursor-not-allowed border relative",
            isLightTheme ? "text-[#222222] border-transparent" : "text-[#E2E2E2] border-transparent",
            // Add depth-based styling
            depth > 0 && "text-sm",
            depth > 1 && "text-xs"
          )}
          style={getIndentationStyle(depth)}
          title={`${item.title} ${item.comingSoon ? "(Coming Soon)" : "(Disabled)"}`}
        >
          {/* Connection indicator for nested items */}
          {depth > 0 && (
            <div 
              className={cn(
                "absolute w-2 h-px",
                isLightTheme ? "bg-border/40" : "bg-border/30"
              )}
              style={{ 
                left: `${12 + ((depth - 1) * 16) + 8}px`,
                top: "50%"
              }}
            />
          )}
          
          {Icon && (
            <Icon className={cn(
              "mr-3 flex-shrink-0",
              depth === 0 ? "h-5 w-5" : "h-4 w-4"
            )} />
          )}
          <span className="flex-1 truncate">{item.title}</span>
          {!collapsed && item.comingSoon && (
            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">(Coming Soon)</span>
          )}
        </div>
      </div>
    );
  }

  if (!normalizedHref) {
    return (
      <div className="relative">
        {getDepthIndicator(depth)}
        <div 
          className={cn(
            "group flex items-center py-2 rounded-md transition-colors border relative",
            isLightTheme ? "text-[#222222] border-transparent" : "text-[#E2E2E2] border-transparent",
            // Add depth-based styling
            depth > 0 && "text-sm",
            depth > 1 && "text-xs"
          )}
          style={getIndentationStyle(depth)}
        >
          {/* Connection indicator for nested items */}
          {depth > 0 && (
            <div 
              className={cn(
                "absolute w-2 h-px",
                isLightTheme ? "bg-border/40" : "bg-border/30"
              )}
              style={{ 
                left: `${12 + ((depth - 1) * 16) + 8}px`,
                top: "50%"
              }}
            />
          )}
          
          {Icon && (
            <Icon className={cn(
              "mr-3 flex-shrink-0",
              depth === 0 ? "h-5 w-5" : "h-4 w-4"
            )} />
          )}
          <span className="flex-1 truncate">{item.title}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {getDepthIndicator(depth)}
      <Link
        to={normalizedHref}
        className={cn(
          "group flex items-center py-2 rounded-md transition-colors border relative",
          isActive(normalizedHref)
            ? isLightTheme 
              ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
              : "bg-black text-white border-primary"
            : isLightTheme ? "text-[#222222] border-transparent hover:bg-[#E9E7D8] hover:border-primary" 
              : "text-[#E2E2E2] border-transparent hover:bg-sidebar-accent",
          // Add depth-based styling
          depth > 0 && "text-sm",
          depth > 1 && "text-xs",
          depth > 2 && isLightTheme ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
        style={getIndentationStyle(depth)}
      >
        {/* Connection indicator for nested items */}
        {depth > 0 && (
          <div 
            className={cn(
              "absolute w-2 h-px",
              isLightTheme ? "bg-border/40" : "bg-border/30"
            )}
            style={{ 
              left: `${12 + ((depth - 1) * 16) + 8}px`,
              top: "50%"
            }}
          />
        )}
        
        {Icon && (
          <Icon className={cn(
            "mr-3 flex-shrink-0",
            depth === 0 ? "h-5 w-5" : "h-4 w-4"
          )} />
        )}
        <span className="truncate">{item.title}</span>
      </Link>
    </div>
  );
};

const SidebarNavCategory: React.FC<SidebarNavCategoryProps> = ({
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
  if (collapsed) {
    return (
      <div className="flex flex-col items-center space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const normalizedHref = item.href ? (item.href.startsWith("/") ? item.href : `/${item.href}`) : "";
          
          if (item.comingSoon || item.disabled || !normalizedHref) {
            return (
              <div
                key={item.title}
                className={cn(
                  "group flex items-center justify-center w-8 h-8 p-2 rounded-md transition-colors opacity-50 cursor-not-allowed",
                  isLightTheme ? "text-[#222222]" : "text-[#E2E2E2]"
                )}
                title={`${item.title} ${item.comingSoon ? "(Coming Soon)" : item.disabled ? "(Disabled)" : ""}`}
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
                "group flex items-center justify-center w-8 h-8 p-2 rounded-md transition-colors border",
                isActive(normalizedHref)
                  ? isLightTheme 
                    ? "bg-[#E9E7D8] text-[#222222] border-primary" 
                    : "bg-black text-white border-primary"
                  : isLightTheme ? "text-[#222222] border-transparent hover:bg-[#E9E7D8] hover:border-primary" 
                    : "text-[#E2E2E2] border-transparent hover:bg-sidebar-accent"
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
      onOpenChange={() => onToggle(id)}
    >
      <CollapsibleTrigger asChild>
        <div className={cn(
          "flex items-center justify-between w-full p-2 text-xs uppercase tracking-wider font-semibold cursor-pointer transition-colors",
          isLightTheme ? "text-[#222222]/70 hover:text-[#222222]" : "text-[#E2E2E2]/70 hover:text-[#E2E2E2]"
        )}>
          <span>{label}</span>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1">
        {items.map((item) => (
          <SidebarNavItem
            key={item.title}
            item={item}
            isActive={isActive}
            isLightTheme={isLightTheme}
            expandedSubmenus={expandedSubmenus}
            toggleSubmenu={toggleSubmenu}
            depth={0}
            collapsed={collapsed}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SidebarNavCategory;


import React from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { NavItem, NavSection, navSections } from "./navigationConfig";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SidebarSectionProps {
  section: NavSection;
  isOpen: boolean;
  toggleSection: (sectionId: string) => void;
  isCollapsed: boolean;
  currentPath: string;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  section,
  isOpen,
  toggleSection,
  isCollapsed,
  currentPath
}) => {
  const { hasRole } = useRoleCheck();
  
  // Check if the section has role requirements
  if (section.requireRoles && section.requireRoles.length > 0) {
    // Check if the user has any of the required roles
    const hasRequiredRole = section.requireRoles.some(role => hasRole(role));
    
    // If the user doesn't have any of the required roles, don't display this section
    if (!hasRequiredRole) {
      return null;
    }
  }
  
  const isActive = (path: string): boolean => {
    // Check for direct route match
    if (path === currentPath) return true;
    
    // Check for query param match (dashboard with segment)
    if (path.includes('?') && 
        currentPath.split('?')[0] === path.split('?')[0] && 
        currentPath.includes(path.split('?')[1])) {
      return true;
    }
    
    return false;
  };

  // Use the icon component directly
  const SectionIcon = section.icon;

  if (section.href) {
    // Single link section (like Collaboration)
    return (
      <a
        href={section.href}
        className={cn(
          "flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors",
          currentPath === section.href && "bg-muted font-medium",
          isCollapsed && "justify-center"
        )}
      >
        {section.icon && <SectionIcon size={18} />}
        {!isCollapsed && <span>{section.label}</span>}
      </a>
    );
  }

  if (isCollapsed) {
    // Collapsed view shows just icons
    return (
      <div className="mb-3">
        <div className="flex justify-center p-2">
          <SectionIcon size={18} />
        </div>
        {isOpen && section.items && (
          <div className="space-y-1">
            {section.items.filter(item => {
              // Filter items based on role requirements
              if (item.requireRoles && item.requireRoles.length > 0) {
                return item.requireRoles.some(role => hasRole(role));
              }
              return true;
            }).map((item) => {
              const ItemIcon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex justify-center p-2 rounded-md hover:bg-muted transition-colors",
                    isActive(item.href) && "bg-muted"
                  )}
                >
                  <ItemIcon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Expanded view with items
  return (
    <div className="mb-3">
      <button
        className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted transition-colors"
        onClick={() => toggleSection(section.id)}
      >
        <div className="flex items-center gap-2">
          <SectionIcon size={18} />
          <span>{section.label}</span>
        </div>
        {isOpen ? (
          <ChevronUp size={16} />
        ) : (
          <ChevronDown size={16} />
        )}
      </button>
      
      {isOpen && section.items && (
        <div className="mt-1 ml-6 space-y-1">
          {section.items.filter(item => {
            // Filter items based on role requirements
            if (item.requireRoles && item.requireRoles.length > 0) {
              return item.requireRoles.some(role => hasRole(role));
            }
            return true;
          }).map((item) => {
            const ItemIcon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-md text-sm hover:bg-muted transition-colors",
                  isActive(item.href) && "bg-muted font-medium"
                )}
              >
                <ItemIcon className="h-4 w-4" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SidebarSection;

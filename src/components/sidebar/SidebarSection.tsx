
import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavSection {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  items?: NavItem[];
}

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

  const SectionIcon = section.icon;

  if (section.href) {
    // Single link section (like Collaboration)
    return (
      <Link
        to={section.href}
        className={cn(
          "flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors",
          currentPath === section.href && "bg-muted font-medium",
          isCollapsed && "justify-center"
        )}
      >
        {<SectionIcon size={18} />}
        {!isCollapsed && <span>{section.label}</span>}
      </Link>
    );
  }

  if (isCollapsed) {
    // Collapsed view shows just icons
    return (
      <div className="mb-3">
        <div className="flex justify-center p-2">
          {<SectionIcon size={18} />}
        </div>
        {isOpen && section.items && (
          <div className="space-y-1">
            {section.items.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "flex justify-center p-2 rounded-md hover:bg-muted transition-colors",
                  isActive(item.href) && "bg-muted"
                )}
              >
                {item.icon}
              </Link>
            ))}
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
          {<SectionIcon size={18} />}
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
          {section.items.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-2 p-2 rounded-md text-sm hover:bg-muted transition-colors",
                isActive(item.href) && "bg-muted font-medium"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

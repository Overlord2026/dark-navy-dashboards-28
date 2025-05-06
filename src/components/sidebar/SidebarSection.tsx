
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ label, href, icon, isActive }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
        isActive 
          ? "bg-accent/30 text-accent-foreground font-medium" 
          : "hover:bg-accent/20 text-foreground/80"
      )}
    >
      <span className="mr-2">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

interface SidebarSectionProps {
  title: string;
  icon: React.ElementType;
  items: Array<{
    label: string;
    href: string;
    icon: React.ElementType;
  }>;
  isOpen: boolean;
  onToggle: () => void;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  icon: Icon,
  items,
  isOpen,
  onToggle,
}) => {
  const location = useLocation();
  const hasActiveItem = items.some(item => location.pathname === item.href);
  
  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between p-2 text-sm rounded-md transition-colors",
          hasActiveItem ? "text-accent-foreground" : "text-foreground/80",
          "hover:bg-accent/10"
        )}
      >
        <div className="flex items-center">
          <Icon className="h-5 w-5 mr-2" />
          <span className="font-medium">{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      {isOpen && (
        <div className="mt-1 ml-4 space-y-1 pl-2 border-l border-border/50">
          {items.map((item, index) => (
            <SidebarItem
              key={index}
              label={item.label}
              href={item.href}
              icon={<item.icon className="h-4 w-4" />}
              isActive={location.pathname === item.href}
            />
          ))}
        </div>
      )}
    </div>
  );
};

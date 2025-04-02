
import { useState, useEffect } from "react";
import { NavCategory } from "@/types/navigation";
import { useLocation } from "react-router-dom";

export const useSidebarState = (navigationCategories: NavCategory[]) => {
  const location = useLocation();
  
  const [collapsed, setCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    navigationCategories.reduce((acc, category) => {
      acc[category.id] = category.defaultExpanded ?? false;
      return acc;
    }, {} as Record<string, boolean>)
  );
  const [expandedSubmenus, setExpandedSubmenus] = useState<Record<string, boolean>>({});
  const [forceUpdate, setForceUpdate] = useState(0);
  
  useEffect(() => {
    setForceUpdate(1);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleSubmenu = (itemTitle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedSubmenus(prev => ({
      ...prev,
      [itemTitle]: !prev[itemTitle]
    }));
  };

  const isActive = (href: string) => {
    return location.pathname === href || 
           (href !== "/" && location.pathname.startsWith(href));
  };

  return {
    collapsed,
    expandedCategories,
    expandedSubmenus,
    forceUpdate,
    toggleSidebar,
    toggleCategory,
    toggleSubmenu,
    isActive,
    setCollapsed
  };
};

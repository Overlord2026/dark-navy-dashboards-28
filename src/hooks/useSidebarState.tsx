
import { useState, useEffect } from "react";
import { NavCategory } from "@/types/navigation";
import { useLocation } from "react-router-dom";

export const useSidebarState = (navigationCategories: NavCategory[]) => {
  const location = useLocation();
  
  // Check for stored sidebar state in localStorage - default to expanded on desktop
  const storedCollapsed = localStorage.getItem('sidebar-collapsed');
  const initialCollapsed = storedCollapsed ? storedCollapsed === 'true' : false;
  
  const [collapsed, setCollapsed] = useState(initialCollapsed);
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

  // Update localStorage when sidebar state changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', collapsed.toString());
  }, [collapsed]);

  // Expand categories based on current location
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Find categories with items matching the current path
    navigationCategories.forEach(category => {
      const hasMatchingItem = category.items.some(item => 
        currentPath === item.href || 
        (item.href !== "/" && currentPath.startsWith(item.href))
      );
      
      if (hasMatchingItem) {
        setExpandedCategories(prev => ({
          ...prev,
          [category.id]: true
        }));
      }
    });
  }, [location.pathname, navigationCategories]);

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

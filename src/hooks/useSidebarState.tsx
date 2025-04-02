
import { useState, useEffect } from "react";
import { NavCategory } from "@/types/navigation";
import { useLocation } from "react-router-dom";

export function useSidebarState(navigationCategories: NavCategory[]) {
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
  
  // Auto-expand submenu when a child route is active
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Check all navigation categories for matching submenu items
    navigationCategories.forEach(category => {
      category.items.forEach(item => {
        if (item.submenu) {
          const hasActiveChild = item.submenu.some(subItem => 
            currentPath === subItem.href || 
            (subItem.href !== "/" && currentPath.startsWith(subItem.href))
          );
          
          if (hasActiveChild) {
            // Expand the submenu with the active child
            setExpandedSubmenus(prev => ({
              ...prev,
              [item.title]: true
            }));
            
            // Also expand the parent category
            setExpandedCategories(prev => ({
              ...prev,
              [category.id]: true
            }));
          }
        }
      });
    });
  }, [location.pathname, navigationCategories]);
  
  // Initial force update to ensure proper rendering
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
    
    // Toggle the clicked submenu
    setExpandedSubmenus(prev => ({
      ...prev,
      [itemTitle]: !prev[itemTitle]
    }));
  };

  const isActive = (href: string) => {
    // Special case for "#" links (like Banking parent menu)
    if (href === "#") {
      return false;
    }
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
}

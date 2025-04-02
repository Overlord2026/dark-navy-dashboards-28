
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
    let hasExpandedSubmenu = false;
    
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
            
            hasExpandedSubmenu = true;
          }
        }
      });
    });
    
    // If no submenu was expanded, we'll still check for direct matches
    if (!hasExpandedSubmenu) {
      navigationCategories.forEach(category => {
        const hasDirectMatch = category.items.some(item => 
          item.href !== '#' && (currentPath === item.href || 
          (item.href !== "/" && currentPath.startsWith(item.href)))
        );
        
        if (hasDirectMatch) {
          // Expand the category with the direct match
          setExpandedCategories(prev => ({
            ...prev,
            [category.id]: true
          }));
        }
      });
    }
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
    
    // Check for exact match first
    if (location.pathname === href) {
      return true;
    }
    
    // For non-root links, check if the current path starts with the href
    if (href !== "/" && location.pathname.startsWith(href)) {
      // Make sure we're not getting false positives
      // For example, /insurance shouldn't match /insurance-claims
      // But we still want /accounts/settings to match /accounts
      const nextCharInPath = location.pathname.charAt(href.length);
      if (nextCharInPath === "" || nextCharInPath === "/") {
        return true;
      }
    }
    
    return false;
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

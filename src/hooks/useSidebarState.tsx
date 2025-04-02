
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
    
    // First pass: Check for submenu item exact matches (highest priority)
    navigationCategories.forEach(category => {
      category.items.forEach(item => {
        if (item.submenu) {
          // Check if any submenu items match the current path
          const hasActiveChild = item.submenu.some(subItem => {
            return isActive(subItem.href);
          });
          
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
    
    // Second pass: Check for direct item matches if no submenu was expanded
    if (!hasExpandedSubmenu) {
      navigationCategories.forEach(category => {
        // Skip items with href="#" as they're just parent menu items
        const hasDirectMatch = category.items.some(item => {
          if (item.href === "#") {
            return false;
          }
          
          return isActive(item.href);
        });
        
        if (hasDirectMatch) {
          // Expand the category with the direct match
          setExpandedCategories(prev => ({
            ...prev,
            [category.id]: true
          }));
        }
      });
    }
    
    // Force a rerender to ensure UI reflects current state
    setForceUpdate(prev => prev + 1);
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
    // Prevent default behavior for parent menu items with "#" href
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle the clicked submenu
    setExpandedSubmenus(prev => ({
      ...prev,
      [itemTitle]: !prev[itemTitle]
    }));
  };

  const isActive = (href: string) => {
    // Special case for "#" links (parent menu items)
    if (href === "#") {
      return false;
    }
    
    // Check for exact match first (highest priority)
    if (location.pathname === href) {
      return true;
    }
    
    // For non-root links, check if the current path starts with the href
    if (href !== "/" && href !== "#" && location.pathname.startsWith(href)) {
      // Make sure we're not getting false positives
      // For example, /insurance shouldn't match /insurance-claims
      const nextCharInPath = location.pathname.charAt(href.length);
      if (nextCharInPath === "" || nextCharInPath === "/") {
        return true;
      }
    }
    
    return false;
  };

  /**
   * Checks if a parent menu with submenu has any active child
   */
  const hasActiveChild = (submenuItems: any[]) => {
    if (!submenuItems || submenuItems.length === 0) {
      return false;
    }
    
    return submenuItems.some(subItem => isActive(subItem.href));
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
    hasActiveChild,
    setCollapsed
  };
}

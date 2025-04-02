
import { useState, useEffect, useCallback } from "react";
import { NavCategory } from "@/types/navigation";
import { useLocation } from "react-router-dom";
import { logger } from "@/services/logging/loggingService";

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
  
  // Determine if a link is active
  const isActive = useCallback((href: string) => {
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
  }, [location.pathname]);
  
  /**
   * Checks if a parent menu with submenu has any active child
   */
  const hasActiveChild = useCallback((submenuItems: any[]) => {
    if (!submenuItems || submenuItems.length === 0) {
      return false;
    }
    
    return submenuItems.some(subItem => isActive(subItem.href));
  }, [isActive]);
  
  // Auto-expand submenu when a child route is active
  useEffect(() => {
    let stateChanged = false;
    const newSubmenuState = {...expandedSubmenus};
    const newCategoryState = {...expandedCategories};
    
    // First pass: Check for submenu item exact matches (highest priority)
    navigationCategories.forEach(category => {
      category.items.forEach(item => {
        if (item.submenu) {
          // Check if any submenu items match the current path
          const itemHasActiveChild = hasActiveChild(item.submenu);
          
          if (itemHasActiveChild && !expandedSubmenus[item.title]) {
            logger.debug(`Auto-expanding submenu "${item.title}" because it has an active child`, 
              { title: item.title, path: location.pathname }, "SidebarState");
            
            // Expand the submenu with the active child
            newSubmenuState[item.title] = true;
            
            // Also expand the parent category
            newCategoryState[category.id] = true;
            
            stateChanged = true;
          }
        }
      });
    });
    
    // Second pass: Check for direct item matches if no submenu was expanded
    if (!stateChanged) {
      navigationCategories.forEach(category => {
        // Skip items with href="#" as they're just parent menu items
        const hasDirectMatch = category.items.some(item => {
          if (item.href === "#") {
            return false;
          }
          
          return isActive(item.href);
        });
        
        if (hasDirectMatch && !expandedCategories[category.id]) {
          // Expand the category with the direct match
          newCategoryState[category.id] = true;
          stateChanged = true;
        }
      });
    }
    
    // Only update state if changes were made
    if (stateChanged) {
      setExpandedSubmenus(newSubmenuState);
      setExpandedCategories(newCategoryState);
      // Force a rerender to ensure UI reflects current state
      setForceUpdate(prev => prev + 1);
    }
  }, [location.pathname, navigationCategories, hasActiveChild, isActive, expandedSubmenus, expandedCategories]);

  const toggleSidebar = () => {
    logger.debug(`Toggling sidebar collapsed state`, 
      { wasCollapsed: collapsed, willBe: !collapsed }, "SidebarState");
    setCollapsed(!collapsed);
  };

  const toggleCategory = (categoryId: string) => {
    logger.debug(`Toggling category "${categoryId}"`, 
      { categoryId, wasExpanded: expandedCategories[categoryId] }, "SidebarState");
    
    setExpandedCategories(prev => {
      const newState = {
        ...prev,
        [categoryId]: !prev[categoryId]
      };
      
      logger.debug(`Category state updated: "${categoryId}"`, 
        { before: prev[categoryId], after: !prev[categoryId] }, "SidebarState");
      
      return newState;
    });
  };

  // Robust submenu toggle implementation with synchronous state tracking
  const toggleSubmenu = (itemTitle: string, e: React.MouseEvent) => {
    // Always prevent default behavior to stop navigation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    logger.debug(`Toggling submenu "${itemTitle}"`, 
      { itemTitle, wasExpanded: expandedSubmenus[itemTitle] }, "SidebarState");
    
    // Using function form of setState to ensure we're working with the latest state
    setExpandedSubmenus(prevState => {
      const currentlyExpanded = Boolean(prevState[itemTitle]);
      const newExpanded = !currentlyExpanded;
      
      logger.debug(`Submenu state transition: "${itemTitle}" ${currentlyExpanded ? "expanded" : "collapsed"} -> ${newExpanded ? "expanded" : "collapsed"}`, 
        { itemTitle, before: currentlyExpanded, after: newExpanded }, "SidebarState");
      
      const newState = { ...prevState, [itemTitle]: newExpanded };
      
      // Trigger a force update in the next microtask
      queueMicrotask(() => setForceUpdate(prev => prev + 1));
      
      return newState;
    });
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


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
      logger.debug(`Exact match found for ${href}`, { href, pathname: location.pathname }, "isActive");
      return true;
    }
    
    // For non-root links, check if the current path starts with the href
    if (href !== "/" && href !== "#" && location.pathname.startsWith(href)) {
      // Make sure we're not getting false positives
      // For example, /insurance shouldn't match /insurance-claims
      const nextCharInPath = location.pathname.charAt(href.length);
      if (nextCharInPath === "" || nextCharInPath === "/") {
        logger.debug(`Partial match found for ${href}`, { href, pathname: location.pathname }, "isActive");
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
    
    const hasActive = submenuItems.some(subItem => isActive(subItem.href));
    if (hasActive) {
      logger.debug(`Found active child in submenu`, 
        { items: submenuItems.map(i => i.title), pathname: location.pathname }, "hasActiveChild");
    }
    
    return hasActive;
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
          const itemHasActiveChild = hasActiveChild(item.submenu || []);
          
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

  // Improved submenu toggling to ensure state changes are properly registered
  const toggleSubmenu = (itemTitle: string, e: React.MouseEvent) => {
    // Always prevent default behavior to stop navigation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Log the current state before making changes
    logger.debug(`Toggling submenu "${itemTitle}"`, 
      { title: itemTitle, currentState: expandedSubmenus[itemTitle] ? "expanded" : "collapsed" }, "SubmenuToggle");
    
    // Update the state with a completely new object to ensure React detects the change
    setExpandedSubmenus(prev => {
      const newState = {...prev, [itemTitle]: !prev[itemTitle]};
      
      // Enhanced logging for debugging submenu state transitions
      logger.debug(`Submenu "${itemTitle}" state transition`, 
        { 
          from: prev[itemTitle] ? "expanded" : "collapsed", 
          to: newState[itemTitle] ? "expanded" : "collapsed",
          allSubmenus: JSON.stringify({...prev, [itemTitle]: !prev[itemTitle]})
        }, 
        "SubmenuToggle");
      
      return newState;
    });
    
    // Force a rerender to ensure UI reflects current state
    setForceUpdate(prev => prev + 1);
  };

  // Debug function to log the current state
  const debugState = () => {
    logger.debug("Current sidebar state", {
      collapsed,
      expandedCategories: JSON.stringify(expandedCategories),
      expandedSubmenus: JSON.stringify(expandedSubmenus),
      forceUpdate
    }, "SidebarStateDebug");
    
    return { collapsed, expandedCategories, expandedSubmenus, forceUpdate };
  };

  // Function to expand a specific submenu
  const expandSubmenu = (itemTitle: string) => {
    if (!expandedSubmenus[itemTitle]) {
      logger.debug(`Manually expanding submenu "${itemTitle}"`, 
        { currentState: "collapsed", newState: "expanded" }, "ExpandSubmenu");
      
      setExpandedSubmenus(prev => ({
        ...prev,
        [itemTitle]: true
      }));
      
      // Force a rerender
      setForceUpdate(prev => prev + 1);
    }
  };

  // Function to collapse a specific submenu
  const collapseSubmenu = (itemTitle: string) => {
    if (expandedSubmenus[itemTitle]) {
      logger.debug(`Manually collapsing submenu "${itemTitle}"`, 
        { currentState: "expanded", newState: "collapsed" }, "CollapseSubmenu");
      
      setExpandedSubmenus(prev => ({
        ...prev,
        [itemTitle]: false
      }));
      
      // Force a rerender
      setForceUpdate(prev => prev + 1);
    }
  };

  return {
    collapsed,
    expandedCategories,
    expandedSubmenus,
    forceUpdate,
    toggleSidebar,
    toggleCategory,
    toggleSubmenu,
    expandSubmenu,
    collapseSubmenu,
    isActive,
    hasActiveChild,
    setCollapsed,
    debugState,
    setForceUpdate
  };
}

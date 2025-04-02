
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

  // Completely rewritten submenu toggle implementation to ensure reliable operation
  const toggleSubmenu = (itemTitle: string, e: React.MouseEvent) => {
    // Always prevent default behavior to stop navigation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    logger.debug(`EXPLICIT TOGGLE: Submenu "${itemTitle}"`, 
      { title: itemTitle, currentState: expandedSubmenus[itemTitle] ? "expanded" : "collapsed" }, "SidebarState");
    
    // Set a direct value rather than using functional updates to ensure deterministic behavior
    const newState = !expandedSubmenus[itemTitle];
    
    setExpandedSubmenus(prev => {
      const updatedState = { ...prev, [itemTitle]: newState };
      
      // Special debugging for Banking menu
      if (itemTitle === "Banking") {
        logger.debug("BANKING MENU STATE UPDATE", {
          was: prev["Banking"] ? "expanded" : "collapsed",
          willBe: newState ? "expanded" : "collapsed",
          allSubmenus: JSON.stringify(updatedState),
          timestamp: new Date().toISOString()
        }, "BankingMenu");
      }
      
      return updatedState;
    });
    
    // Forcibly update UI to ensure changes are applied
    setForceUpdate(prev => prev + 1);
    
    // Double-check that state was updated as expected after a short delay
    setTimeout(() => {
      logger.debug(`Submenu toggle verification for "${itemTitle}"`, {
        expectedState: newState,
        actualState: expandedSubmenus[itemTitle],
        forceUpdateCounter: forceUpdate
      }, "SidebarState");
      
      // If the state didn't update as expected, force another update
      if (expandedSubmenus[itemTitle] !== newState) {
        logger.debug(`Correcting submenu state for "${itemTitle}"`, {
          current: expandedSubmenus[itemTitle],
          shouldBe: newState
        }, "SidebarState");
        
        setExpandedSubmenus(prev => ({ ...prev, [itemTitle]: newState }));
        setForceUpdate(prev => prev + 1);
      }
    }, 50);
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

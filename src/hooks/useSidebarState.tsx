
import { useState, useEffect } from "react";
import { NavCategory, NavItem } from "@/types/navigation";
import { useLocation } from "react-router-dom";

export const useSidebarState = (navigationCategories: NavCategory[]) => {
  const location = useLocation();
  
  // Initialize with collapsed set to false for desktop view
  const [collapsed, setCollapsed] = useState(false);
  
  // Initialize with all categories expanded by default
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    navigationCategories.reduce((acc, category) => {
      acc[category.id] = category.defaultExpanded ?? true; // Always default to true for better visibility
      return acc;
    }, {} as Record<string, boolean>)
  );
  
  const [expandedSubmenus, setExpandedSubmenus] = useState<Record<string, boolean>>({});
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Helper function to normalize paths
  const normalizePath = (path: string): string => {
    return path.startsWith("/") ? path : `/${path}`;
  };
  
  // Check window width on mount and resize to set collapsed state
  useEffect(() => {
    const handleResize = () => {
      // Only collapse automatically on mobile screens (under 768px)
      setCollapsed(window.innerWidth < 768);
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    // Expand relevant category based on current route
    const path = location.pathname;
    let shouldExpandCategory = '';
    let shouldExpandSubmenu = '';
    
    console.log("Current path for category expansion:", path);
    
    // Find which category contains the current path
    navigationCategories.forEach(category => {
      const matchingItem = category.items.find(item => {
        const itemPath = normalizePath(item.href);
        const isMatch = path === itemPath || path.startsWith(`${itemPath}/`);
        console.log(`Checking category ${category.id}, item ${item.title}: ${itemPath} vs ${path} = ${isMatch}`);
        return isMatch;
      });
      
      if (matchingItem) {
        shouldExpandCategory = category.id;
        console.log(`Found matching item: ${matchingItem.title} in category: ${category.id}`);
        
        // If the item has submenus, expand the relevant submenu too
        if (matchingItem.submenu?.length) {
          const matchingSubmenu = matchingItem.submenu.find(subItem => {
            const subItemPath = normalizePath(subItem.href);
            return path === subItemPath || path.startsWith(`${subItemPath}/`);
          });
          
          if (matchingSubmenu) {
            shouldExpandSubmenu = `${category.id}-${matchingItem.title}`;
            console.log(`Found matching submenu: ${matchingSubmenu.title} in ${matchingItem.title}`);
          }
        }
      }
    });
    
    // Expand the relevant category if found
    if (shouldExpandCategory) {
      console.log(`Expanding category: ${shouldExpandCategory}`);
      setExpandedCategories(prev => ({
        ...prev,
        [shouldExpandCategory]: true
      }));
    }
    
    // Expand the relevant submenu if found
    if (shouldExpandSubmenu) {
      console.log(`Expanding submenu: ${shouldExpandSubmenu}`);
      setExpandedSubmenus(prev => ({
        ...prev,
        [shouldExpandSubmenu]: true
      }));
    }
    
    // Force a re-render to ensure everything is up to date
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

  const toggleSubmenu = (submenuKey: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log(`Toggling submenu: ${submenuKey}`);
    setExpandedSubmenus(prev => ({
      ...prev,
      [submenuKey]: !prev[submenuKey]
    }));
  };

  const isActive = (href: string) => {
    const normalizedHref = normalizePath(href);
    const normalizedPathname = normalizePath(location.pathname);
    
    console.log("Checking isActive - href:", normalizedHref, "pathname:", normalizedPathname);
    
    // Exact match takes priority
    if (normalizedPathname === normalizedHref) {
      console.log("Exact match found for:", normalizedHref);
      return true;
    }
    
    // Prefix matching for sub-routes, but avoid false positives
    if (normalizedHref !== "/" && normalizedPathname.startsWith(normalizedHref + "/")) {
      console.log("Prefix match found for:", normalizedHref);
      return true;
    }
    
    console.log("No match for:", normalizedHref);
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
};

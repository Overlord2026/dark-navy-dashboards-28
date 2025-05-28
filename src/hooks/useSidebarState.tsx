
import { useState, useEffect, useCallback } from "react";
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
  
  // Use useCallback to prevent unnecessary re-renders
  const updateCategoriesForRoute = useCallback((path: string) => {
    let shouldExpandCategory = '';
    
    // Find which category contains the current path
    navigationCategories.forEach(category => {
      const matchingItem = category.items.find(item => {
        const itemPath = normalizePath(item.href);
        return path === itemPath || path.startsWith(`${itemPath}/`);
      });
      
      if (matchingItem) {
        shouldExpandCategory = category.id;
        
        // If the item has submenus, expand the relevant submenu too
        if (matchingItem.items?.length) {
          const matchingSubmenu = matchingItem.items.find(subItem => {
            const subItemPath = normalizePath(subItem.href);
            return path === subItemPath || path.startsWith(`${subItemPath}/`);
          });
          
          if (matchingSubmenu) {
            setExpandedSubmenus(prev => ({
              ...prev,
              [matchingItem.title]: true
            }));
          }
        }
      }
    });
    
    // Expand the relevant category if found
    if (shouldExpandCategory) {
      setExpandedCategories(prev => ({
        ...prev,
        [shouldExpandCategory]: true
      }));
    }
  }, [navigationCategories]);
  
  useEffect(() => {
    updateCategoriesForRoute(location.pathname);
  }, [location.pathname, updateCategoriesForRoute]);

  const toggleSidebar = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  const toggleSubmenu = useCallback((itemTitle: string) => {
    setExpandedSubmenus(prev => ({
      ...prev,
      [itemTitle]: !prev[itemTitle]
    }));
  }, []);

  const isActive = useCallback((href: string) => {
    const normalizedHref = normalizePath(href);
    const normalizedPathname = normalizePath(location.pathname);
    
    return normalizedPathname === normalizedHref || 
           (normalizedHref !== "/" && normalizedPathname.startsWith(normalizedHref));
  }, [location.pathname]);

  return {
    collapsed,
    expandedCategories,
    expandedSubmenus,
    toggleSidebar,
    toggleCategory,
    toggleSubmenu,
    isActive,
    setCollapsed
  };
};

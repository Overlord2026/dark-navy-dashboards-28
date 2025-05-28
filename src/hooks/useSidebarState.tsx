
import { useState, useEffect, useCallback, useRef } from "react";
import { NavCategory, NavItem } from "@/types/navigation";
import { useLocation } from "react-router-dom";

export const useSidebarState = (navigationCategories: NavCategory[]) => {
  const location = useLocation();
  const scrollPositionRef = useRef<number>(0);
  
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
  const normalizePath = useCallback((path: string): string => {
    return path.startsWith("/") ? path : `/${path}`;
  }, []);
  
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
  
  // Save scroll position when navigating
  useEffect(() => {
    // Save the current scroll position for the sidebar when component mounts
    const sidebarElement = document.querySelector('.overflow-y-auto');
    if (sidebarElement) {
      sidebarElement.scrollTop = scrollPositionRef.current;
      
      // Set up an event listener to save scroll position when user scrolls
      const handleScroll = () => {
        scrollPositionRef.current = sidebarElement.scrollTop;
      };
      
      sidebarElement.addEventListener('scroll', handleScroll);
      return () => {
        sidebarElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [location.pathname]); // Restore position when path changes
  
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
  }, [navigationCategories, normalizePath]);
  
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
  }, [location.pathname, normalizePath]);

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

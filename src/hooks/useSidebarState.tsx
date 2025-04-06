
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
    
    // Find which category contains the current path
    navigationCategories.forEach(category => {
      const matchingItem = category.items.find(item => 
        path === item.href || path.startsWith(`${item.href}/`)
      );
      
      if (matchingItem) {
        shouldExpandCategory = category.id;
        
        // If the item has submenus, expand the relevant submenu too
        if (matchingItem.items?.length) {
          const matchingSubmenu = matchingItem.items.find(subItem => 
            path === subItem.href || path.startsWith(`${subItem.href}/`)
          );
          
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

  const toggleSubmenu = (itemTitle: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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

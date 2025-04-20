
import { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { navigationCategories } from "@/config/navigation";

export const useNavigation = () => {
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    navigationCategories.reduce((acc, category) => ({
      ...acc,
      [category.id]: category.defaultExpanded ?? false
    }), {})
  );

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  const isActive = useCallback((href: string) => {
    return location.pathname === href;
  }, [location.pathname]);

  return {
    expandedCategories,
    toggleCategory,
    isActive
  };
};

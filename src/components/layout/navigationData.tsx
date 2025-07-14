
import React from "react";
import { hierarchicalNav, navigationData } from "@/components/navigation/HierarchicalNavigationConfig";
import { NavCategory, NavItem } from "@/types/navigation";

// Convert hierarchical navigation to legacy format for backward compatibility
export const navigationCategories: NavCategory[] = hierarchicalNav.map(item => ({
  id: item.id || item.title.toLowerCase().replace(/\s+/g, '-'),
  title: item.title,
  label: item.title,
  items: item.children || [item],
  defaultExpanded: true
}));

// Export hierarchical navigation for new components
export { hierarchicalNav };

export const getSecondaryMenuItems = (activeMainItem: string) => {
  // Return appropriate secondary menu items based on the active main item
  // This is a placeholder function that can be expanded as needed
  return [];
};

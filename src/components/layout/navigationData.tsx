
import React from "react";
import { hierarchicalNav, navigationData } from "@/components/navigation/HierarchicalNavigationConfig";
import { NavCategory, NavItem } from "@/types/navigation";
import { MessageCircle } from "lucide-react";

// Convert hierarchical navigation to legacy format for backward compatibility
export const navigationCategories: NavCategory[] = [
  ...hierarchicalNav.map(item => {
    // Only include items that have children for legacy category format
    if (!item.children || item.children.length === 0) {
      return null;
    }
    
    return {
      id: item.id || item.title.toLowerCase().replace(/\s+/g, '-'),
      title: item.title,
      label: item.title,
      items: item.children,
      defaultExpanded: true
    };
  }).filter(Boolean) as NavCategory[],
  // Add Secure Messages category
  {
    id: 'secure-messages',
    title: 'Secure Messages',
    label: 'Secure Messages',
    items: [
      {
        title: 'Messages',
        href: '/secure-messages',
        icon: MessageCircle
      }
    ],
    defaultExpanded: true
  }
];

// Export hierarchical navigation for new components
export { hierarchicalNav };

export const getSecondaryMenuItems = (activeMainItem: string) => {
  // Return appropriate secondary menu items based on the active main item
  // This is a placeholder function that can be expanded as needed
  return [];
};

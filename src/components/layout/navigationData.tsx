
import React from "react";
import {
  homeNavItems,
  educationSolutionsNavItems,
  healthcareOptimizationNavItems,
  familyWealthNavItems,
  collaborationNavItems,
  bottomNavItems
} from "@/components/navigation/NavigationConfig";
import { NavCategory } from "@/types/navigation";

export const navigationCategories: NavCategory[] = [
  {
    id: "home",
    title: "Home",
    label: "Home",
    items: homeNavItems,
    defaultExpanded: true
  },
  {
    id: "education-solutions", 
    title: "Education & Solutions",
    label: "Education & Solutions",
    items: educationSolutionsNavItems,
    defaultExpanded: true
  },
  {
    id: "healthcare-optimization",
    title: "Healthcare Optimization",
    label: "Healthcare Optimization", 
    items: healthcareOptimizationNavItems,
    defaultExpanded: true
  },
  {
    id: "family-wealth",
    title: "Family Wealth",
    label: "Family Wealth", 
    items: familyWealthNavItems.map(item => 
      item.title === "Bill Pay" 
        ? { ...item, comingSoon: true }
        : item
    ),
    defaultExpanded: true
  },
  {
    id: "collaboration",
    title: "Collaboration & Sharing",
    label: "Collaboration & Sharing",
    items: collaborationNavItems,
    defaultExpanded: true
  },
  {
    id: "bottom",
    title: "Support",
    label: "Support",
    items: bottomNavItems,
    defaultExpanded: true
  }
];

export const getSecondaryMenuItems = (activeMainItem: string) => {
  // Return appropriate secondary menu items based on the active main item
  // This is a placeholder function that can be expanded as needed
  return [];
};

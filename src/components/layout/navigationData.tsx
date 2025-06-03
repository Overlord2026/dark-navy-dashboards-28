
import React from "react";
import {
  homeNavItems,
  educationSolutionsNavItems,
  familyWealthNavItems,
  collaborationNavItems,
  bottomNavItems
} from "@/components/navigation/NavigationConfig";
import { NavCategory } from "@/types/navigation";

export const navigationCategories: NavCategory[] = [
  {
    id: "home",
    label: "Home",
    items: homeNavItems,
    defaultExpanded: true
  },
  {
    id: "education-solutions", 
    label: "Education & Solutions",
    items: educationSolutionsNavItems,
    defaultExpanded: true
  },
  {
    id: "family-wealth",
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
    label: "Collaboration & Sharing",
    items: collaborationNavItems,
    defaultExpanded: true
  },
  {
    id: "bottom",
    label: "Support",
    items: bottomNavItems,
    defaultExpanded: true
  }
];

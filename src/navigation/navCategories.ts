
import { NavCategory } from "@/types/navigation";
import { homeNavItems } from "./homeNavigation";
import { educationSolutionsNavItems } from "./educationNavigation";
import { familyWealthNavItems } from "./familyWealthNavigation";
import { collaborationNavItems } from "./collaborationNavigation";

export const navigationCategories: NavCategory[] = [
  {
    id: "home",
    label: "HOME",
    items: homeNavItems,
    defaultExpanded: true
  },
  {
    id: "education-solutions",
    label: "EDUCATION & SOLUTIONS",
    items: educationSolutionsNavItems,
    defaultExpanded: true
  },
  {
    id: "family-wealth",
    label: "FAMILY WEALTH",
    items: familyWealthNavItems,
    defaultExpanded: true
  },
  {
    id: "collaboration",
    label: "COLLABORATION & SHARING",
    items: collaborationNavItems,
    defaultExpanded: true
  }
];

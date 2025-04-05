
import { 
  homeNavItems, 
  educationSolutionsNavItems, 
  familyWealthNavItems, 
  collaborationNavItems 
} from '@/navigation';

// You can define investmentCategories here instead of importing
export const investmentCategories = [
  {
    id: "stocks",
    name: "Stocks"
  },
  {
    id: "bonds",
    name: "Bonds"
  },
  {
    id: "alternatives",
    name: "Alternative Investments"
  }
];

export const navigationConfig = {
  mainNav: [
    ...homeNavItems,
    ...educationSolutionsNavItems,
    ...familyWealthNavItems,
    ...collaborationNavItems
  ],
  investmentCategories
};

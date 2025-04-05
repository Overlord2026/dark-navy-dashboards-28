
import { homeNavItems } from './homeNavigation';
import { bottomNavItems } from './bottomNavigation';
import { investmentCategories } from './investmentNavigation';

// Export all navigation items for easy access
export {
  homeNavItems,
  bottomNavItems,
  investmentCategories
};

// Export education and family wealth navigation items
export const educationSolutionsNavItems = [
  { 
    title: "Education Center", 
    href: "/education",
    icon: () => <img src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" alt="Education" className="h-5 w-5" />
  },
  { 
    title: "Investments", 
    href: "/investments",
    icon: () => <img src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" alt="Investments" className="h-5 w-5" />
  },
  { 
    title: "Tax Planning", 
    href: "/education/tax-planning",
    icon: () => <img src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" alt="Tax Planning" className="h-5 w-5" />
  },
  { 
    title: "Insurance", 
    href: "/insurance",
    icon: () => <img src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" alt="Insurance" className="h-5 w-5" />
  },
  { 
    title: "Lending", 
    href: "/lending",
    icon: () => <img src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" alt="Lending" className="h-5 w-5" />
  },
  { 
    title: "Estate Planning", 
    href: "/estate-planning",
    icon: () => <img src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" alt="Estate Planning" className="h-5 w-5" />
  }
];

export const familyWealthNavItems = [
  { 
    title: "Financial Plans", 
    href: "/financial-plans",
    icon: () => <img src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" alt="Financial Plans" className="h-5 w-5" />
  },
  { 
    title: "Accounts Overview", 
    href: "/accounts",
    icon: () => <img src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" alt="Accounts" className="h-5 w-5" />
  },
  { 
    title: "Cash Management", 
    href: "/cash-management",
    icon: () => <img src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" alt="Cash Management" className="h-5 w-5" />
  },
  { 
    title: "Tax & Budgets", 
    href: "/tax-budgets",
    icon: () => <img src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" alt="Tax & Budgets" className="h-5 w-5" />
  },
  { 
    title: "Transfers", 
    href: "/transfers",
    icon: () => <img src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" alt="Transfers" className="h-5 w-5" />
  },
  { 
    title: "Secure Family Vault", 
    href: "/legacy-vault",
    icon: () => <img src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" alt="Legacy Vault" className="h-5 w-5" />
  },
  { 
    title: "Social Security", 
    href: "/social-security",
    icon: () => <img src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" alt="Social Security" className="h-5 w-5" />
  },
  { 
    title: "Real Estate & Properties", 
    href: "/properties",
    icon: () => <img src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" alt="Properties" className="h-5 w-5" />
  },
  { 
    title: "Bill Pay", 
    href: "/billpay",
    icon: () => <img src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" alt="Bill Pay" className="h-5 w-5" />
  }
];

export const collaborationNavItems = [
  { 
    title: "Document Sharing", 
    href: "/documents",
    icon: () => <img src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" alt="Documents" className="h-5 w-5" />
  },
  { 
    title: "Professional Access", 
    href: "/professionals",
    icon: () => <img src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" alt="Professionals" className="h-5 w-5" />
  },
  { 
    title: "Family Member Access", 
    href: "/sharing",
    icon: () => <img src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" alt="Sharing" className="h-5 w-5" />
  }
];

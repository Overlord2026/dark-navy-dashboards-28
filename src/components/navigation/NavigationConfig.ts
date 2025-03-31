
import { Icon } from "lucide-react";
import { 
  HomeIcon, 
  GraduationCapIcon, 
  BookOpenIcon, 
  ReceiptIcon,
  BarChart3Icon, 
  PiggyBankIcon,
  WalletIcon,
  HomeIcon as PropertyIcon,
  CoinsIcon,
  ShieldIcon,
  ArrowRightLeftIcon,
  ShareIcon,
  CreditCardIcon,
  ShoppingBag
} from "lucide-react";

export interface NavCategory {
  id: string;
  label: string;
  items: NavItem[];
  defaultExpanded?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  icon: typeof Icon;
  href: string;
  disabled?: boolean;
  subItems?: NavSubItem[];
}

export interface NavSubItem {
  id: string;
  name: string;
  href: string;
}

// Core navigation categories - this can be extended by other modules
export const navigationCategories: NavCategory[] = [
  {
    id: "main",
    label: "Main",
    defaultExpanded: true,
    items: [
      { id: "home", label: "Home", icon: HomeIcon, href: "/" },
      { id: "education", label: "Education Center", icon: GraduationCapIcon, href: "/education" },
      { id: "legacy-vault", label: "Legacy Vault", icon: BookOpenIcon, href: "/legacy-vault" },
      { id: "tax-budgets", label: "Tax Planning", icon: ReceiptIcon, href: "/tax-budgets" },
    ]
  },
  {
    id: "wealth-management",
    label: "Wealth Management",
    defaultExpanded: true,
    items: [
      { id: "financial-plans", label: "Financial Plans", icon: BarChart3Icon, href: "/financial-plans" },
      { id: "investments", label: "Investments", icon: PiggyBankIcon, href: "/investments" },
      { id: "accounts", label: "Accounts", icon: WalletIcon, href: "/accounts" },
      { id: "properties", label: "Properties", icon: PropertyIcon, href: "/properties" },
      { id: "social-security", label: "Social Security", icon: CoinsIcon, href: "/social-security" },
      { id: "insurance", label: "Insurance", icon: ShieldIcon, href: "/insurance" },
    ]
  },
  {
    id: "banking",
    label: "Banking",
    items: [
      { id: "cash-management", label: "Cash Management", icon: WalletIcon, href: "/cash-management" },
      { id: "lending", label: "Lending", icon: CreditCardIcon, href: "/lending" },
      { id: "transfers", label: "Transfers", icon: ArrowRightLeftIcon, href: "/transfers" },
    ]
  },
  {
    id: "collaboration",
    label: "Collaboration",
    items: [
      { id: "sharing", label: "Sharing", icon: ShareIcon, href: "/sharing" },
      { id: "marketplace", label: "Marketplace", icon: ShoppingBag, href: "/marketplace" },
    ]
  },
];

// Sub-menu configuration - can be extended by modules
export const moduleSubMenus: Record<string, NavSubItem[]> = {
  "accounts": [
    { id: "all-accounts", name: "All Accounts", href: "/accounts" },
    { id: "checking", name: "Checking", href: "/accounts/checking" },
    { id: "savings", name: "Savings", href: "/accounts/savings" },
    { id: "investment", name: "Investment", href: "/accounts/investment" },
    { id: "retirement", name: "Retirement", href: "/accounts/retirement" },
  ],
  "education": [
    { id: "all-courses", name: "All Courses", href: "/education" },
    { id: "financial-basics", name: "Financial Basics", href: "/education/financial-basics" },
    { id: "investing", name: "Investing", href: "/education/investing" },
    { id: "retirement", name: "Retirement", href: "/education/retirement" },
    { id: "premium", name: "Premium Courses", href: "/education/premium" },
  ],
  "sharing": [
    { id: "shared-with-me", name: "Shared With Me", href: "/sharing" },
    { id: "shared-by-me", name: "Shared By Me", href: "/sharing/shared-by-me" },
    { id: "collaborators", name: "Collaborators", href: "/sharing/collaborators" },
  ],
};

// Helper function to get sub-menu items for a specific module
export const getSubMenuItems = (moduleId: string): NavSubItem[] => {
  return moduleSubMenus[moduleId] || [];
};

// Function to register additional navigation items
export const registerNavItem = (
  categoryId: string, 
  newItem: NavItem
): void => {
  const category = navigationCategories.find(cat => cat.id === categoryId);
  if (category) {
    // Check if item with this ID already exists
    const existingItemIndex = category.items.findIndex(item => item.id === newItem.id);
    if (existingItemIndex >= 0) {
      // Replace existing item
      category.items[existingItemIndex] = newItem;
    } else {
      // Add new item
      category.items.push(newItem);
    }
  }
};

// Function to register a new category
export const registerNavCategory = (
  newCategory: NavCategory,
  position?: number
): void => {
  // Check if category with this ID already exists
  const existingCategoryIndex = navigationCategories.findIndex(cat => cat.id === newCategory.id);
  
  if (existingCategoryIndex >= 0) {
    // Replace existing category
    navigationCategories[existingCategoryIndex] = newCategory;
  } else if (position !== undefined && position >= 0 && position <= navigationCategories.length) {
    // Insert at specific position
    navigationCategories.splice(position, 0, newCategory);
  } else {
    // Add to the end
    navigationCategories.push(newCategory);
  }
};

// Function to register additional sub-menu items
export const registerSubMenu = (
  moduleId: string, 
  subMenuItems: NavSubItem[]
): void => {
  if (!moduleSubMenus[moduleId]) {
    moduleSubMenus[moduleId] = [];
  }
  
  // Merge new items with existing ones
  moduleSubMenus[moduleId] = [
    ...moduleSubMenus[moduleId],
    ...subMenuItems.filter(newItem => 
      !moduleSubMenus[moduleId].some(existingItem => existingItem.id === newItem.id)
    )
  ];
};

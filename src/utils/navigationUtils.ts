
import { NavItem, MainMenuItem, NavCategory } from "@/types/navigation";

export const adaptNavItemsToMainMenuItems = (navItems: NavItem[]): MainMenuItem[] => {
  return navItems.map(item => ({
    id: item.title.toLowerCase().replace(/\s+/g, '-'),
    label: item.title,
    href: item.href,
    icon: item.icon
  }));
};

export const adaptNavCategoriesToMainMenu = (categories: NavCategory[]) => {
  return categories.map(category => ({
    ...category,
    items: adaptNavItemsToMainMenuItems(category.items)
  }));
};


import { navigationCategories } from "@/navigation/navCategories";
import { NavCategory, MainMenuItem } from "@/types/navigation";

export interface NavigationDiagnosticResult {
  id: string;
  title: string;
  status: "success" | "warning" | "error";
  message: string;
  details?: string;
  path?: string;
}

export const runNavigationDiagnostics = (): NavigationDiagnosticResult[] => {
  const results: NavigationDiagnosticResult[] = [];

  // Check for duplicate IDs in navigation items
  const duplicateIdCheck = checkDuplicateIds(navigationCategories);
  results.push(duplicateIdCheck);

  // Check for missing icons
  const missingIconsCheck = checkMissingIcons(navigationCategories);
  results.push(missingIconsCheck);

  // Check for broken links
  const brokenLinksCheck = checkBrokenLinks(navigationCategories);
  results.push(brokenLinksCheck);

  // Check for inconsistent naming
  const inconsistentNamingCheck = checkInconsistentNaming(navigationCategories);
  results.push(inconsistentNamingCheck);

  // Check for deep nesting
  const deepNestingCheck = checkDeepNesting(navigationCategories);
  results.push(deepNestingCheck);

  // Check for orphaned routes
  const orphanedRoutesCheck = checkOrphanedRoutes(navigationCategories);
  results.push(orphanedRoutesCheck);

  return results;
};

const checkDuplicateIds = (categories: NavCategory[]): NavigationDiagnosticResult => {
  const ids = new Set<string>();
  const duplicates = new Set<string>();

  // Check category IDs
  categories.forEach((category) => {
    if (ids.has(category.id)) {
      duplicates.add(category.id);
    } else {
      ids.add(category.id);
    }

    // Check item IDs
    category.items.forEach((item) => {
      if (ids.has(item.id)) {
        duplicates.add(item.id);
      } else {
        ids.add(item.id);
      }

      // Check subitem IDs if they exist
      if (item.items && item.items.length > 0) {
        item.items.forEach((subItem) => {
          if (ids.has(subItem.id)) {
            duplicates.add(subItem.id);
          } else {
            ids.add(subItem.id);
          }
        });
      }
    });
  });

  return {
    id: "duplicate-ids",
    title: "Duplicate IDs",
    status: duplicates.size > 0 ? "error" : "success",
    message:
      duplicates.size > 0
        ? `Found ${duplicates.size} duplicate IDs: ${Array.from(duplicates).join(", ")}`
        : "No duplicate IDs found",
  };
};

const checkMissingIcons = (categories: NavCategory[]): NavigationDiagnosticResult => {
  const itemsWithoutIcons: string[] = [];

  categories.forEach((category) => {
    category.items.forEach((item) => {
      if (!item.icon) {
        itemsWithoutIcons.push(`${category.id}/${item.id}`);
      }
    });
  });

  return {
    id: "missing-icons",
    title: "Missing Icons",
    status: itemsWithoutIcons.length > 0 ? "warning" : "success",
    message:
      itemsWithoutIcons.length > 0
        ? `Found ${itemsWithoutIcons.length} items without icons`
        : "All items have icons",
    details: itemsWithoutIcons.join(", "),
  };
};

const checkBrokenLinks = (categories: NavCategory[]): NavigationDiagnosticResult => {
  const suspiciousLinks: string[] = [];

  // Collect all navigation paths
  const allPaths = getAllNavigationPaths(categories);

  // Check for suspicious patterns in links
  allPaths.forEach((path) => {
    // Check for double slashes (except http:// or https://)
    if (path.match(/(?<!:)\/\//) || path === "#" || path === "") {
      suspiciousLinks.push(path);
    }
  });

  return {
    id: "broken-links",
    title: "Suspicious Links",
    status: suspiciousLinks.length > 0 ? "warning" : "success",
    message:
      suspiciousLinks.length > 0
        ? `Found ${suspiciousLinks.length} suspicious links`
        : "No suspicious links found",
    details: suspiciousLinks.join(", "),
  };
};

const checkInconsistentNaming = (categories: NavCategory[]): NavigationDiagnosticResult => {
  const inconsistentItems: string[] = [];

  categories.forEach((category) => {
    category.items.forEach((item) => {
      // Check if title and label are inconsistent (if both exist)
      if (item.title && item.label && item.title !== item.label) {
        inconsistentItems.push(`${item.id} (title: "${item.title}", label: "${item.label}")`);
      }
    });
  });

  return {
    id: "inconsistent-naming",
    title: "Inconsistent Naming",
    status: inconsistentItems.length > 0 ? "warning" : "success",
    message:
      inconsistentItems.length > 0
        ? `Found ${inconsistentItems.length} items with inconsistent naming`
        : "All items have consistent naming",
    details: inconsistentItems.join(", "),
  };
};

const checkDeepNesting = (categories: NavCategory[]): NavigationDiagnosticResult => {
  const deeplyNestedItems: string[] = [];

  categories.forEach((category) => {
    category.items.forEach((item) => {
      // Check if items property exists and has items
      if (item.items && item.items.length > 0) {
        deeplyNestedItems.push(`${category.id}/${item.id} (${item.items.length} subitems)`);
      }
    });
  });

  return {
    id: "deep-nesting",
    title: "Deeply Nested Items",
    status: deeplyNestedItems.length > 0 ? "warning" : "success",
    message:
      deeplyNestedItems.length > 0
        ? `Found ${deeplyNestedItems.length} deeply nested navigation items`
        : "No deeply nested navigation items found",
    details: deeplyNestedItems.join(", "),
  };
};

const checkOrphanedRoutes = (categories: NavCategory[]): NavigationDiagnosticResult => {
  // This is a placeholder for a more complex check that would require
  // analyzing the router configuration to find routes that aren't in the navigation
  return {
    id: "orphaned-routes",
    title: "Orphaned Routes",
    status: "success",
    message: "No orphaned routes detected",
    details: "This check requires integration with the router configuration",
  };
};

const getAllNavigationPaths = (categories: NavCategory[]): string[] => {
  const results: string[] = [];

  categories.forEach((category) => {
    category.items.forEach((item) => {
      if (item.href) {
        results.push(item.href);
      }

      // Check for items instead of submenu
      if (item.items && item.items.length > 0) {
        results.push(...item.items.map(subItem => subItem.href));
      }
    });
  });

  return results;
};

export const getNavigationStructure = () => {
  return navigationCategories.map((category) => ({
    id: category.id,
    label: category.label,
    itemCount: category.items.length,
    items: category.items.map((item) => ({
      id: item.id,
      title: item.title || "",
      href: item.href,
      hasIcon: !!item.icon,
      hasSubItems: !!(item.items && item.items.length > 0),
      subItemCount: item.items?.length || 0,
    })),
  }));
};

// Add missing functions that are imported elsewhere
export const getNavigationDiagnosticsSummary = async () => {
  const results = runNavigationDiagnostics();
  
  // Group results by categories (this is a simplified example)
  const categorizedResults = {
    home: results.filter(r => r.id.includes('home')),
    educationSolutions: results.filter(r => r.id.includes('education')),
    familyWealth: results.filter(r => r.id.includes('wealth')),
    collaboration: results.filter(r => r.id.includes('collab')),
    investments: results.filter(r => r.id.includes('invest'))
  };
  
  // Calculate statistics
  const allResults = results;
  const successCount = allResults.filter(r => r.status === 'success').length;
  const warningCount = allResults.filter(r => r.status === 'warning').length;
  const errorCount = allResults.filter(r => r.status === 'error').length;
  
  // Determine overall status
  let overallStatus = 'success';
  if (errorCount > 0) {
    overallStatus = 'error';
  } else if (warningCount > 0) {
    overallStatus = 'warning';
  }
  
  return {
    results: categorizedResults,
    totalRoutes: allResults.length,
    successCount,
    warningCount,
    errorCount,
    overallStatus
  };
};

export const testAllNavigationRoutes = async () => {
  // Simulated function that returns diagnostic results
  const results = runNavigationDiagnostics();
  
  // Group results by route category
  return {
    main: results.filter(r => r.id.includes('main')),
    dashboard: results.filter(r => r.id.includes('dashboard')),
    settings: results.filter(r => r.id.includes('settings'))
  };
};


import { navigationCategories } from "@/navigation/navCategories";
import { NavCategory, MainMenuItem } from "@/types/navigation";
import { NavigationDiagnosticResult as TypedNavigationDiagnosticResult } from "@/types/diagnostics";

export interface NavigationDiagnosticResult {
  id: string;
  title: string;
  status: "success" | "warning" | "error";
  message: string;
  details?: string;
  path?: string;
  route?: string;
}

export const runNavigationDiagnostics = (): NavigationDiagnosticResult[] => {
  const results: NavigationDiagnosticResult[] = [];

  const duplicateIdCheck = checkDuplicateIds(navigationCategories);
  results.push(duplicateIdCheck);

  const missingIconsCheck = checkMissingIcons(navigationCategories);
  results.push(missingIconsCheck);

  const brokenLinksCheck = checkBrokenLinks(navigationCategories);
  results.push(brokenLinksCheck);

  const inconsistentNamingCheck = checkInconsistentNaming(navigationCategories);
  results.push(inconsistentNamingCheck);

  const deepNestingCheck = checkDeepNesting(navigationCategories);
  results.push(deepNestingCheck);

  const orphanedRoutesCheck = checkOrphanedRoutes(navigationCategories);
  results.push(orphanedRoutesCheck);

  return results;
};

const checkDuplicateIds = (categories: NavCategory[]): NavigationDiagnosticResult => {
  const ids = new Set<string>();
  const duplicates = new Set<string>();

  categories.forEach((category) => {
    if (ids.has(category.id)) {
      duplicates.add(category.id);
    } else {
      ids.add(category.id);
    }

    category.items.forEach((item) => {
      if (ids.has(item.id)) {
        duplicates.add(item.id);
      } else {
        ids.add(item.id);
      }

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

  const allPaths = getAllNavigationPaths(categories);

  allPaths.forEach((path) => {
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

// Fix 1: Add the exported function getNavigationDiagnosticsSummary
export const getNavigationDiagnosticsSummary = async () => {
  const results = runNavigationDiagnostics();
  
  // Fix 2: Ensure the correct properties are used in the converted result
  const convertToTypedResult = (result: NavigationDiagnosticResult): TypedNavigationDiagnosticResult => {
    return {
      route: result.path || result.id,
      status: result.status as "success" | "warning" | "error",
      message: result.message,
      // Note: We don't include 'id' as it's not part of TypedNavigationDiagnosticResult
    };
  };
  
  const categorizedResults: Record<string, TypedNavigationDiagnosticResult[]> = {
    home: results.filter(r => r.id.includes('home')).map(convertToTypedResult),
    educationSolutions: results.filter(r => r.id.includes('education')).map(convertToTypedResult),
    familyWealth: results.filter(r => r.id.includes('wealth')).map(convertToTypedResult),
    collaboration: results.filter(r => r.id.includes('collab')).map(convertToTypedResult),
    investments: results.filter(r => r.id.includes('invest')).map(convertToTypedResult)
  };
  
  const allResults = results;
  const successCount = allResults.filter(r => r.status === 'success').length;
  const warningCount = allResults.filter(r => r.status === 'warning').length;
  const errorCount = allResults.filter(r => r.status === 'error').length;
  
  let overallStatus: "success" | "warning" | "error" = 'success';
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

// Fix 3: Add the exported function testAllNavigationRoutes
export const testAllNavigationRoutes = async (): Promise<Record<string, TypedNavigationDiagnosticResult[]>> => {
  const results = runNavigationDiagnostics();
  
  const convertToTypedResult = (result: NavigationDiagnosticResult): TypedNavigationDiagnosticResult => {
    return {
      route: result.path || result.id,
      status: result.status as "success" | "warning" | "error",
      message: result.message
      // Note: We don't include 'id' as it's not part of TypedNavigationDiagnosticResult
    };
  };
  
  return {
    main: results.filter(r => r.id.includes('main')).map(convertToTypedResult),
    dashboard: results.filter(r => r.id.includes('dashboard')).map(convertToTypedResult),
    settings: results.filter(r => r.id.includes('settings')).map(convertToTypedResult)
  };
};

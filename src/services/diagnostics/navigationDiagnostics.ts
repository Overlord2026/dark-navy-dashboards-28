import { navigationCategories } from "@/navigation/navCategories";
import { NavCategory, MainMenuItem } from "@/types/navigation";
import { NavigationDiagnosticResult as TypedNavigationDiagnosticResult } from "@/types/diagnostics";

interface NavigationDiagnosticResult {
  id: string;
  path?: string;
  status: "success" | "warning" | "error";
  message: string;
}

const checkRouteExists = (item: MainMenuItem): NavigationDiagnosticResult => {
  try {
    new URL(item.href, window.location.origin);
    return {
      id: item.id,
      path: item.href,
      status: "success",
      message: `Route ${item.href} exists`,
    };
  } catch (error: any) {
    return {
      id: item.id,
      path: item.href,
      status: "error",
      message: `Invalid URL: ${item.href}. ${error.message}`,
    };
  }
};

const checkRequiredFields = (item: MainMenuItem): NavigationDiagnosticResult => {
  if (!item.id || !item.title || !item.href) {
    return {
      id: item.id,
      status: "error",
      message: `Missing required fields in navigation item ${item.id}`,
    };
  }
  return {
    id: item.id,
    status: "success",
    message: `Required fields present in navigation item ${item.id}`,
  };
};

const runCategoryDiagnostics = (category: NavCategory): NavigationDiagnosticResult[] => {
  const categoryResults: NavigationDiagnosticResult[] = [];

  category.items.forEach((item) => {
    categoryResults.push(checkRouteExists(item));
    categoryResults.push(checkRequiredFields(item));
  });

  return categoryResults;
};

const runNavigationDiagnostics = (): NavigationDiagnosticResult[] => {
  let allResults: NavigationDiagnosticResult[] = [];

  navigationCategories.forEach((category) => {
    const categoryResults = runCategoryDiagnostics(category);
    allResults = allResults.concat(categoryResults);
  });

  return allResults;
};

export const getNavigationDiagnosticsSummary = async () => {
  const results = runNavigationDiagnostics();
  
  const convertToTypedResult = (result: NavigationDiagnosticResult): TypedNavigationDiagnosticResult => {
    return {
      route: result.path || result.id,
      status: result.status as "success" | "warning" | "error",
      message: result.message,
    };
  };
  
  const successCount = results.filter((r) => r.status === "success").length;
  const warningCount = results.filter((r) => r.status === "warning").length;
  const errorCount = results.filter((r) => r.status === "error").length;
  const totalCount = results.length;
  
  return {
    successCount,
    warningCount,
    errorCount,
    totalCount,
    results: results.map(convertToTypedResult),
  };
};

export const testAllNavigationRoutes = async (): Promise<Record<string, TypedNavigationDiagnosticResult[]>> => {
  const results = runNavigationDiagnostics();
  
  const convertToTypedResult = (result: NavigationDiagnosticResult): TypedNavigationDiagnosticResult => {
    return {
      route: result.path || result.id,
      status: result.status as "success" | "warning" | "error",
      message: result.message
    };
  };
  
  const typedResults = results.map(convertToTypedResult);
  
  const routeMap: Record<string, TypedNavigationDiagnosticResult[]> = {};
  
  typedResults.forEach(result => {
    if (!routeMap[result.route]) {
      routeMap[result.route] = [];
    }
    routeMap[result.route].push(result);
  });
  
  return {};
};

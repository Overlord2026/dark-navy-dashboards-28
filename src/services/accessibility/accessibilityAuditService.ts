
import { AccessibilityAuditResult, AccessibilityAuditSummary } from "@/types/accessibility";

// Mock accessibility audit data - in a real app, this would connect to axe-core or similar
const mockAuditResults: AccessibilityAuditResult[] = [
  {
    id: "aria-required-attr",
    url: "/client-dashboard",
    element: "button.dropdown-toggle",
    rule: "aria-required-attributes",
    message: "ARIA button missing required attribute aria-pressed",
    impact: "serious",
    status: "failed",
    category: "aria",
    wcagLevel: "A",
    wcagCriteria: "4.1.2",
    helpUrl: "https://dequeuniversity.com/rules/axe/4.4/aria-required-attr",
    timestamp: Date.now(),
    code: "<button class='dropdown-toggle' aria-haspopup='true'>Menu</button>",
    selector: "button.dropdown-toggle",
    recommendation: "Add aria-pressed attribute to the button"
  },
  {
    id: "color-contrast",
    url: "/accounts",
    element: "p.account-balance",
    rule: "color-contrast",
    message: "Element has insufficient color contrast (3:1)",
    impact: "serious", 
    status: "failed",
    category: "color",
    wcagLevel: "AA",
    wcagCriteria: "1.4.3",
    helpUrl: "https://dequeuniversity.com/rules/axe/4.4/color-contrast",
    timestamp: Date.now(),
    code: "<p class='account-balance text-gray-300'>$24,500.00</p>",
    selector: "p.account-balance",
    recommendation: "Increase the contrast ratio to at least 4.5:1 for normal text"
  },
  {
    id: "image-alt",
    url: "/profile",
    element: "img.profile-picture",
    rule: "image-alt",
    message: "Image does not have an alt attribute",
    impact: "critical",
    status: "failed",
    category: "images",
    wcagLevel: "A",
    wcagCriteria: "1.1.1",
    helpUrl: "https://dequeuniversity.com/rules/axe/4.4/image-alt",
    timestamp: Date.now(),
    code: "<img src='/profile.jpg' class='profile-picture'>",
    selector: "img.profile-picture",
    recommendation: "Add an alt attribute that describes the image"
  }
];

export const runAccessibilityAudit = async (url: string): Promise<AccessibilityAuditResult[]> => {
  // In a real implementation, this would use axe-core to run real tests
  // For now, we're just filtering the mock data based on the URL
  return mockAuditResults.filter(result => result.url === url || url === 'all');
};

export const getAuditSummary = (auditResults: AccessibilityAuditResult[]): AccessibilityAuditSummary => {
  return {
    critical: auditResults.filter(r => r.impact === "critical").length,
    serious: auditResults.filter(r => r.impact === "serious").length,
    moderate: auditResults.filter(r => r.impact === "moderate").length,
    minor: auditResults.filter(r => r.impact === "minor").length,
    total: auditResults.length,
    passedRules: auditResults.filter(r => r.status === "passed").length,
    failedRules: auditResults.filter(r => r.status === "failed").length,
    incompleteRules: auditResults.filter(r => r.status === "incomplete").length,
    timestamp: Date.now(),
    urlsTested: [...new Set(auditResults.map(r => r.url))].length
  };
};

export const getPageSummaries = (auditResults: AccessibilityAuditResult[]): any[] => {
  const pages = [...new Set(auditResults.map(r => r.url))];
  
  return pages.map(url => {
    const pageResults = auditResults.filter(r => r.url === url);
    return {
      url,
      timestamp: Date.now(),
      totalIssues: pageResults.length,
      criticalIssues: pageResults.filter(r => r.impact === "critical").length,
      seriousIssues: pageResults.filter(r => r.impact === "serious").length,
      moderateIssues: pageResults.filter(r => r.impact === "moderate").length,
      minorIssues: pageResults.filter(r => r.impact === "minor").length,
      passingRules: pageResults.filter(r => r.status === "passed").length,
      failingRules: pageResults.filter(r => r.status === "failed").length
    };
  });
};


import { v4 as uuidv4 } from 'uuid';
import { 
  AccessibilityAuditResult, 
  AccessibilityAuditSummary, 
  AccessibilityConfiguration,
  PageAccessibilitySummary
} from '@/types/accessibility';
import { logger } from '../logging/loggingService';
import { auditLog } from '../auditLog/auditLogService';

/**
 * This service provides accessibility audit functionality for the application.
 * It simulates running axe-core or similar accessibility testing tools.
 */

// Common site paths to test
const sitePaths = [
  '/',
  '/dashboard',
  '/investments',
  '/documents',
  '/tax-planning',
  '/estate-planning',
  '/accessibility',
  '/admin/system-diagnostics'
];

/**
 * Runs a comprehensive accessibility audit on the application
 * @param options - Configuration options for the accessibility audit
 * @returns Promise<AccessibilityAuditResult[]> - Array of accessibility issues found
 */
export const runAccessibilityAudit = async (
  options?: {
    paths?: string[];
    config?: AccessibilityConfiguration;
  }
): Promise<AccessibilityAuditResult[]> => {
  try {
    logger.info('Starting accessibility audit', options, 'AccessibilityAudit');
    
    // Simulate async audit process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Paths to test - use provided paths or defaults
    const pathsToTest = options?.paths || sitePaths;
    
    // Simulate gathering results from each page
    const allResults: AccessibilityAuditResult[] = [];
    
    for (const path of pathsToTest) {
      // Simulate URL for the current path
      const url = `https://app.example.com${path}`;
      
      // Get simulated issues for this page
      const pageIssues = generateSimulatedAuditResults(url);
      allResults.push(...pageIssues);
      
      // Simulate a delay between page scans
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Log the audit completion
    logger.info(
      'Accessibility audit completed', 
      { totalIssues: allResults.length, pagesScanned: pathsToTest.length },
      'AccessibilityAudit'
    );
    
    // Record the audit in the audit log
    auditLog.log(
      'system',
      'accessibility_audit',
      'success',
      {
        details: { 
          action: 'Run accessibility audit',
          pagesScanned: pathsToTest.length,
          issuesFound: allResults.length
        }
      }
    );
    
    return allResults;
  } catch (error) {
    logger.error('Error running accessibility audit', error, 'AccessibilityAudit');
    
    // Record the error in the audit log
    auditLog.log(
      'system',
      'accessibility_audit',
      'failure',
      {
        details: { action: 'Run accessibility audit' },
        reason: error instanceof Error ? error.message : 'Unknown error'
      }
    );
    
    throw error;
  }
};

/**
 * Calculates a summary of accessibility audit results
 * @param results - Array of accessibility audit results
 * @returns AccessibilityAuditSummary - Summary statistics
 */
export const getAuditSummary = (results: AccessibilityAuditResult[]): AccessibilityAuditSummary => {
  // Count issues by impact level
  const critical = results.filter(r => r.impact === 'critical').length;
  const serious = results.filter(r => r.impact === 'serious').length;
  const moderate = results.filter(r => r.impact === 'moderate').length;
  const minor = results.filter(r => r.impact === 'minor').length;
  
  // Count issues by status
  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const incomplete = results.filter(r => r.status === 'incomplete').length;
  
  // Get unique URLs tested
  const uniqueUrls = new Set(results.map(r => r.url)).size;
  
  return {
    critical,
    serious,
    moderate,
    minor,
    total: results.length,
    passedRules: passed,
    failedRules: failed,
    incompleteRules: incomplete,
    timestamp: Date.now(),
    urlsTested: uniqueUrls
  };
};

/**
 * Gets a summary of accessibility issues grouped by page
 * @param results - Array of accessibility audit results
 * @returns PageAccessibilitySummary[] - Page-level summaries
 */
export const getPageSummaries = (results: AccessibilityAuditResult[]): PageAccessibilitySummary[] => {
  // Group results by URL
  const groupedByUrl = results.reduce<Record<string, AccessibilityAuditResult[]>>((acc, result) => {
    if (!acc[result.url]) {
      acc[result.url] = [];
    }
    acc[result.url].push(result);
    return acc;
  }, {});
  
  // Create summaries for each page
  return Object.entries(groupedByUrl).map(([url, pageResults]) => {
    const timestamp = Math.max(...pageResults.map(r => r.timestamp));
    const totalIssues = pageResults.length;
    const criticalIssues = pageResults.filter(r => r.impact === 'critical').length;
    const seriousIssues = pageResults.filter(r => r.impact === 'serious').length;
    const moderateIssues = pageResults.filter(r => r.impact === 'moderate').length;
    const minorIssues = pageResults.filter(r => r.impact === 'minor').length;
    const passingRules = pageResults.filter(r => r.status === 'passed').length;
    const failingRules = pageResults.filter(r => r.status === 'failed').length;
    
    return {
      url,
      timestamp,
      totalIssues,
      criticalIssues,
      seriousIssues,
      moderateIssues,
      minorIssues,
      passingRules,
      failingRules
    };
  });
};

// Function to simulate accessibility issues for demo purposes
function generateSimulatedAuditResults(url: string): AccessibilityAuditResult[] {
  const timestamp = Date.now();
  const results: AccessibilityAuditResult[] = [];
  const pathname = new URL(url).pathname;
  
  // Some common accessibility issues to simulate
  const simulatedIssues = [
    {
      rule: 'aria-required-attr',
      message: 'Required ARIA attributes must be provided',
      impact: 'critical',
      element: '<button role="checkbox">',
      category: 'ARIA',
      wcagLevel: 'A',
      wcagCriteria: '4.1.2',
      recommendation: 'Add aria-checked attribute to the button with role="checkbox"'
    },
    {
      rule: 'color-contrast',
      message: 'Elements must have sufficient color contrast',
      impact: 'serious',
      element: '<p class="text-gray-400 bg-white">',
      category: 'Contrast',
      wcagLevel: 'AA',
      wcagCriteria: '1.4.3',
      recommendation: 'Increase the contrast ratio to at least 4.5:1 for normal text'
    },
    {
      rule: 'image-alt',
      message: 'Images must have alternate text',
      impact: 'critical',
      element: '<img src="chart.png">',
      category: 'Images',
      wcagLevel: 'A',
      wcagCriteria: '1.1.1',
      recommendation: 'Add alt attribute with descriptive text to the image'
    },
    {
      rule: 'label',
      message: 'Form elements must have labels',
      impact: 'critical',
      element: '<input type="text">',
      category: 'Forms',
      wcagLevel: 'A',
      wcagCriteria: '3.3.2',
      recommendation: 'Associate a label with the input using the for/id attributes or aria-labelledby'
    },
    {
      rule: 'link-name',
      message: 'Links must have discernible text',
      impact: 'serious',
      element: '<a href="/details"></a>',
      category: 'Structure',
      wcagLevel: 'A',
      wcagCriteria: '2.4.4',
      recommendation: 'Add text content to the link or use aria-label/aria-labelledby'
    }
  ];
  
  // Generate a variable number of issues based on the page
  const numberOfIssues = Math.floor(Math.random() * 4) + (pathname === '/' ? 0 : 1);
  const pathSpecificIssues = getPathSpecificIssues(pathname);
  
  // Add some standard issues
  for (let i = 0; i < numberOfIssues; i++) {
    const baseIssue = simulatedIssues[i % simulatedIssues.length];
    const impact = i === 0 ? baseIssue.impact : ['critical', 'serious', 'moderate', 'minor'][Math.floor(Math.random() * 4)] as 'critical' | 'serious' | 'moderate' | 'minor';
    
    results.push({
      id: uuidv4(),
      url,
      element: baseIssue.element,
      rule: baseIssue.rule,
      message: baseIssue.message,
      impact: impact,
      status: 'failed',
      category: baseIssue.category,
      wcagLevel: baseIssue.wcagLevel as 'A' | 'AA' | 'AAA',
      wcagCriteria: baseIssue.wcagCriteria,
      helpUrl: `https://dequeuniversity.com/rules/axe/4.4/${baseIssue.rule}`,
      timestamp,
      recommendation: baseIssue.recommendation
    });
  }
  
  // Add path-specific issues
  pathSpecificIssues.forEach(issue => {
    results.push({
      ...issue,
      id: uuidv4(),
      url,
      timestamp
    });
  });
  
  return results;
}

// Generate specific issues based on the path
function getPathSpecificIssues(pathname: string): Partial<AccessibilityAuditResult>[] {
  switch (pathname) {
    case '/dashboard':
      return [
        {
          element: '<div role="table">',
          rule: 'table-fake-caption',
          message: 'Tables with a role of "table" should have a caption',
          impact: 'moderate',
          status: 'failed',
          category: 'Structure',
          wcagLevel: 'A',
          wcagCriteria: '1.3.1',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/table-fake-caption',
          recommendation: 'Add aria-describedby pointing to a caption element'
        }
      ];
      
    case '/investments':
      return [
        {
          element: '<div class="chart-container">',
          rule: 'area-alt',
          message: 'Active image maps must have alternate text',
          impact: 'critical',
          status: 'failed',
          category: 'Images',
          wcagLevel: 'A',
          wcagCriteria: '1.1.1',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/area-alt',
          recommendation: 'Ensure all area elements have alt attributes'
        },
        {
          element: '<div class="investment-card">',
          rule: 'color-contrast',
          message: 'Elements must have sufficient color contrast',
          impact: 'serious',
          status: 'failed',
          category: 'Contrast',
          wcagLevel: 'AA',
          wcagCriteria: '1.4.3',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/color-contrast',
          recommendation: 'Increase contrast of text within investment cards'
        }
      ];
      
    case '/documents':
      return [
        {
          element: '<button onclick="downloadDoc()">',
          rule: 'button-name',
          message: 'Buttons must have discernible text',
          impact: 'critical',
          status: 'failed',
          category: 'Forms',
          wcagLevel: 'A',
          wcagCriteria: '4.1.2',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/button-name',
          recommendation: 'Add text content or aria-label to buttons'
        }
      ];
      
    case '/accessibility':
      // Fewer issues on the accessibility page - good example
      return [];
      
    default:
      return [
        {
          element: '<div class="modal">',
          rule: 'aria-dialog-name',
          message: 'ARIA dialog and alertdialog nodes should have an accessible name',
          impact: 'serious',
          status: 'failed',
          category: 'ARIA',
          wcagLevel: 'A',
          wcagCriteria: '4.1.2',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/aria-dialog-name',
          recommendation: 'Add aria-label or aria-labelledby to dialog elements'
        }
      ];
  }
}

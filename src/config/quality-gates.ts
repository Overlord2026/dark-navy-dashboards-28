// Performance budgets configuration
export const performanceBudgets = {
  // Core Web Vitals thresholds
  lcp: 2500, // Largest Contentful Paint ≤ 2.5s
  cls: 0.1,  // Cumulative Layout Shift ≤ 0.1
  inp: 200,  // Interaction to Next Paint ≤ 200ms
  tbt: 200,  // Total Blocking Time ≤ 200ms
  
  // Additional metrics
  fcp: 1500, // First Contentful Paint ≤ 1.5s
  si: 3000,  // Speed Index ≤ 3s
  
  // Resource budgets (KB)
  resources: {
    script: 300,
    image: 200,
    stylesheet: 100,
    document: 50,
    font: 100,
    total: 1000
  }
};

// Accessibility audit configuration
export const accessibilityConfig = {
  // WCAG 2.1 AA compliance level
  standard: 'WCAG21AA',
  
  // Critical accessibility rules
  rules: {
    'color-contrast': { enabled: true, level: 'error' },
    'keyboard-navigation': { enabled: true, level: 'error' },
    'focus-management': { enabled: true, level: 'error' },
    'alt-text': { enabled: true, level: 'error' },
    'form-labels': { enabled: true, level: 'error' },
    'heading-structure': { enabled: true, level: 'warning' },
    'landmark-navigation': { enabled: true, level: 'warning' }
  },
  
  // Test coverage targets
  coverage: {
    interactive: 100, // All interactive elements must be tested
    forms: 100,       // All form elements must be tested
    navigation: 100   // All navigation elements must be tested
  }
};

// CI/CD integration settings
export const ciConfig = {
  // Fail build thresholds
  performance: {
    lighthouse: 90,      // Lighthouse score ≥ 90
    accessibility: 90,   // Accessibility score ≥ 90
    bestPractices: 90,   // Best practices score ≥ 90
    seo: 90             // SEO score ≥ 90
  },
  
  // Test execution settings
  retries: 3,           // Number of retries for flaky tests
  timeout: 30000,       // Test timeout (30s)
  parallel: true,       // Run tests in parallel
  
  // Reporting
  reports: {
    html: true,         // Generate HTML reports
    json: true,         // Generate JSON reports
    artifacts: true     // Save test artifacts
  }
};
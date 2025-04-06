
export interface AccessibilityAuditResult {
  id: string;
  url: string;
  element: string;
  rule: string;
  message: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  status: 'failed' | 'passed' | 'incomplete';
  category: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
  wcagCriteria: string;
  helpUrl: string;
  timestamp: number;
  code?: string;
  selector?: string;
  recommendation?: string;
}

export interface AccessibilityAuditSummary {
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
  total: number;
  passedRules: number;
  failedRules: number;
  incompleteRules: number;
  timestamp: number;
  urlsTested: number;
}

export interface AccessibilityConfiguration {
  rules: {
    runOnly?: {
      type: 'tag' | 'rule';
      values: string[];
    };
    rules?: Record<string, { enabled: boolean }>;
  };
  reporter?: string;
  resultTypes?: Array<'violations' | 'incomplete' | 'passes' | 'inapplicable'>;
  runOnly?: Array<'wcag2a' | 'wcag2aa' | 'wcag2aaa' | 'best-practice' | 'wcag21a' | 'wcag21aa'>; 
}

export interface AccessibilityFixRecommendation {
  id: string;
  ruleId: string;
  issueId: string;
  code: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  fixType: 'markup' | 'style' | 'script' | 'content';
}

export interface PageAccessibilitySummary {
  url: string;
  timestamp: number;
  totalIssues: number;
  criticalIssues: number;
  seriousIssues: number;
  moderateIssues: number;
  minorIssues: number;
  passingRules: number;
  failingRules: number;
}

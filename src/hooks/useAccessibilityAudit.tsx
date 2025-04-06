
import { useState, useCallback } from 'react';
import { 
  runAccessibilityAudit, 
  getAuditSummary 
} from '@/services/accessibility/accessibilityAuditService';
import { 
  AccessibilityAuditResult, 
  AccessibilityAuditSummary 
} from '@/types/accessibility';
import { logger } from '@/services/logging/loggingService';

export function useAccessibilityAudit() {
  const [auditResults, setAuditResults] = useState<AccessibilityAuditResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [auditSummary, setAuditSummary] = useState<AccessibilityAuditSummary>({
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
    total: 0,
    passedRules: 0,
    failedRules: 0,
    incompleteRules: 0,
    timestamp: Date.now(),
    urlsTested: 0
  });
  
  const runAudit = useCallback(async () => {
    try {
      setIsRunning(true);
      logger.info('Starting accessibility audit', undefined, 'AccessibilityAudit');
      
      const results = await runAccessibilityAudit();
      setAuditResults(results);
      
      const summary = getAuditSummary(results);
      setAuditSummary(summary);
      
      logger.info('Accessibility audit completed', 
        { issuesFound: summary.total }, 
        'AccessibilityAudit'
      );
      
      return results;
    } catch (error) {
      logger.error('Error running accessibility audit', error, 'AccessibilityAudit');
      throw error;
    } finally {
      setIsRunning(false);
    }
  }, []);
  
  const getIssuesByUrl = useCallback((url: string) => {
    return auditResults.filter(issue => issue.url === url);
  }, [auditResults]);
  
  const getIssuesByLevel = useCallback((level: 'critical' | 'serious' | 'moderate' | 'minor') => {
    return auditResults.filter(issue => issue.impact === level);
  }, [auditResults]);
  
  return {
    auditResults,
    isRunning,
    runAudit,
    auditSummary,
    getIssuesByUrl,
    getIssuesByLevel
  };
}

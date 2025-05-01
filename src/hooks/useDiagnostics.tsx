import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { DiagnosticResult, Recommendation } from '@/types/diagnostics/common';
import { QuickFix as DiagnosticQuickFix, FixHistoryEntry as DiagnosticFixHistoryEntry } from '@/types/diagnostics/recommendations';
import { DiagnosticResultSummary } from '@/types/diagnostics';

// Re-export these types to maintain compatibility with existing imports
export type QuickFix = DiagnosticQuickFix;
export type FixHistoryEntry = DiagnosticFixHistoryEntry;

export const useDiagnostics = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>({});
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [quickFixes, setQuickFixes] = useState<QuickFix[]>([]);
  const [fixHistory, setFixHistory] = useState<FixHistoryEntry[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [quickFixLoading, setQuickFixLoading] = useState<boolean>(false);
  
  // Function to run diagnostics
  const runDiagnostics = useCallback(async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock results - make these match the DiagnosticResultSummary interface
      const mockResults: DiagnosticResultSummary = {
        overall: 'warning',
        timestamp: new Date().toISOString(),
        apiTests: { passed: 8, failed: 2, total: 10 },
        navigationTests2: { passed: 12, failed: 1, total: 13 },
        formValidationTests2: { passed: 5, failed: 0, total: 5 },
        performanceTests2: { passed: 6, failed: 2, total: 8 },
        securityTests2: { passed: 7, failed: 0, total: 7 },
        securityTests: [
          {
            id: 'sec-1',
            status: 'success',
            message: 'Authentication service is working correctly',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'sec-2',
            status: 'warning',
            message: 'CSRF protection needs improvement',
            timestamp: new Date().toISOString(),
          }
        ],
        apiIntegrationTests: [
          {
            id: 'api-1',
            status: 'warning',
            message: 'API response time is slower than expected',
            timestamp: new Date().toISOString(),
            details: {
              responseTime: '1.2s',
              threshold: '0.8s'
            }
          }
        ],
        performanceTests: [
          {
            id: 'perf-1',
            status: 'success',
            message: 'Core components rendering within expected time',
            timestamp: new Date().toISOString(),
          }
        ],
        navigationTests: [
          {
            id: 'nav-1',
            status: 'success',
            message: 'All routes accessible',
            timestamp: new Date().toISOString(),
          }
        ],
        formValidationTests: [
          {
            id: 'form-1',
            status: 'success',
            message: 'All form validations working properly',
            timestamp: new Date().toISOString(),
          }
        ],
        iconTests: [
          {
            id: 'icon-1', 
            status: 'success',
            message: 'All icons loaded correctly',
            timestamp: new Date().toISOString(),
          }
        ],
        recommendations: [
          {
            id: 'rec-1',
            text: 'Optimize API calls to improve response time',
            priority: 'medium',
            actionable: true,
            action: 'View optimization guide',
          }
        ]
      };
      
      setResults(mockResults);
      setLastUpdated(new Date());
      
      // Mock recommendations based on results
      const mockRecommendations: Recommendation[] = [
        {
          id: 'rec-1',
          text: 'Optimize API calls to improve response time',
          priority: 'medium',
          actionable: true,
          action: 'View optimization guide',
        },
      ];
      
      setRecommendations(mockRecommendations);
      
      toast.success('Diagnostics completed successfully');
      return mockResults;
    } catch (error) {
      console.error('Error running diagnostics:', error);
      toast.error('Failed to run diagnostics');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Alias for runDiagnostics for backward compatibility
  const runSystemDiagnostics = runDiagnostics;

  // Function to apply a quick fix
  const applyQuickFix = useCallback(async (fixId: string) => {
    setQuickFixLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the fix that was applied
      const appliedFix = quickFixes.find(fix => fix.id === fixId);
      
      if (appliedFix) {
        // Add to fix history
        const historyEntry: FixHistoryEntry = {
          id: `hist-${Date.now()}`,
          title: appliedFix.title,
          timestamp: new Date().toISOString(),
          area: appliedFix.area,
          severity: appliedFix.severity,
          description: appliedFix.description,
          status: 'success'
        };
        
        setFixHistory(prev => [historyEntry, ...prev]);
        
        // Remove from quick fixes
        setQuickFixes(prev => prev.filter(fix => fix.id !== fixId));
        
        toast.success(`Applied fix: ${appliedFix.title}`);
      }
      return true;
    } catch (error) {
      console.error('Error applying quick fix:', error);
      toast.error('Failed to apply fix');
      return false;
    } finally {
      setQuickFixLoading(false);
    }
  }, [quickFixes]);

  // Alias for applyQuickFix for backward compatibility
  const applyDiagnosticFix = applyQuickFix;

  // Function to refresh diagnostics
  const refreshDiagnostics = useCallback(async () => {
    return runDiagnostics();
  }, [runDiagnostics]);

  // Initially load diagnostics
  useEffect(() => {
    // Set up mock quick fixes
    const initialQuickFixes: QuickFix[] = [
      {
        id: 'qf-1',
        title: 'Optimize API response time',
        description: 'Apply caching to improve response times',
        area: 'performance',
        severity: 'medium',
        category: 'performance',
        actionable: true
      },
      {
        id: 'qf-2',
        title: 'Fix security vulnerability in auth flow',
        description: 'Update authentication middleware',
        area: 'security',
        severity: 'high',
        category: 'security',
        actionable: true
      }
    ];
    
    setQuickFixes(initialQuickFixes);
    
    // Set up mock fix history
    const initialFixHistory: FixHistoryEntry[] = [
      {
        id: 'hist-1',
        title: 'Updated API timeout settings',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        area: 'config',
        severity: 'medium',
        description: 'Increased API timeout from 30s to 60s',
        status: 'success'
      }
    ];
    
    setFixHistory(initialFixHistory);
    
    // Initial diagnostic run
    runDiagnostics();
  }, [runDiagnostics]);

  return {
    loading,
    isLoading: loading, // Alias for consistency
    results,
    diagnosticResults: results, // Alias for consistency
    recommendations,
    quickFixes,
    fixHistory,
    lastUpdated,
    runDiagnostics,
    refreshDiagnostics,
    applyQuickFix,
    applyDiagnosticFix,
    quickFixLoading,
    fixInProgress: quickFixLoading, // Alias for backward compatibility
    runSystemDiagnostics // Additional function expected by some components
  };
};

export default useDiagnostics;

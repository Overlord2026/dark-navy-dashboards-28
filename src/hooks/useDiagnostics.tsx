
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { DiagnosticResult, Recommendation } from '@/types/diagnostics/common';
import { QuickFix as DiagnosticQuickFix, FixHistoryEntry as DiagnosticFixHistoryEntry } from '@/types/diagnostics/recommendations';

// Rename to avoid conflicts with local declarations
type QuickFixType = DiagnosticQuickFix;
type FixHistoryEntryType = DiagnosticFixHistoryEntry;

export const useDiagnostics = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [quickFixes, setQuickFixes] = useState<QuickFixType[]>([]);
  const [fixHistory, setFixHistory] = useState<FixHistoryEntryType[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Function to run diagnostics
  const runDiagnostics = useCallback(async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock results
      const mockResults: DiagnosticResult[] = [
        {
          id: 'diag-1',
          status: 'success',
          message: 'Authentication service is working correctly',
          timestamp: new Date().toISOString(),
        },
        {
          id: 'diag-2',
          status: 'warning',
          message: 'API response time is slower than expected',
          timestamp: new Date().toISOString(),
          details: {
            responseTime: '1.2s',
            threshold: '0.8s'
          }
        },
      ];
      
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
    } catch (error) {
      console.error('Error running diagnostics:', error);
      toast.error('Failed to run diagnostics');
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to apply a quick fix
  const applyQuickFix = useCallback(async (fixId: string) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the fix that was applied
      const appliedFix = quickFixes.find(fix => fix.id === fixId);
      
      if (appliedFix) {
        // Add to fix history
        const historyEntry: FixHistoryEntryType = {
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
    } catch (error) {
      console.error('Error applying quick fix:', error);
      toast.error('Failed to apply fix');
    } finally {
      setLoading(false);
    }
  }, [quickFixes]);

  // Initially load diagnostics
  useEffect(() => {
    // Set up mock quick fixes
    const initialQuickFixes: QuickFixType[] = [
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
    const initialFixHistory: FixHistoryEntryType[] = [
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
  }, []);

  return {
    loading,
    results,
    recommendations,
    quickFixes,
    fixHistory,
    lastUpdated,
    runDiagnostics,
    applyQuickFix
  };
};

export default useDiagnostics;

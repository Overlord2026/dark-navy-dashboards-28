
import React, { useEffect, useState } from 'react';
import { testNavigation } from '@/services/diagnostics/navigationTests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useDiagnosticsContext } from '@/context/DiagnosticsContext';
import { RecommendationsList } from './RecommendationsList';
import { Recommendation, NavigationTestResult } from '@/types/diagnostics';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DiagnosticResultItem } from './DiagnosticResultItem';
import { useUser } from "@/context/UserContext";
import { v4 as uuidv4 } from 'uuid';

// Separate component for stats display to reduce complexity
const DiagnosticStats = ({ stats }: { stats: { total: number; success: number; warning: number; error: number } }) => (
  <div className="flex gap-2 mt-2">
    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
      {stats.success} OK
    </Badge>
    {stats.warning > 0 && (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
        {stats.warning} Warnings
      </Badge>
    )}
    {stats.error > 0 && (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
        {stats.error} Errors
      </Badge>
    )}
  </div>
);

/**
 * SimpleDiagnosticsView - A developer-friendly component that shows basic diagnostics results
 * Only visible to admin users
 */
const SimpleDiagnosticsView: React.FC = () => {
  const [results, setResults] = useState<NavigationTestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('results');
  const { isDevelopmentMode, isDiagnosticsModeEnabled } = useDiagnosticsContext();
  const { userProfile } = useUser();
  
  // DISABLED: Never show this component on the main dashboard
  const isVisible = false; // Always hide this component

  useEffect(() => {
    if (!isVisible) return;

    const runDiagnostics = async () => {
      try {
        setLoading(true);
        const navResults = await testNavigation();
        
        // Add some sample recommendations if they don't exist
        const resultsWithRecommendations = navResults.map(result => {
          if (result.status !== 'success' && (!result.recommendations || result.recommendations.length === 0)) {
            return {
              ...result,
              recommendations: generateRecommendations(result)
            };
          }
          return result;
        });
        
        setResults(resultsWithRecommendations);
      } catch (error) {
        console.error('Error running diagnostics:', error);
      } finally {
        setLoading(false);
      }
    };

    runDiagnostics();
    
    // Refresh diagnostics every 2 minutes
    const intervalId = setInterval(runDiagnostics, 120000);
    return () => clearInterval(intervalId);
  }, [isVisible]);
  
  const generateRecommendations = (result: NavigationTestResult): Recommendation[] => {
    if (result.status === 'warning') {
      return [{
        id: uuidv4(),
        text: `Check response times for ${result.route}`,
        priority: 'medium',
        category: 'performance',
        actionable: true,
        action: {
          label: 'Optimize'
        },
        effort: 'medium',
        impact: 'Improves page load times by 15-20%'
      }];
    } else if (result.status === 'error') {
      return [{
        id: uuidv4(),
        text: `Fix routing error on ${result.route}`,
        priority: 'high',
        category: 'reliability',
        actionable: true,
        action: {
          label: 'Fix Now'
        },
        effort: 'medium',
        impact: 'Resolves critical navigation failure'
      }];
    }
    return [];
  };

  // Handle recommendation actions
  const handleRecommendationAction = (recommendation: Recommendation) => {
    toast.info(`Applying recommendation: ${recommendation.text}`);
    // In a real implementation, this would trigger the actual fix
    setTimeout(() => {
      toast.success("Recommendation applied successfully");
      // Update the results to reflect the fix
      setResults(prevResults => 
        prevResults.map(result => {
          if (result.recommendations && result.recommendations.some(r => 
            typeof r === 'object' && r.id === recommendation.id
          )) {
            const updatedRecommendations = result.recommendations.filter(
              r => typeof r === 'string' || r.id !== recommendation.id
            );
            return {
              ...result,
              status: updatedRecommendations.length === 0 ? 'success' : result.status,
              recommendations: updatedRecommendations
            };
          }
          return result;
        })
      );
    }, 1500);
  };

  if (!isVisible) return null;
  
  // Calculate summary counts
  const getStats = () => {
    const total = results.length;
    const success = results.filter(r => r.status === 'success').length;
    const warning = results.filter(r => r.status === 'warning').length;
    const error = results.filter(r => r.status === 'error').length;
    
    return { total, success, warning, error };
  };
  
  // Get all recommendations
  const allRecommendations = results
    .flatMap(result => result.recommendations || [])
    .filter(rec => typeof rec === 'object') // Filter out string recommendations
    .sort((a, b) => {
      if (typeof a === 'string' || typeof b === 'string') return 0;
      const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
      return (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) - 
             (priorityOrder[b.priority as keyof typeof priorityOrder] || 3);
    }) as Recommendation[];

  return null; // Always return null to never show this component
};

export default SimpleDiagnosticsView;


import React, { useEffect, useState } from 'react';
import { testNavigation } from '@/services/diagnostics/navigationTests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useDiagnosticsContext } from '@/context/DiagnosticsContext';
import { RecommendationsList } from './RecommendationsList';
import { Recommendation } from '@/types/diagnostics';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DiagnosticResult {
  route: string;
  status: 'success' | 'warning' | 'error';
  message?: string;
  recommendations?: Recommendation[];
}

/**
 * SimpleDiagnosticsView - A developer-friendly component that shows basic diagnostics results
 * 
 * This is a simplified version of the full diagnostics system, designed for quick checks
 * during development. It runs navigation diagnostics and displays the results in a
 * clean, easy-to-understand format.
 */
const SimpleDiagnosticsView: React.FC = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('results');
  const { isDevelopmentMode, isDiagnosticsModeEnabled } = useDiagnosticsContext();
  
  // Only show in development mode or when diagnostics are enabled
  const isVisible = isDevelopmentMode || isDiagnosticsModeEnabled;

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
  
  const generateRecommendations = (result: DiagnosticResult): Recommendation[] => {
    if (result.status === 'warning') {
      return [{
        id: `rec-${result.route}-1`,
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
        id: `rec-${result.route}-1`,
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
          if (result.recommendations?.some(r => r.id === recommendation.id)) {
            const updatedRecommendations = result.recommendations.filter(
              r => r.id !== recommendation.id
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
  
  const stats = getStats();
  
  // Get all recommendations
  const allRecommendations = results
    .flatMap(result => result.recommendations || [])
    .sort((a, b) => {
      const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
      return (priorityOrder[a.priority as keyof typeof priorityOrder] || 4) - 
             (priorityOrder[b.priority as keyof typeof priorityOrder] || 4);
    });

  return (
    <Card className="max-w-md mx-auto my-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <span>Navigation Diagnostics</span>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
            ) : null}
          </CardTitle>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setLoading(true);
              testNavigation().then(navResults => {
                setResults(navResults);
                setLoading(false);
              });
            }}
          >
            Refresh
          </Button>
        </div>
        
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
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="recommendations">
              Recommendations
              {allRecommendations.length > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                  {allRecommendations.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="results" className="mt-2">
            {loading && results.length === 0 ? (
              <div className="flex flex-col items-center py-4">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p className="text-sm text-muted-foreground">Running diagnostics...</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {results.map((result) => (
                  <li 
                    key={result.route} 
                    className={`p-3 rounded-md flex items-start justify-between
                      ${result.status === 'success' ? 'bg-green-50 dark:bg-green-900/20' : 
                       result.status === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20' : 
                       'bg-red-50 dark:bg-red-900/20'}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        {result.status === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : result.status === 'warning' ? (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="font-medium">{result.route}</span>
                      </div>
                      {result.message && (
                        <p className="text-sm mt-1 ml-6">{result.message}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
          
          <TabsContent value="recommendations" className="mt-2">
            <RecommendationsList 
              recommendations={allRecommendations}
              isLoading={loading}
              onActionClick={handleRecommendationAction}
            />
          </TabsContent>
        </Tabs>
        
        <div className="text-xs text-muted-foreground mt-4 text-right">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleDiagnosticsView;

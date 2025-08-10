import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { computeOverlap, persistOverlapResults, type OverlapResult } from '@/engines/private/overlap';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface OverlapMatrixProps {
  fundIds: string[];
}

export function OverlapMatrix({ fundIds }: OverlapMatrixProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<OverlapResult | null>(null);
  const { toast } = useToast();

  const handleComputeOverlap = async () => {
    if (fundIds.length < 2) {
      toast({
        title: "Insufficient Funds",
        description: "Please select at least 2 funds for overlap analysis",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const overlapResults = await computeOverlap({ fundIds });
      setResults(overlapResults);

      // Persist results
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await persistOverlapResults(
          user.id,
          null, // portfolioId
          { fundIds },
          overlapResults
        );
      }

      toast({
        title: "Overlap Analysis Complete",
        description: `Analyzed overlap across ${fundIds.length} funds`
      });
    } catch (error) {
      console.error('Overlap computation failed:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to compute fund overlap",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  const getOverlapColor = (overlap: number) => {
    if (overlap > 0.7) return 'bg-red-500';
    if (overlap > 0.4) return 'bg-yellow-500';
    if (overlap > 0.2) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fund Holdings Overlap Analysis</CardTitle>
          <CardDescription>
            Analyze portfolio overlap across selected private funds using weighted Jaccard similarity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex flex-wrap gap-2">
              {fundIds.map((fundId) => (
                <Badge key={fundId} variant="outline">
                  {fundId}
                </Badge>
              ))}
            </div>
            <Button 
              onClick={handleComputeOverlap}
              disabled={loading || fundIds.length < 2}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze Overlap
            </Button>
          </div>

          {results && (
            <div className="space-y-6">
              {/* Pairwise Overlap Matrix */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Pairwise Overlap Matrix</h3>
                <div className="grid gap-2">
                  {Object.entries(results.pairwise).map(([key, overlap]) => {
                    const [fund1, fund2] = key.split('_');
                    return (
                      <div 
                        key={key}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{fund1}</Badge>
                          <span>×</span>
                          <Badge variant="outline">{fund2}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div 
                            className={`w-3 h-3 rounded-full ${getOverlapColor(overlap)}`}
                          />
                          <span className="font-medium">{formatPercentage(overlap)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Contributors */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Top Overlap Contributors</h3>
                <div className="space-y-2">
                  {results.topContributors.slice(0, 10).map((contributor, index) => (
                    <div 
                      key={contributor.holding_id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <div className="font-medium">{contributor.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Appears in {contributor.fund_count} funds
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatPercentage(contributor.total_weight / 100)}</div>
                        <div className="text-sm text-muted-foreground">Combined Weight</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sector Heatmap */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Sector Concentration</h3>
                <div className="space-y-2">
                  {Object.entries(results.sectorHeatmap)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 8)
                    .map(([sector, weight]) => (
                      <div 
                        key={sector}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <span className="font-medium">{sector}</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-2 bg-primary rounded-full"
                            style={{ width: `${Math.min(100, (weight / 50) * 100)}px` }}
                          />
                          <span className="font-medium">{formatPercentage(weight / 100)}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
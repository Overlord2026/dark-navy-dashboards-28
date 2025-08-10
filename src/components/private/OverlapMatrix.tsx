import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { computeOverlap, persistOverlapResults, getSectorWeightConfigs, createSectorWeightConfig, type OverlapResult, type SectorWeightConfig } from '@/engines/private/overlap';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Settings, Info } from 'lucide-react';

interface OverlapMatrixProps {
  fundIds: string[];
}

export function OverlapMatrix({ fundIds }: OverlapMatrixProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<OverlapResult | null>(null);
  const [sectorConfigs, setSectorConfigs] = useState<SectorWeightConfig[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string>('');
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [newConfigName, setNewConfigName] = useState('');
  const [sectorWeights, setSectorWeights] = useState<Record<string, number>>({
    'Technology': 1.0,
    'Healthcare': 1.0,
    'Financial Services': 1.0,
    'Consumer': 1.0,
    'Industrial': 1.0,
    'Energy': 1.0,
    'Real Estate': 1.0,
    'Materials': 1.0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSectorConfigs();
  }, []);

  const loadSectorConfigs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const configs = await getSectorWeightConfigs(user.id);
        setSectorConfigs(configs);
      }
    } catch (error) {
      console.error('Failed to load sector configs:', error);
    }
  };

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const overlapResults = await computeOverlap({ 
        fundIds, 
        userId: user.id,
        sectorWeightConfigId: selectedConfigId || undefined
      });
      setResults(overlapResults);

      // Persist results with enhanced metadata
      await persistOverlapResults(
        user.id,
        null, // portfolioId
        { fundIds, userId: user.id, sectorWeightConfigId: selectedConfigId || undefined },
        overlapResults
      );

      toast({
        title: "Patent-Aligned Overlap Analysis Complete",
        description: `Analyzed overlap using Weighted Jaccard Similarity across ${fundIds.length} funds${selectedConfigId ? ' with sector weighting' : ''}`
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

  const handleCreateConfig = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const configId = await createSectorWeightConfig(
        user.id,
        newConfigName,
        sectorWeights
      );

      await loadSectorConfigs();
      setSelectedConfigId(configId);
      setShowConfigDialog(false);
      setNewConfigName('');

      toast({
        title: "Sector Weight Configuration Created",
        description: `Created "${newConfigName}" configuration successfully`
      });
    } catch (error) {
      console.error('Failed to create config:', error);
      toast({
        title: "Configuration Failed",
        description: error.message || "Failed to create sector weight configuration",
        variant: "destructive"
      });
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
          <CardTitle className="flex items-center gap-2">
            Fund Holdings Overlap Analysis
            <Badge variant="outline">Patent-Aligned</Badge>
          </CardTitle>
          <CardDescription>
            Advanced Weighted Jaccard Similarity analysis with sector-level weighting adjustments for portfolio overlap detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {fundIds.map((fundId) => (
                <Badge key={fundId} variant="outline">
                  {fundId}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="sector-config">Sector Weighting Configuration</Label>
                <Select value={selectedConfigId} onValueChange={setSelectedConfigId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector weighting (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Standard Weighting</SelectItem>
                    {sectorConfigs.map((config) => (
                      <SelectItem key={config.id} value={config.id}>
                        {config.config_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Create Config
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Sector Weight Configuration</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="config-name">Configuration Name</Label>
                      <Input
                        id="config-name"
                        value={newConfigName}
                        onChange={(e) => setNewConfigName(e.target.value)}
                        placeholder="e.g., Technology Focus"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(sectorWeights).map(([sector, weight]) => (
                        <div key={sector}>
                          <Label htmlFor={sector}>{sector}</Label>
                          <Input
                            id={sector}
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={weight}
                            onChange={(e) => setSectorWeights(prev => ({
                              ...prev,
                              [sector]: parseFloat(e.target.value) || 0
                            }))}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCreateConfig} disabled={!newConfigName}>
                        Create Configuration
                      </Button>
                      <Button variant="outline" onClick={() => setShowConfigDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <Button 
              onClick={handleComputeOverlap}
              disabled={loading || fundIds.length < 2}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze Overlap with Weighted Jaccard Similarity
            </Button>
          </div>

          {results && (
            <div className="space-y-6">
              {/* Algorithm Metadata */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4" />
                  <h3 className="font-semibold">Analysis Metadata</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Algorithm:</span> {results.algorithmMetadata.method}
                  </div>
                  <div>
                    <span className="font-medium">Sector Weighting:</span> {results.algorithmMetadata.sectorWeightingApplied ? 'Applied' : 'Standard'}
                  </div>
                  <div>
                    <span className="font-medium">Computed:</span> {new Date(results.algorithmMetadata.computationTimestamp).toLocaleString()}
                  </div>
                  {results.algorithmMetadata.weightConfigId && (
                    <div>
                      <span className="font-medium">Config ID:</span> {results.algorithmMetadata.weightConfigId.slice(0, 8)}...
                    </div>
                  )}
                </div>
              </div>

              {/* Pairwise Overlap Matrix */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Weighted Jaccard Similarity Matrix</h3>
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
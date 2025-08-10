import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { scoreLiquidity, persistLiquidityScore, type LiquidityScoreResult } from '@/engines/private/liquidityIQ';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface LiquidityScorecardProps {
  fundId: string;
}

export function LiquidityScorecard({ fundId }: LiquidityScorecardProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LiquidityScoreResult | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadExistingScore();
    loadLiquidityEvents();
  }, [fundId]);

  const loadExistingScore = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('liquidity_scores')
        .select('*')
        .eq('user_id', user.id)
        .eq('fund_id', fundId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        setResult({
          score: data.score,
          breakdown: JSON.parse(data.breakdown)
        });
      }
    } catch (error) {
      console.warn('Failed to load existing score:', error);
    }
  };

  const loadLiquidityEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('liquidity_events')
        .select('*')
        .eq('fund_id', fundId)
        .order('event_date', { ascending: false })
        .limit(10);

      if (data && !error) {
        setEvents(data);
      }
    } catch (error) {
      console.warn('Failed to load liquidity events:', error);
    }
  };

  const handleCalculateScore = async () => {
    setLoading(true);
    try {
      const scoreResult = await scoreLiquidity({ 
        fundId,
        events: events.length > 0 ? events : undefined
      });
      setResult(scoreResult);

      // Persist score
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await persistLiquidityScore(
          user.id,
          fundId,
          { fundId, events },
          scoreResult
        );
      }

      toast({
        title: "Liquidity Score Calculated",
        description: `Fund liquidity scored: ${scoreResult.score}/100`
      });
    } catch (error) {
      console.error('Liquidity scoring failed:', error);
      toast({
        title: "Scoring Failed",
        description: error.message || "Failed to calculate liquidity score",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { text: 'Excellent', variant: 'default' as const };
    if (score >= 60) return { text: 'Good', variant: 'secondary' as const };
    if (score >= 40) return { text: 'Fair', variant: 'outline' as const };
    return { text: 'Poor', variant: 'destructive' as const };
  };

  const formatComponentScore = (value: number) => `${Math.round(value)}/100`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Liquidity IQ™ Score</CardTitle>
          <CardDescription>
            Comprehensive liquidity assessment for {fundId}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={handleCalculateScore}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {result ? 'Recalculate Score' : 'Calculate Score'}
            </Button>
            
            {result && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Last updated:</span>
                <span className="text-sm">{new Date().toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {result && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center p-6 rounded-lg bg-muted/50">
                <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}/100
                </div>
                <div className="mt-2">
                  <Badge {...getScoreBadge(result.score)}>
                    {getScoreBadge(result.score).text}
                  </Badge>
                </div>
                <Progress value={result.score} className="mt-4" />
              </div>

              {/* Component Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Score Breakdown</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <div className="font-medium">Gate Probability</div>
                        <div className="text-sm text-muted-foreground">35% weight</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatComponentScore(result.breakdown.gateProb)}</div>
                        <Progress value={result.breakdown.gateProb} className="w-16 h-2" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <div className="font-medium">NAV→Cash Timeline</div>
                        <div className="text-sm text-muted-foreground">25% weight</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatComponentScore(result.breakdown.navToCash)}</div>
                        <Progress value={result.breakdown.navToCash} className="w-16 h-2" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <div className="font-medium">Fulfillment Rate</div>
                        <div className="text-sm text-muted-foreground">20% weight</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatComponentScore(result.breakdown.fulfillment)}</div>
                        <Progress value={result.breakdown.fulfillment} className="w-16 h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <div className="font-medium">Penalty Structure</div>
                        <div className="text-sm text-muted-foreground">10% weight</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatComponentScore(result.breakdown.penalties)}</div>
                        <Progress value={result.breakdown.penalties} className="w-16 h-2" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <div className="font-medium">Vintage Adjustment</div>
                        <div className="text-sm text-muted-foreground">5% weight</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatComponentScore(result.breakdown.vintageAdj)}</div>
                        <Progress value={result.breakdown.vintageAdj} className="w-16 h-2" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <div className="font-medium">AUM Trend</div>
                        <div className="text-sm text-muted-foreground">5% weight</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatComponentScore(result.breakdown.aumTrendAdj)}</div>
                        <Progress value={result.breakdown.aumTrendAdj} className="w-16 h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Events Timeline */}
      {events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Liquidity Events</CardTitle>
            <CardDescription>
              Timeline of liquidity-related events for {fundId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.slice(0, 5).map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="flex-shrink-0">
                    {event.event_type === 'gate' || event.event_type === 'pause' ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : event.event_type === 'resume' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium capitalize">
                      {event.event_type.replace('-', ' ')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.event_date).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge 
                    variant={
                      event.event_type === 'gate' || event.event_type === 'pause' 
                        ? 'destructive' 
                        : event.event_type === 'resume' 
                        ? 'default' 
                        : 'secondary'
                    }
                  >
                    {event.event_type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
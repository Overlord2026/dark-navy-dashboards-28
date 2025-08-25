import React from 'react';
import { safeCallTool } from '@/features/ai/agents/runtime';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface AdvisorCopilotProps {
  ctx: {
    advisorId?: string;
    clientCount?: number;
    bookValue?: number;
    employeePct?: number;
    fullMatchPct?: number;
    leftEmployer?: boolean;
    balance?: number;
    age?: number;
    riskFlags?: string[];
    selectedClients?: string[];
  };
}

interface Insight {
  title: string;
  body: any;
  type: 'evidence' | 'policy' | 'action' | 'book' | 'playbook';
  confidence?: number;
  priority?: number;
}

export default function AdvisorCopilot({ ctx }: AdvisorCopilotProps) {
  const [insights, setInsights] = React.useState<Insight[]>([]);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  async function generateInsights() {
    setLoading(true);
    try {
      // Get book analytics
      const bookStats = {
        clientCount: ctx.clientCount || 0,
        bookValue: ctx.bookValue || 0,
        riskFlags: ctx.riskFlags || [],
        selectedClients: ctx.selectedClients || []
      };

      // Search for relevant evidence
      const factsResult = await safeCallTool('rag.search', {
        q: `advisor book management 401k rollover opportunities ${ctx.selectedClients?.join(' ')}`,
        k: 5
      }, { persona: 'Advisor', userId: ctx.advisorId });

      // Evaluate decision rules for selected clients
      const rulesResult = await safeCallTool('k401.rules', {
        employeePct: ctx.employeePct || 0,
        fullMatchPct: ctx.fullMatchPct || 0,
        leftEmployer: ctx.leftEmployer || false,
        balance: ctx.balance || 0,
        age: ctx.age || 30
      }, { persona: 'Advisor', userId: ctx.advisorId });

      const newInsights: Insight[] = [];

      // Book overview
      newInsights.push({
        title: 'Book Overview',
        body: bookStats,
        type: 'book'
      });

      if (factsResult.success) {
        newInsights.push({
          title: 'Market Intelligence',
          body: factsResult.data?.slice(0, 3) || [],
          type: 'evidence'
        });
      }

      if (rulesResult.success && rulesResult.data?.length > 0) {
        newInsights.push({
          title: 'Client Opportunities',
          body: rulesResult.data,
          type: 'policy'
        });

        // Generate playbook actions
        const highPriorityActions = rulesResult.data
          .filter((rule: any) => rule.priority >= 7)
          .map((rule: any) => rule.next || [])
          .flat();

        if (highPriorityActions.length > 0) {
          newInsights.push({
            title: 'Recommended Playbooks',
            body: [...new Set(highPriorityActions)], // Remove duplicates
            type: 'playbook'
          });
        }
      }

      setInsights(newInsights);
      toast({
        title: "Advisor Insights Generated",
        description: `Found ${newInsights.length} insights for your book.`
      });
    } catch (error) {
      console.error('Failed to generate advisor insights:', error);
      toast({
        title: "Error",
        description: "Failed to generate insights. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  async function executePlaybook(playbook: string) {
    try {
      await safeCallTool('receipt.log', {
        action: `advisor.playbook.${playbook.toLowerCase().replace(/\s+/g, '_')}`,
        reasons: ['advisor_initiated', `clients:${ctx.selectedClients?.length || 0}`]
      }, { persona: 'Advisor', userId: ctx.advisorId });

      toast({
        title: "Playbook Executed",
        description: `${playbook} has been initiated for selected clients.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute playbook.",
        variant: "destructive"
      });
    }
  }

  async function bulkAction(actionType: string) {
    try {
      await safeCallTool('receipt.log', {
        action: `advisor.bulk.${actionType}`,
        reasons: ['bulk_action', `clients:${ctx.selectedClients?.length || 0}`]
      }, { persona: 'Advisor', userId: ctx.advisorId });

      toast({
        title: "Bulk Action Initiated",
        description: `${actionType.replace('_', ' ')} for ${ctx.selectedClients?.length || 0} clients.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute bulk action.",
        variant: "destructive"
      });
    }
  }

  React.useEffect(() => {
    if (ctx.advisorId) {
      generateInsights();
    }
  }, [ctx.advisorId, ctx.selectedClients?.length]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span>💼 Advisor Copilot</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generateInsights}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Refresh Insights'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {insights.length === 0 && !loading && (
            <div className="text-center text-muted-foreground py-4">
              Click "Refresh Insights" to analyze your client book
            </div>
          )}
          
          {insights.map((insight, index) => (
            <Card key={index} className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  {insight.type === 'book' && '📊'}
                  {insight.type === 'evidence' && '🔍'}
                  {insight.type === 'policy' && '⚖️'}
                  {insight.type === 'playbook' && '🎯'}
                  {insight.title}
                  {insight.confidence && (
                    <span className="text-xs text-muted-foreground">
                      ({Math.round(insight.confidence * 100)}% confidence)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {insight.type === 'book' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold">{insight.body.clientCount}</div>
                      <div className="text-xs text-muted-foreground">Active Clients</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        ${(insight.body.bookValue / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-xs text-muted-foreground">Book Value</div>
                    </div>
                    {insight.body.riskFlags?.length > 0 && (
                      <div className="col-span-2">
                        <div className="text-xs text-muted-foreground mb-1">Risk Flags</div>
                        <div className="flex flex-wrap gap-1">
                          {insight.body.riskFlags.map((flag: string, i: number) => (
                            <Badge key={i} variant="destructive" className="text-xs">
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {insight.type === 'evidence' && (
                  <div className="space-y-2">
                    {Array.isArray(insight.body) && insight.body.map((item: any, i: number) => (
                      <div key={i} className="text-sm border-l-2 border-primary/20 pl-2">
                        <div className="font-medium">{item.meta?.source || 'Market Data'}</div>
                        <div className="text-muted-foreground">{item.text?.slice(0, 150)}...</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {insight.type === 'policy' && (
                  <div className="space-y-2">
                    {Array.isArray(insight.body) && insight.body.map((rule: any, i: number) => (
                      <div key={i} className="p-2 bg-background rounded border">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm">
                            {rule.action?.replace('k401.', '').replace('_', ' ')}
                          </div>
                          {rule.priority && (
                            <Badge variant={rule.priority >= 8 ? 'destructive' : 'secondary'}>
                              P{rule.priority}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {rule.reasons?.join(' • ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {insight.type === 'playbook' && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => executePlaybook('Increase Deferral')}
                        className="justify-start"
                      >
                        📈 Increase Deferral Campaign
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executePlaybook('Launch Rollover')}
                        className="justify-start"
                      >
                        🔄 Launch Rollover Wizard
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executePlaybook('Prepare Review')}
                        className="justify-start"
                      >
                        📋 Prepare Annual Review
                      </Button>
                    </div>
                    
                    {ctx.selectedClients && ctx.selectedClients.length > 0 && (
                      <div className="mt-3 pt-2 border-t">
                        <div className="text-xs text-muted-foreground mb-2">
                          Bulk Actions ({ctx.selectedClients.length} selected)
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => bulkAction('nudge')}
                          >
                            Bulk Nudge
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => bulkAction('review')}
                          >
                            Schedule Reviews
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
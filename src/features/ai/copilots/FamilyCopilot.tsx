import React from 'react';
import { safeCallTool } from '@/features/ai/agents/runtime';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FamilyCopilotProps {
  ctx: {
    householdId?: string;
    employeePct?: number;
    fullMatchPct?: number;
    leftEmployer?: boolean;
    balance?: number;
    age?: number;
    annualSalary?: number;
  };
}

interface Insight {
  title: string;
  body: any;
  type: 'evidence' | 'policy' | 'action';
  confidence?: number;
}

export default function FamilyCopilot({ ctx }: FamilyCopilotProps) {
  const [insights, setInsights] = React.useState<Insight[]>([]);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  async function generateInsights() {
    setLoading(true);
    try {
      // Search for relevant evidence
      const factsResult = await safeCallTool('rag.search', {
        q: `${ctx.householdId || 'household'} 401k match policy retirement planning`,
        k: 3
      }, { persona: 'Family', userId: ctx.householdId });

      // Evaluate decision rules
      const rulesResult = await safeCallTool('k401.rules', {
        employeePct: ctx.employeePct || 0,
        fullMatchPct: ctx.fullMatchPct || 0,
        leftEmployer: ctx.leftEmployer || false,
        balance: ctx.balance || 0,
        age: ctx.age || 30,
        annualSalary: ctx.annualSalary || 50000
      }, { persona: 'Family', userId: ctx.householdId });

      const newInsights: Insight[] = [];

      if (factsResult.success) {
        newInsights.push({
          title: 'Evidence & Context',
          body: factsResult.data?.slice(0, 2) || [],
          type: 'evidence'
        });
      }

      if (rulesResult.success && rulesResult.data?.length > 0) {
        newInsights.push({
          title: 'Policy Recommendations',
          body: rulesResult.data,
          type: 'policy'
        });

        // Generate actionable next steps
        const topRecommendation = rulesResult.data[0];
        if (topRecommendation?.next) {
          newInsights.push({
            title: 'What To Do Next',
            body: topRecommendation.next,
            type: 'action',
            confidence: topRecommendation.confidence
          });
        }
      }

      setInsights(newInsights);
      toast({
        title: "Insights Generated",
        description: `Found ${newInsights.length} relevant insights for your situation.`
      });
    } catch (error) {
      console.error('Failed to generate insights:', error);
      toast({
        title: "Error",
        description: "Failed to generate insights. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  async function takeAction(actionType: string) {
    try {
      await safeCallTool('receipt.log', {
        action: `family.copilot.${actionType}`,
        reasons: ['user_initiated']
      }, { persona: 'Family', userId: ctx.householdId });

      toast({
        title: "Action Initiated",
        description: `${actionType.replace('_', ' ')} has been started.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate action.",
        variant: "destructive"
      });
    }
  }

  React.useEffect(() => {
    if (ctx.householdId) {
      generateInsights();
    }
  }, [ctx.householdId]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span>🏠 Family Copilot</span>
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
              Click "Refresh Insights" to analyze your financial situation
            </div>
          )}
          
          {insights.map((insight, index) => (
            <Card key={index} className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  {insight.type === 'evidence' && '📄'}
                  {insight.type === 'policy' && '⚖️'}
                  {insight.type === 'action' && '🎯'}
                  {insight.title}
                  {insight.confidence && (
                    <span className="text-xs text-muted-foreground">
                      ({Math.round(insight.confidence * 100)}% confidence)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {insight.type === 'evidence' && (
                  <div className="space-y-2">
                    {Array.isArray(insight.body) && insight.body.map((item: any, i: number) => (
                      <div key={i} className="text-sm">
                        <div className="font-medium">{item.meta?.source || 'Document'}</div>
                        <div className="text-muted-foreground">{item.text?.slice(0, 200)}...</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {insight.type === 'policy' && (
                  <div className="space-y-2">
                    {Array.isArray(insight.body) && insight.body.map((rule: any, i: number) => (
                      <div key={i} className="p-2 bg-background rounded border">
                        <div className="font-medium text-sm">{rule.action?.replace('k401.', '').replace('_', ' ')}</div>
                        <div className="text-xs text-muted-foreground">
                          Reasons: {rule.reasons?.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {insight.type === 'action' && (
                  <div className="space-y-2">
                    {Array.isArray(insight.body) && insight.body.map((action: string, i: number) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => takeAction(action.toLowerCase().replace(' ', '_'))}
                      >
                        {action}
                      </Button>
                    ))}
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
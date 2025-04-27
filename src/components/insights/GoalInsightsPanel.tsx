
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAIInsights } from "@/components/insights/AIInsightsProvider";
import { Brain, LoaderIcon } from "lucide-react";

interface GoalInsightsPanelProps {
  goalId: string;
  goalTitle: string;
  goalData: any;
}

export function GoalInsightsPanel({ goalId, goalTitle, goalData }: GoalInsightsPanelProps) {
  const { requestInsight, loading, getInsightsByGoal } = useAIInsights();
  const [isOpen, setIsOpen] = useState(false);
  const [currentInsight, setCurrentInsight] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const goalInsights = getInsightsByGoal(goalId);
  
  const handleGenerateInsight = async () => {
    setIsGenerating(true);
    try {
      const insight = await requestInsight({
        type: 'goal',
        context: { goal: goalData },
        goalId: goalId
      });
      
      setCurrentInsight(insight.content);
      setIsOpen(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Card className="border border-blue-900/30 bg-blue-900/10 hover:bg-blue-900/20 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-400" />
            AI Goal Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Get personalized AI analysis and recommendations to help achieve your {goalTitle.toLowerCase()} goal.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGenerateInsight}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                Analyzing goal...
              </>
            ) : (
              "Analyze This Goal"
            )}
          </Button>
          
          {goalInsights.length > 0 && (
            <div className="mt-4 pt-4 border-t border-blue-900/30">
              <h4 className="text-xs font-medium mb-2">Previous Insights</h4>
              <div className="space-y-2">
                {goalInsights.slice(0, 2).map((insight) => (
                  <Button 
                    key={insight.id} 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => {
                      setCurrentInsight(insight.content);
                      setIsOpen(true);
                    }}
                  >
                    <div>
                      <p className="text-xs font-medium">{insight.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(insight.date).toLocaleDateString()}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-400" />
              AI Analysis for {goalTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 leading-relaxed">
            {currentInsight.split('\n').map((paragraph, i) => (
              <p key={i} className={`${i > 0 ? 'mt-4' : ''}`}>{paragraph}</p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

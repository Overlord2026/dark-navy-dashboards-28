
import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InsightCard } from "@/components/insights/InsightCard";
import { useAIInsights, InsightType } from "@/components/insights/AIInsightsProvider";
import { useFinancialPlans } from "@/context/FinancialPlanContext";
import { LoaderIcon, RefreshCcw } from "lucide-react";

export default function AIInsights() {
  const { insights, loading, requestInsight, markInsightAsViewed } = useAIInsights();
  const { activePlan } = useFinancialPlans();
  const [activeTab, setActiveTab] = useState<InsightType | 'all'>('all');
  const [selectedInsight, setSelectedInsight] = useState<any | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  
  const handleRequestInsight = async (type: InsightType) => {
    if (loading) return;
    
    setIsGeneratingInsight(true);
    try {
      let context = {};
      
      // Build context based on type
      switch(type) {
        case 'portfolio':
          context = { 
            holdings: [
              { symbol: "AAPL", companyName: "Apple Inc.", price: 175.42, weight: 15, sector: "Technology" },
              { symbol: "MSFT", companyName: "Microsoft Corp", price: 332.18, weight: 12, sector: "Technology" },
              { symbol: "AMZN", companyName: "Amazon.com Inc", price: 128.91, weight: 10, sector: "Consumer Cyclical" },
              { symbol: "GOOGL", companyName: "Alphabet Inc", price: 139.75, weight: 8, sector: "Communication Services" },
              { symbol: "BRK.B", companyName: "Berkshire Hathaway", price: 354.29, weight: 7, sector: "Financial Services" }
            ],
            portfolioName: "Growth Portfolio"
          };
          break;
        case 'goal':
          // Use the first goal from the active plan
          if (activePlan?.goals?.length) {
            context = { goal: activePlan.goals[0] };
          }
          break;
        // Add other context builders as needed
      }
      
      await requestInsight({ type, context });
    } finally {
      setIsGeneratingInsight(false);
    }
  };
  
  const filteredInsights = activeTab === 'all' 
    ? insights 
    : insights.filter(insight => insight.type === activeTab);
  
  const handleInsightClick = (insight: any) => {
    setSelectedInsight(insight);
    markInsightAsViewed(insight.id);
  };

  return (
    <ThreeColumnLayout activeMainItem="ai-insights" title="AI Insights">
      <div className="animate-in fade-in-80 p-4 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-semibold">AI-Powered Wealth Insights</h1>
          <p className="text-muted-foreground text-sm">
            Get personalized insights and recommendations tailored to your financial goals and portfolio.
          </p>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as InsightType | 'all')}>
          <div className="flex items-center justify-between">
            <TabsList className="bg-background border border-gray-800">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="goal">Goals</TabsTrigger>
              <TabsTrigger value="tax">Tax</TabsTrigger>
              <TabsTrigger value="retirement">Retirement</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
            </TabsList>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleRequestInsight(activeTab === 'all' ? 'general' : activeTab)}
              disabled={loading || isGeneratingInsight}
            >
              {isGeneratingInsight ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Generating
                </>
              ) : (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Generate Insight
                </>
              )}
            </Button>
          </div>

          <TabsContent value="all" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInsights.length > 0 ? (
                filteredInsights.map(insight => (
                  <InsightCard
                    key={insight.id}
                    id={insight.id}
                    type={insight.type}
                    title={insight.title}
                    content={insight.content}
                    date={insight.date}
                    viewed={insight.viewed}
                    onClick={() => handleInsightClick(insight)}
                  />
                ))
              ) : (
                <Card className="col-span-1 md:col-span-2 bg-muted/30">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <h3 className="text-lg font-medium mb-2">No insights yet</h3>
                    <p className="text-sm text-center text-muted-foreground mb-4">
                      Generate your first AI insight to get personalized recommendations
                    </p>
                    <Button 
                      onClick={() => handleRequestInsight('general')}
                      disabled={loading || isGeneratingInsight}
                    >
                      {isGeneratingInsight ? (
                        <>
                          <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                          Generating
                        </>
                      ) : (
                        "Generate First Insight"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {['portfolio', 'goal', 'tax', 'retirement', 'education', 'general'].map(type => (
            <TabsContent key={type} value={type} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredInsights.length > 0 ? (
                  filteredInsights.map(insight => (
                    <InsightCard
                      key={insight.id}
                      id={insight.id}
                      type={insight.type}
                      title={insight.title}
                      content={insight.content}
                      date={insight.date}
                      viewed={insight.viewed}
                      onClick={() => handleInsightClick(insight)}
                    />
                  ))
                ) : (
                  <Card className="col-span-1 md:col-span-2 bg-muted/30">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <h3 className="text-lg font-medium mb-2">No {type} insights yet</h3>
                      <p className="text-sm text-center text-muted-foreground mb-4">
                        Generate your first {type} insight to get personalized recommendations
                      </p>
                      <Button 
                        onClick={() => handleRequestInsight(type as InsightType)}
                        disabled={loading || isGeneratingInsight}
                      >
                        {isGeneratingInsight ? (
                          <>
                            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                            Generating
                          </>
                        ) : (
                          `Generate ${type.charAt(0).toUpperCase() + type.slice(1)} Insight`
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Insight Detail Dialog */}
        <Dialog open={!!selectedInsight} onOpenChange={(open) => !open && setSelectedInsight(null)}>
          <DialogContent className="max-w-2xl">
            {selectedInsight && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    {getIconForInsightType(selectedInsight.type)}
                    <DialogTitle>{selectedInsight.title}</DialogTitle>
                  </div>
                  <DialogDescription>
                    Generated {new Date(selectedInsight.date).toLocaleString()}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 leading-relaxed">
                  {selectedInsight.content.split('\n').map((paragraph: string, i: number) => (
                    <p key={i} className={`${i > 0 ? 'mt-4' : ''}`}>{paragraph}</p>
                  ))}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ThreeColumnLayout>
  );
}

function getIconForInsightType(type: InsightType) {
  switch(type) {
    case 'portfolio': return <BarChart3 className="h-5 w-5 text-blue-400" />;
    case 'goal': return <PiggyBank className="h-5 w-5 text-green-400" />;
    case 'tax': return <BadgeDollarSign className="h-5 w-5 text-yellow-400" />;
    case 'retirement': return <LightbulbIcon className="h-5 w-5 text-purple-400" />;
    case 'education': return <GraduationCap className="h-5 w-5 text-orange-400" />;
    case 'general': return <Brain className="h-5 w-5 text-cyan-400" />;
  }
}

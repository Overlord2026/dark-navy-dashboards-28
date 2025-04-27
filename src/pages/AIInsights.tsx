
import React, { useState, useEffect } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { useAIInsights } from '@/components/insights/AIInsightsProvider';
import { InsightCard } from '@/components/insights/InsightCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Brain, Filter, LoaderIcon } from 'lucide-react';
import { BarChart3Icon, PiggyBank, CircleDollarSign, FileText, GraduationCap, BarChart2Icon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InsightType } from '@/components/insights/AIInsightsProvider';

export default function AIInsights() {
  const { insights, loading, requestInsight, markInsightAsViewed, getInsightsByType } = useAIInsights();
  const [selectedTab, setSelectedTab] = useState<InsightType | 'all'>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  
  const filteredInsights = selectedTab === 'all' 
    ? insights 
    : getInsightsByType(selectedTab as InsightType);
    
  const handleGenerateInsight = async (type: InsightType) => {
    setIsGenerating(true);
    try {
      await requestInsight({
        type,
        context: {}
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleOpenInsight = (id: string) => {
    setSelectedInsight(id);
    markInsightAsViewed(id);
  };
  
  const getSelectedInsightContent = () => {
    return insights.find(insight => insight.id === selectedInsight);
  };
  
  const selectedInsightContent = getSelectedInsightContent();

  return (
    <ThreeColumnLayout title="AI Insights" activeMainItem="ai-insights">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              AI Financial Insights
            </h1>
            <p className="text-muted-foreground mt-2">
              Personalized AI-powered analysis and recommendations tailored to your financial situation.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
              disabled={loading || isGenerating}
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            
            <Button
              onClick={() => handleGenerateInsight('general')}
              disabled={isGenerating}
              className="whitespace-nowrap"
            >
              {isGenerating ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Generate New Insight
                </>
              )}
            </Button>
          </div>
        </div>
        
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as InsightType | 'all')}>
          <div className="mb-6">
            <TabsList className="w-full max-w-3xl bg-muted/60">
              <TabsTrigger value="all" className="flex-1">All Insights</TabsTrigger>
              <TabsTrigger value="portfolio" className="flex-1">Portfolio</TabsTrigger>
              <TabsTrigger value="goal" className="flex-1">Goals</TabsTrigger>
              <TabsTrigger value="tax" className="flex-1">Tax</TabsTrigger>
              <TabsTrigger value="retirement" className="flex-1">Retirement</TabsTrigger>
              <TabsTrigger value="education" className="flex-1">Education</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={selectedTab} className="mt-0">
            {filteredInsights.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No insights available</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  {selectedTab === 'all'
                    ? "Generate your first AI insight to get personalized recommendations."
                    : `Generate a ${selectedTab} insight to see personalized recommendations.`}
                </p>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => handleGenerateInsight(selectedTab === 'all' ? 'general' : selectedTab as InsightType)} 
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>Generate an Insight</>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInsights.map((insight) => (
                  <InsightCard
                    key={insight.id}
                    id={insight.id}
                    type={insight.type}
                    title={insight.title}
                    content={insight.content}
                    date={insight.date}
                    viewed={insight.viewed}
                    onClick={() => handleOpenInsight(insight.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Generate Specific Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => handleGenerateInsight('portfolio')}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <BarChart2Icon className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-md">Portfolio Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get AI-powered analysis of your investment portfolio with recommendations for optimization.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => handleGenerateInsight('goal')}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-green-400" />
                  <CardTitle className="text-md">Goal Achievement</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Receive personalized recommendations to help you achieve your financial goals faster.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => handleGenerateInsight('tax')}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="h-5 w-5 text-yellow-400" />
                  <CardTitle className="text-md">Tax Optimization</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Discover strategies to minimize your tax burden and maximize after-tax returns.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => handleGenerateInsight('retirement')}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                  <CardTitle className="text-md">Retirement Planning</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get insights on your retirement readiness and suggestions to improve your retirement strategy.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => handleGenerateInsight('education')}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-orange-400" />
                  <CardTitle className="text-md">Education Funding</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Analyze your education savings strategy and get recommendations for funding educational goals.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Dialog open={!!selectedInsight} onOpenChange={(open) => {
        if (!open) setSelectedInsight(null);
      }}>
        <DialogContent className="max-w-3xl">
          {selectedInsightContent && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  {selectedInsightContent.type === 'portfolio' && <BarChart2Icon className="h-5 w-5 text-blue-400" />}
                  {selectedInsightContent.type === 'goal' && <PiggyBank className="h-5 w-5 text-green-400" />}
                  {selectedInsightContent.type === 'tax' && <CircleDollarSign className="h-5 w-5 text-yellow-400" />}
                  {selectedInsightContent.type === 'retirement' && <FileText className="h-5 w-5 text-purple-400" />}
                  {selectedInsightContent.type === 'education' && <GraduationCap className="h-5 w-5 text-orange-400" />}
                  {selectedInsightContent.type === 'general' && <Brain className="h-5 w-5 text-cyan-400" />}
                  <DialogTitle>{selectedInsightContent.title}</DialogTitle>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">{selectedInsightContent.type}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(selectedInsightContent.date).toLocaleDateString()}
                  </span>
                </div>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                {selectedInsightContent.content.split('\n').map((paragraph, i) => (
                  <p key={i} className={`${i > 0 ? 'mt-4' : ''}`}>{paragraph}</p>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </ThreeColumnLayout>
  );
}

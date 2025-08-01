import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Loader2, TrendingUp, Crown, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { TaxAnalysisProgress } from './TaxAnalysisProgress';
import { TaxOpportunityMap } from './TaxOpportunityMap';
import { TaxAnalysisCTAs } from './TaxAnalysisCTAs';

interface UnifiedAnalysisResult {
  opportunities: TaxOpportunity[];
  totalPotentialSavings: number;
  confidenceScore: number;
  analysisTimestamp: string;
  recommendations: string[];
  nextSteps: string[];
}

interface TaxOpportunity {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  complexity: 'low' | 'medium' | 'high';
  timeFrame: 'immediate' | 'this_year' | 'multi_year';
  category: 'roth_conversion' | 'withdrawal_sequencing' | 'bracket_management' | 'deduction_optimization' | 'estate_planning';
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  actionItems: string[];
}

interface UnifiedTaxAnalyzerProps {
  subscriptionTier: 'free' | 'basic' | 'premium';
}

export function UnifiedTaxAnalyzer({ subscriptionTier }: UnifiedTaxAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<UnifiedAnalysisResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  
  const { toast } = useToast();
  const { checkFeatureAccess } = useSubscriptionAccess();
  
  const hasBasicAccess = checkFeatureAccess('basic');
  const hasAdvancedAccess = checkFeatureAccess('premium');

  const analysisSteps = [
    { name: 'Gathering Financial Data', duration: 1000 },
    { name: 'Running Tax Bracket Analysis', duration: 1500 },
    { name: 'Calculating Roth Conversion Opportunities', duration: 2000 },
    { name: 'Analyzing Withdrawal Sequences', duration: 1800 },
    { name: 'Multi-Year Tax Projections', duration: 2200 },
    { name: 'Optimizing Deduction Strategies', duration: 1600 },
    { name: 'Generating Recommendations', duration: 1200 }
  ];

  const runUnifiedAnalysis = async () => {
    if (!hasBasicAccess) {
      toast({
        title: "Upgrade Required",
        description: "Unified tax analysis requires a Basic subscription or higher",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisResult(null);

    try {
      // Simulate progress through analysis steps
      let currentProgress = 0;
      for (let i = 0; i < analysisSteps.length; i++) {
        const step = analysisSteps[i];
        setCurrentStep(step.name);
        
        // Simulate step duration
        await new Promise(resolve => setTimeout(resolve, step.duration));
        
        currentProgress = ((i + 1) / analysisSteps.length) * 100;
        setAnalysisProgress(currentProgress);
      }

      // Call unified analysis edge function
      const { data, error } = await supabase.functions.invoke('unified-tax-analysis', {
        body: {
          analysis_type: hasAdvancedAccess ? 'comprehensive' : 'standard',
          include_ai_recommendations: hasAdvancedAccess,
          user_data: {
            // In production, this would come from user's actual financial data
            agi: 150000,
            age: 45,
            filing_status: 'married_filing_jointly',
            retirement_accounts: {
              traditional_401k: 400000,
              roth_401k: 100000,
              traditional_ira: 200000,
              roth_ira: 50000
            },
            taxable_accounts: 300000,
            state: 'CA'
          }
        }
      });

      if (error) throw error;

      setAnalysisResult(data);
      setCurrentStep('Analysis Complete');

      toast({
        title: "Analysis Complete",
        description: `Found ${data.opportunities.length} tax optimization opportunities`,
      });

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error running the tax analysis",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Analyze & Optimize Button */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <span className="text-xl">Unified Tax Analysis</span>
              {hasAdvancedAccess && <Crown className="h-5 w-5 text-yellow-500 ml-2 inline" />}
            </div>
            <Badge variant={hasAdvancedAccess ? "default" : hasBasicAccess ? "secondary" : "outline"}>
              {hasAdvancedAccess ? "AI-Powered" : hasBasicAccess ? "Standard" : "Upgrade Required"}
            </Badge>
          </CardTitle>
          <CardDescription className="text-base">
            Run comprehensive analysis across all tax planning strategies to identify your biggest opportunities
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Analysis Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Included Analysis
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Tax bracket optimization across multiple years
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Roth conversion opportunity analysis
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Withdrawal sequencing optimization
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Deduction and credit maximization
                </li>
                {hasAdvancedAccess && (
                  <>
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      AI-powered scenario planning
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      Estate planning tax strategies
                    </li>
                  </>
                )}
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Output
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Ranked opportunity map
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Potential savings estimate
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Action-oriented recommendations
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  CPA consultation preparation
                </li>
              </ul>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={runUnifiedAnalysis}
              disabled={isAnalyzing || !hasBasicAccess}
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="mr-3 h-5 w-5" />
                  Analyze & Optimize
                </>
              )}
            </Button>
          </div>

          {!hasBasicAccess && (
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">
                Unlock comprehensive tax analysis with a Basic subscription
              </p>
              <Button variant="outline">
                Upgrade to Basic - $29/month
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Bar */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TaxAnalysisProgress 
              progress={analysisProgress}
              currentStep={currentStep}
              steps={analysisSteps}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <TaxOpportunityMap result={analysisResult} />
            <TaxAnalysisCTAs 
              result={analysisResult}
              subscriptionTier={subscriptionTier}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
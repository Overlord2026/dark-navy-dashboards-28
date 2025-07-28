import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock, TrendingUp, ArrowRight } from 'lucide-react';

interface QuickStartPromptProps {
  onQuickStart: () => void;
  onFullAssessment: () => void;
}

export const QuickStartPrompt: React.FC<QuickStartPromptProps> = ({
  onQuickStart,
  onFullAssessment
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Health & Wealth Longevity Scorecard</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover if your money will last as long as you do. Get a personalized score and actionable recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Quick Start Option */}
        <Card className="relative border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="default" className="bg-primary/20 text-primary-foreground">
                <Zap className="h-3 w-3 mr-1" />
                Quick Start
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                2 minutes
              </div>
            </div>
            <CardTitle className="text-2xl">Get Instant Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Get an estimated longevity score using typical retirement planning values. Perfect for a quick assessment.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">What's included:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Pre-filled with common retirement scenarios
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Instant longevity score and recommendations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Option to refine for personalized results
                </li>
              </ul>
            </div>

            <Button 
              size="lg" 
              className="w-full h-12 text-lg"
              onClick={onQuickStart}
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Quick Start Assessment
            </Button>
          </CardContent>
        </Card>

        {/* Full Assessment Option */}
        <Card className="relative border-border hover:border-primary/30 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline">
                Detailed Analysis
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                5-8 minutes
              </div>
            </div>
            <CardTitle className="text-2xl">Complete Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Enter your specific financial details for the most accurate longevity score and personalized recommendations.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">What's included:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-foreground rounded-full"></div>
                  Your exact financial situation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-foreground rounded-full"></div>
                  Personalized bucket strategy
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-foreground rounded-full"></div>
                  Detailed stress testing scenarios
                </li>
              </ul>
            </div>

            <Button 
              variant="outline" 
              size="lg" 
              className="w-full h-12 text-lg group"
              onClick={onFullAssessment}
            >
              Complete Assessment
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Trust Indicators */}
      <div className="text-center space-y-3">
        <div className="flex justify-center items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>100% Free Assessment</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>No Email Required</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Privacy Protected</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
          Built by CFP® professionals with 20+ years of experience. Used by thousands of families for retirement planning.
        </p>
      </div>
    </div>
  );
};
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Calendar, ArrowRight, CheckCircle, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { LongevityScore } from '@/hooks/useLongevityScorecard';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';

interface LongevityScoreDisplayProps {
  score: LongevityScore;
  onScheduleReview: () => void;
  onGetRoadmap: () => void;
  onDownloadReport?: () => void;
}

export const LongevityScoreDisplay: React.FC<LongevityScoreDisplayProps> = ({
  score,
  onScheduleReview,
  onGetRoadmap,
  onDownloadReport
}) => {
  const { subscriptionPlan } = useSubscriptionAccess();
  const isPremium = subscriptionPlan?.tier === 'premium' || subscriptionPlan?.tier === 'elite';

  const getScoreIcon = () => {
    switch (score.level) {
      case 'Excellent':
        return <Trophy className="h-16 w-16 text-green-600" />;
      case 'Good':
        return <CheckCircle className="h-16 w-16 text-blue-600" />;
      case 'Caution':
        return <AlertTriangle className="h-16 w-16 text-yellow-600" />;
      case 'High Risk':
        return <AlertTriangle className="h-16 w-16 text-red-600" />;
    }
  };

  const getScoreColor = () => {
    switch (score.level) {
      case 'Excellent':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'Good':
        return 'from-blue-50 to-indigo-50 border-blue-200';
      case 'Caution':
        return 'from-yellow-50 to-orange-50 border-yellow-200';
      case 'High Risk':
        return 'from-red-50 to-pink-50 border-red-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Score Display */}
      <Card className={`bg-gradient-to-br ${getScoreColor()}`}>
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-4">
            {getScoreIcon()}
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Your Longevity Score
              </h1>
              <div className="text-6xl font-bold mb-2" style={{ color: score.color.replace('text-', '') }}>
                {score.score}/100
              </div>
              <Badge 
                variant="secondary" 
                className={`text-lg px-4 py-2 ${score.color.replace('text-', 'bg-').replace('-600', '-100')} border-current`}
              >
                {score.level}
              </Badge>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-muted-foreground mb-4">
              {score.message}
            </p>
            <Progress value={score.score} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {score.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recommended Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {score.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action CTAs */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Ready to Optimize Your Longevity Plan?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            Get personalized guidance to improve your score and secure your financial future.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              size="lg"
              className="h-16 text-lg"
              onClick={onScheduleReview}
            >
              <Calendar className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div>Schedule Free Review</div>
                <div className="text-xs opacity-90">Talk with a CFP® professional</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="h-16 text-lg"
              onClick={onGetRoadmap}
            >
              <div className="text-left">
                <div>Get Personalized Roadmap</div>
                <div className="text-xs opacity-70">Detailed implementation plan</div>
              </div>
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          {/* Premium Features */}
          {isPremium && (
            <div className="border-t pt-6">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Premium Features Available
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button variant="secondary" size="sm" onClick={onDownloadReport}>
                  Download Full Report
                </Button>
                <Button variant="secondary" size="sm">
                  Advanced Scenarios
                </Button>
                <Button variant="secondary" size="sm">
                  Monte Carlo Analysis
                </Button>
              </div>
            </div>
          )}

          {/* Trust Indicators */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="font-medium text-sm">Boutique Family Office™ Promise</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-success" />
                <span>Fiduciary duty. No commissions.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-success" />
                <span>Privacy-first. No data sharing.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-success" />
                <span>Always acting in your best interest.</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Disclaimer */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Important Disclaimer:</strong> Results are for planning purposes only. Actual outcomes may vary based on market conditions, 
            personal circumstances, and other factors. This tool does not constitute investment advice. 
            Please consult with a qualified financial professional before making investment decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
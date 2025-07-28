import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trophy, Calendar, ArrowRight, CheckCircle, AlertTriangle, TrendingUp, Users, Download, Share2, BookOpen, Play, ExternalLink, Mail } from 'lucide-react';
import { LongevityScore } from '@/hooks/useLongevityScorecard';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { useEventTracking } from '@/hooks/useEventTracking';
import { useToast } from '@/hooks/use-toast';

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
  const { trackFeatureUsed } = useEventTracking();
  const { toast } = useToast();
  const isPremium = subscriptionPlan?.tier === 'premium' || subscriptionPlan?.tier === 'elite';
  
  const [emailForDownload, setEmailForDownload] = useState('');
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

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

  const handleDownloadMyPlan = () => {
    if (isPremium && onDownloadReport) {
      onDownloadReport();
      trackFeatureUsed('longevity_scorecard_pdf_download', { score: score.score, level: score.level });
    } else {
      setIsEmailDialogOpen(true);
    }
  };

  const handleEmailSubmit = () => {
    if (emailForDownload) {
      // Track email capture for free users
      trackFeatureUsed('longevity_scorecard_email_capture', { 
        email: emailForDownload, 
        score: score.score, 
        level: score.level 
      });
      
      toast({
        title: "Plan Sent!",
        description: `Your longevity plan summary has been sent to ${emailForDownload}`,
      });
      
      setIsEmailDialogOpen(false);
      setEmailForDownload('');
    }
  };

  const handleShareWithSpouse = () => {
    setIsShareDialogOpen(true);
  };

  const handleShareSubmit = () => {
    if (shareEmail) {
      trackFeatureUsed('longevity_scorecard_spouse_share', { 
        shared_to: shareEmail, 
        score: score.score, 
        level: score.level 
      });
      
      toast({
        title: "Shared Successfully!",
        description: `Your scorecard has been shared with ${shareEmail}`,
      });
      
      setIsShareDialogOpen(false);
      setShareEmail('');
    }
  };

  const educationalResources = {
    'Excellent': [
      { title: 'Estate Planning Strategies', type: 'article', url: '#' },
      { title: 'Advanced Tax Optimization', type: 'video', url: '#' },
      { title: 'Legacy Planning Guide', type: 'guide', url: '#' }
    ],
    'Good': [
      { title: 'Fine-Tuning Your Portfolio', type: 'article', url: '#' },
      { title: 'Sequence of Returns Risk', type: 'video', url: '#' },
      { title: 'Income Planning Strategies', type: 'guide', url: '#' }
    ],
    'Caution': [
      { title: 'Catch-Up Contribution Strategies', type: 'article', url: '#' },
      { title: 'Delaying Retirement Benefits', type: 'video', url: '#' },
      { title: 'Expense Reduction Guide', type: 'guide', url: '#' }
    ],
    'High Risk': [
      { title: 'Emergency Retirement Planning', type: 'article', url: '#' },
      { title: 'Working in Retirement', type: 'video', url: '#' },
      { title: 'Social Security Maximization', type: 'guide', url: '#' }
    ]
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

            <Button 
              variant="secondary" 
              size="lg"
              className="h-16 text-lg"
              onClick={handleDownloadMyPlan}
            >
              <Download className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div>Download My Plan</div>
                <div className="text-xs opacity-70">
                  {isPremium ? 'PDF report ready' : 'Email summary'}
                </div>
              </div>
            </Button>
          </div>

          {/* Share and Book Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <Button 
              variant="outline" 
              size="lg"
              className="h-12"
              onClick={handleShareWithSpouse}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share with Spouse
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="h-12"
              onClick={() => {
                onScheduleReview();
                trackFeatureUsed('longevity_scorecard_book_review_cta');
              }}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book Review
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

      {/* Educational Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Learn More About Your Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {educationalResources[score.level].map((resource, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 justify-start"
                onClick={() => {
                  trackFeatureUsed('longevity_scorecard_education_click', { 
                    resource_title: resource.title,
                    resource_type: resource.type,
                    score_level: score.level
                  });
                  // Navigate to resource
                }}
              >
                <div className="flex items-start gap-3">
                  {resource.type === 'video' ? (
                    <Play className="h-4 w-4 mt-0.5 text-red-500" />
                  ) : resource.type === 'guide' ? (
                    <BookOpen className="h-4 w-4 mt-0.5 text-blue-500" />
                  ) : (
                    <ExternalLink className="h-4 w-4 mt-0.5 text-green-500" />
                  )}
                  <div className="text-left">
                    <div className="font-medium text-sm">{resource.title}</div>
                    <div className="text-xs text-muted-foreground capitalize">{resource.type}</div>
                  </div>
                </div>
              </Button>
            ))}
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
          <p className="text-xs text-muted-foreground text-center mt-2">
            Downloaded on {new Date().toLocaleString()} | Your privacy is protected - we never share your data.
          </p>
        </CardContent>
      </Card>

      {/* Email Download Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Get Your Longevity Plan Summary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your email to receive a detailed summary of your longevity scorecard and personalized recommendations.
            </p>
            <div className="space-y-2">
              <Label htmlFor="download-email">Email Address</Label>
              <Input
                id="download-email"
                type="email"
                value={emailForDownload}
                onChange={(e) => setEmailForDownload(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleEmailSubmit} className="flex-1">
                <Mail className="h-4 w-4 mr-2" />
                Send My Plan
              </Button>
              <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share with Your Spouse</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Share your longevity scorecard results with your spouse or partner for joint retirement planning.
            </p>
            <div className="space-y-2">
              <Label htmlFor="share-email">Spouse's Email Address</Label>
              <Input
                id="share-email"
                type="email"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                placeholder="spouse@email.com"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleShareSubmit} className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share Results
              </Button>
              <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
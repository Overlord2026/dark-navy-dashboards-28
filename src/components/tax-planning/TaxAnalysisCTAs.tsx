import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  FileDown, 
  MessageCircle, 
  Users, 
  BookOpen,
  ArrowRight,
  Crown,
  Sparkles,
  Clock,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

interface UnifiedAnalysisResult {
  opportunities: any[];
  totalPotentialSavings: number;
  confidenceScore: number;
  analysisTimestamp: string;
  recommendations: string[];
  nextSteps: string[];
}

interface TaxAnalysisCTAsProps {
  result: UnifiedAnalysisResult;
  subscriptionTier: 'free' | 'basic' | 'premium';
}

export function TaxAnalysisCTAs({ result, subscriptionTier }: TaxAnalysisCTAsProps) {
  const highImpactOpportunities = result.opportunities.filter(op => op.impact === 'high').length;
  const isPremium = subscriptionTier === 'premium';
  
  const ctaCards = [
    {
      id: 'cpa-consultation',
      title: 'Book CPA Consultation',
      description: 'Discuss your tax opportunities with a certified professional',
      icon: Calendar,
      urgency: 'high',
      savings: Math.round(result.totalPotentialSavings * 0.7),
      action: 'Schedule Now',
      premium: false,
      badge: `${highImpactOpportunities} High-Impact Items`,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'download-report',
      title: 'Download Detailed Report',
      description: 'Get a comprehensive PDF with all opportunities and action steps',
      icon: FileDown,
      urgency: 'medium',
      action: 'Download PDF',
      premium: false,
      badge: `${result.opportunities.length} Opportunities`,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'tax-strategy-session',
      title: 'Tax Strategy Deep Dive',
      description: 'AI-powered scenario planning for multi-year tax optimization',
      icon: Sparkles,
      urgency: 'medium',
      savings: Math.round(result.totalPotentialSavings * 0.3),
      action: 'Start Session',
      premium: true,
      badge: 'AI-Powered',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'advisor-matching',
      title: 'Find Tax Advisor',
      description: 'Connect with top-rated tax advisors in your area',
      icon: Users,
      urgency: 'low',
      action: 'Browse Advisors',
      premium: false,
      badge: 'Vetted Professionals',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'implementation-guide',
      title: 'Implementation Roadmap',
      description: 'Step-by-step guide to implement your tax strategies',
      icon: BookOpen,
      urgency: 'medium',
      action: 'View Guide',
      premium: false,
      badge: 'Action-Oriented',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'quarterly-review',
      title: 'Quarterly Tax Review',
      description: 'Ongoing monitoring and adjustments to your tax strategy',
      icon: Clock,
      urgency: 'low',
      action: 'Set Up Review',
      premium: true,
      badge: 'Ongoing Support',
      color: 'from-teal-500 to-teal-600'
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Star className="h-6 w-6 text-yellow-500" />
            Next Steps & Recommended Actions
            <Badge variant="outline">
              {formatCurrency(result.totalPotentialSavings)} in Potential Savings
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ctaCards.map((cta, index) => (
              <motion.div
                key={cta.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`h-full cursor-pointer transition-all hover:shadow-lg ${
                    cta.premium && !isPremium ? 'opacity-75' : ''
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 bg-gradient-to-r ${cta.color} rounded-lg`}>
                        <cta.icon className="h-5 w-5 text-white" />
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getUrgencyColor(cta.urgency)}`}
                        >
                          {cta.urgency.charAt(0).toUpperCase() + cta.urgency.slice(1)} Priority
                        </Badge>
                        
                        {cta.premium && (
                          <Badge variant="outline" className="text-xs">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg mb-2">{cta.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-3">{cta.description}</p>
                    
                    <Badge variant="secondary" className="w-fit">
                      {cta.badge}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {cta.savings && (
                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="text-lg font-bold text-green-600">
                            {formatCurrency(cta.savings)}
                          </div>
                          <p className="text-xs text-green-700">Estimated Annual Impact</p>
                        </div>
                      )}
                      
                      <Button 
                        className="w-full flex items-center justify-center gap-2"
                        variant={cta.premium && !isPremium ? "outline" : "default"}
                        disabled={cta.premium && !isPremium}
                      >
                        {cta.premium && !isPremium ? (
                          <>
                            <Crown className="h-4 w-4" />
                            Upgrade Required
                          </>
                        ) : (
                          <>
                            {cta.action}
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Recommended Implementation Timeline
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {result.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Prompt for Non-Premium Users */}
      {!isPremium && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              Unlock Advanced Tax Planning
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <p className="text-sm text-yellow-800 mb-4">
              Get AI-powered scenario planning, quarterly reviews, and advanced optimization strategies with Premium.
            </p>
            
            <div className="flex items-center gap-4">
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                Upgrade to Premium
              </Button>
              
              <div className="text-sm text-yellow-700">
                <span className="font-medium">Additional {formatCurrency(result.totalPotentialSavings * 0.3)}</span> in potential savings
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, TrendingDown, Target, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface CaseStudySlideProps {
  liveDemoMode?: boolean;
  whiteLabelEnabled?: boolean;
  presentationMode?: boolean;
}

export const CaseStudySlide: React.FC<CaseStudySlideProps> = ({
  liveDemoMode,
  whiteLabelEnabled,
  presentationMode
}) => {
  const [showAfter, setShowAfter] = useState(false);

  const beforeMetrics = {
    swagScore: 58,
    monthlyIncomeGap: -2400,
    successProbability: 62,
    taxEfficiency: 'Poor',
    riskLevel: 'High'
  };

  const afterMetrics = {
    swagScore: 92,
    monthlyIncomeGap: 850,
    successProbability: 94,
    taxEfficiency: 'Excellent',
    riskLevel: 'Moderate'
  };

  const improvements = [
    {
      category: 'Tax Strategy',
      before: 'No Roth conversions, suboptimal withdrawal sequence',
      after: '5-year Roth conversion plan, tax-efficient withdrawals',
      impact: '$85K lifetime tax savings'
    },
    {
      category: 'Asset Allocation',
      before: '80% stocks, 20% bonds (too aggressive for age)',
      after: 'SWAG™ phase-based allocation across 4 buckets',
      impact: 'Reduced volatility by 35%'
    },
    {
      category: 'Income Planning',
      before: '$2,400/month shortfall at retirement',
      after: '$850/month surplus with optimized strategy',
      impact: '$39,000 annual improvement'
    },
    {
      category: 'Risk Management',
      before: 'No healthcare cost planning, no LTC insurance',
      after: 'Healthcare reserves + LTC insurance strategy',
      impact: '$300K protected from health costs'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-[600px] p-8 md:p-16 bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">
            Real Client Transformation
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Before & After <span className="text-primary">Case Study</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Here's the difference our approach makes — turning uncertainty into clarity, 
            and transforming generic advice into a customized, actionable plan.
          </p>
        </motion.div>

        {/* Client Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Client Profile</div>
                  <div className="font-semibold">Married Couple</div>
                  <div className="text-sm">Ages 58 & 55</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Current Assets</div>
                  <div className="font-semibold">$2.1M</div>
                  <div className="text-sm">401(k) + Taxable</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Retirement Goal</div>
                  <div className="font-semibold">Age 62</div>
                  <div className="text-sm">$120K income</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Time Horizon</div>
                  <div className="font-semibold">30+ Years</div>
                  <div className="text-sm">Until age 90</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Before/After Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={!showAfter ? "default" : "ghost"}
              onClick={() => setShowAfter(false)}
              className="rounded-md"
            >
              Before SWAG™ GPS™
            </Button>
            <Button
              variant={showAfter ? "default" : "ghost"}
              onClick={() => setShowAfter(true)}
              className="rounded-md"
            >
              After Implementation
            </Button>
          </div>
        </div>

        {/* Metrics Comparison */}
        <motion.div
          key={showAfter ? 'after' : 'before'}
          initial={{ opacity: 0, x: showAfter ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {/* SWAG Score */}
          <Card className={showAfter ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className={`text-4xl font-bold ${getScoreColor(showAfter ? afterMetrics.swagScore : beforeMetrics.swagScore)}`}>
                  {showAfter ? afterMetrics.swagScore : beforeMetrics.swagScore}
                </div>
                <div className="text-sm text-muted-foreground">SWAG Score™</div>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${showAfter ? afterMetrics.swagScore : beforeMetrics.swagScore}%` }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  className={`h-3 rounded-full ${getScoreBackground(showAfter ? afterMetrics.swagScore : beforeMetrics.swagScore)}`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Monthly Income Gap */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className={`text-2xl font-bold ${showAfter ? 'text-green-600' : 'text-red-600'}`}>
                  {showAfter ? '+' : ''}{formatCurrency(showAfter ? afterMetrics.monthlyIncomeGap : beforeMetrics.monthlyIncomeGap)}
                </div>
                <div className="text-sm text-muted-foreground">Monthly {showAfter ? 'Surplus' : 'Shortfall'}</div>
              </div>
              {showAfter ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Goal Exceeded
                </Badge>
              ) : (
                <Badge variant="destructive">
                  Income Gap Risk
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Success Probability */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className={`text-3xl font-bold ${showAfter ? 'text-green-600' : 'text-orange-600'}`}>
                  {showAfter ? afterMetrics.successProbability : beforeMetrics.successProbability}%
                </div>
                <div className="text-sm text-muted-foreground">Success Probability</div>
              </div>
              <div className="flex items-center justify-center space-x-2">
                {showAfter ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-orange-500" />
                )}
                <span className="text-sm font-medium">
                  {showAfter ? 'Excellent' : 'At Risk'}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Improvement Details */}
        {showAfter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary" />
                  Key Improvements Made
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {improvements.map((improvement, index) => (
                    <div key={index} className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 border rounded-lg">
                      <div className="font-semibold text-primary">{improvement.category}</div>
                      <div className="text-sm">
                        <div className="text-muted-foreground mb-1">Before:</div>
                        <div>{improvement.before}</div>
                      </div>
                      <div className="text-sm">
                        <div className="text-muted-foreground mb-1">After:</div>
                        <div>{improvement.after}</div>
                      </div>
                      <div className="text-sm">
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {improvement.impact}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: showAfter ? 0.6 : 0.4 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Transform Your Client Conversations
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                This is the difference our approach makes — turning uncertainty into clarity, 
                and transforming generic advice into a customized, actionable plan.
              </p>
              
              {liveDemoMode && (
                <div className="flex justify-center space-x-4">
                  <Button size="lg">
                    See Full Case Study
                  </Button>
                  <Button size="lg" variant="outline">
                    Run Your Own Analysis
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Script Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-3">Advisor Script:</h4>
              <p className="text-sm leading-relaxed italic">
                "Here's the difference our approach makes — turning uncertainty into clarity, 
                and transforming generic advice into a customized, actionable plan. This client 
                went from being at risk to having confidence and clarity about their retirement future."
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
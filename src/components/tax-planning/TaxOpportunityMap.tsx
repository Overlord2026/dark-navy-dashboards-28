import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  ArrowRight,
  Zap,
  Star,
  Target,
  Calendar,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

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

interface UnifiedAnalysisResult {
  opportunities: TaxOpportunity[];
  totalPotentialSavings: number;
  confidenceScore: number;
  analysisTimestamp: string;
  recommendations: string[];
  nextSteps: string[];
}

interface TaxOpportunityMapProps {
  result: UnifiedAnalysisResult;
}

export function TaxOpportunityMap({ result }: TaxOpportunityMapProps) {
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
  
  const getOpportunityColor = (impact: string, category: string) => {
    const baseColors = {
      roth_conversion: 'from-purple-500 to-purple-600',
      withdrawal_sequencing: 'from-blue-500 to-blue-600',
      bracket_management: 'from-green-500 to-green-600',
      deduction_optimization: 'from-orange-500 to-orange-600',
      estate_planning: 'from-indigo-500 to-indigo-600'
    };
    
    return baseColors[category as keyof typeof baseColors] || 'from-gray-500 to-gray-600';
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <Zap className="h-5 w-5" />;
      case 'medium': return <TrendingUp className="h-5 w-5" />;
      case 'low': return <Target className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTimeFrameIcon = (timeFrame: string) => {
    switch (timeFrame) {
      case 'immediate': return <Zap className="h-4 w-4" />;
      case 'this_year': return <Calendar className="h-4 w-4" />;
      case 'multi_year': return <BarChart3 className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Sort opportunities by potential savings (highest first)
  const sortedOpportunities = [...result.opportunities].sort((a, b) => b.potentialSavings - a.potentialSavings);

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <span className="text-xl">Tax Opportunity Analysis Results</span>
              <Badge variant="outline" className="ml-3">
                {result.opportunities.length} Opportunities Found
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(result.totalPotentialSavings)}
              </div>
              <p className="text-sm text-muted-foreground">Total Potential Annual Savings</p>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.round(result.confidenceScore * 100)}%
              </div>
              <p className="text-sm text-muted-foreground">Analysis Confidence Score</p>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {result.opportunities.filter(op => op.impact === 'high').length}
              </div>
              <p className="text-sm text-muted-foreground">High-Impact Opportunities</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunity Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Tax Optimization Opportunities
          <Badge variant="secondary">Ranked by Impact</Badge>
        </h3>
        
        <div className="grid gap-4">
          {sortedOpportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedOpportunity === opportunity.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedOpportunity(
                  selectedOpportunity === opportunity.id ? null : opportunity.id
                )}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 bg-gradient-to-r ${getOpportunityColor(opportunity.impact, opportunity.category)} rounded-lg`}>
                        <div className="text-white">
                          {getImpactIcon(opportunity.impact)}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">{opportunity.title}</h4>
                        <p className="text-muted-foreground text-sm mb-3">{opportunity.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className={getComplexityColor(opportunity.complexity)}>
                            {opportunity.complexity.charAt(0).toUpperCase() + opportunity.complexity.slice(1)} Complexity
                          </Badge>
                          
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getTimeFrameIcon(opportunity.timeFrame)}
                            {opportunity.timeFrame.replace('_', ' ')}
                          </Badge>
                          
                          <Badge variant="outline">
                            {Math.round(opportunity.confidence * 100)}% Confidence
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {formatCurrency(opportunity.potentialSavings)}
                      </div>
                      <p className="text-xs text-muted-foreground">Annual Savings</p>
                      <Badge 
                        variant={opportunity.impact === 'high' ? 'default' : 'secondary'}
                        className="mt-2"
                      >
                        {opportunity.impact.charAt(0).toUpperCase() + opportunity.impact.slice(1)} Impact
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                {selectedOpportunity === opportunity.id && (
                  <CardContent className="pt-0 border-t">
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium mb-2">Action Items:</h5>
                        <ul className="space-y-1">
                          {opportunity.actionItems.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button size="sm" className="flex items-center gap-2">
                          Learn More
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Key Recommendations */}
      {result.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Key Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
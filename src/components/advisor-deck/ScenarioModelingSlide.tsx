import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, TrendingUp, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScenarioModelingSlideProps {
  liveDemoMode?: boolean;
  whiteLabelEnabled?: boolean;
  presentationMode?: boolean;
}

export const ScenarioModelingSlide: React.FC<ScenarioModelingSlideProps> = ({
  liveDemoMode,
  whiteLabelEnabled,
  presentationMode
}) => {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const scenarios = [
    {
      id: 'early_retirement',
      name: 'Early Retirement by 5 Years',
      icon: Calendar,
      description: 'Retire at 60 instead of 65',
      baselineIncome: '$120,000',
      scenarioIncome: '$95,000',
      impact: -25000,
      feasibility: 'Feasible with adjustments',
      color: 'blue',
      recommendations: [
        'Increase savings rate by 8%',
        'Delay Social Security to age 67',
        'Reduce discretionary spending by 15%'
      ]
    },
    {
      id: 'market_drop',
      name: '30% Market Drop in Year 3',
      icon: TrendingUp,
      description: 'Major market correction early in retirement',
      baselineIncome: '$120,000',
      scenarioIncome: '$98,000',
      impact: -22000,
      feasibility: 'Manageable with reserves',
      color: 'red',
      recommendations: [
        'Maintain 3-year cash buffer',
        'Reduce withdrawal rate temporarily',
        'Consider part-time work for 2 years'
      ]
    },
    {
      id: 'roth_conversion',
      name: 'Roth Conversion Strategy',
      icon: DollarSign,
      description: 'Convert $500K over 5 years',
      baselineIncome: '$120,000',
      scenarioIncome: '$135,000',
      impact: 15000,
      feasibility: 'Highly beneficial',
      color: 'green',
      recommendations: [
        'Convert $100K annually for 5 years',
        'Time conversions in low-income years',
        'Use taxable accounts to pay taxes'
      ]
    },
    {
      id: 'ltc_event',
      name: 'Long-Term Care Event at 78',
      icon: Heart,
      description: '$75,000/year care costs for 4 years',
      baselineIncome: '$120,000',
      scenarioIncome: '$85,000',
      impact: -35000,
      feasibility: 'Requires LTC insurance',
      color: 'orange',
      recommendations: [
        'Purchase LTC insurance now',
        'Increase HSA contributions',
        'Set aside additional healthcare reserves'
      ]
    }
  ];

  const getColorClasses = (color: string) => ({
    blue: 'text-blue-500 bg-blue-50 border-blue-200',
    red: 'text-red-500 bg-red-50 border-red-200',
    green: 'text-green-500 bg-green-50 border-green-200',
    orange: 'text-orange-500 bg-orange-50 border-orange-200'
  }[color]);

  const getImpactColor = (impact: number) => {
    return impact > 0 ? 'text-green-600' : 'text-red-600';
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseInt(amount.replace(/[^0-9-]/g, '')) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
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
            Dynamic Planning & What-If Analysis
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-primary">Scenario</span> Modeling
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We can instantly model "what if" scenarios — from retiring early, to a market downturn, 
            to major life events. Clients see the direct impact in real time.
          </p>
        </motion.div>

        {/* Scenario Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  activeScenario === scenario.id ? 'ring-2 ring-primary scale-105' : ''
                }`}
                onClick={() => setActiveScenario(activeScenario === scenario.id ? null : scenario.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getColorClasses(scenario.color)}`}>
                      <scenario.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{scenario.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{scenario.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{scenario.baselineIncome}</div>
                      <div className="text-xs text-muted-foreground">Baseline</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{scenario.scenarioIncome}</div>
                      <div className="text-xs text-muted-foreground">With Scenario</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className={`text-lg font-semibold ${getImpactColor(scenario.impact)}`}>
                      {scenario.impact > 0 ? '+' : ''}{formatCurrency(scenario.impact)}
                    </div>
                    <div className="text-xs text-muted-foreground">Annual Impact</div>
                  </div>
                  <Badge 
                    variant={scenario.impact > 0 ? 'default' : 'secondary'} 
                    className="w-full justify-center mt-3"
                  >
                    {scenario.feasibility}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Detailed Scenario Analysis */}
        <AnimatePresence>
          {activeScenario && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8"
            >
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Impact Chart */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Financial Impact Analysis</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Current Plan Success Rate</span>
                          <Badge variant="default">85%</Badge>
                        </div>
                        <div className="w-full bg-muted rounded-full h-4">
                          <div className="bg-green-500 h-4 rounded-full w-[85%]" />
                        </div>
                        
                        <div className="flex justify-between items-center mt-6">
                          <span>With This Scenario</span>
                          <Badge variant={scenarios.find(s => s.id === activeScenario)?.impact > 0 ? 'default' : 'destructive'}>
                            {scenarios.find(s => s.id === activeScenario)?.impact > 0 ? '92%' : '71%'}
                          </Badge>
                        </div>
                        <div className="w-full bg-muted rounded-full h-4">
                          <div 
                            className={`h-4 rounded-full ${
                              scenarios.find(s => s.id === activeScenario)?.impact > 0 
                                ? 'bg-green-500 w-[92%]' 
                                : 'bg-orange-500 w-[71%]'
                            }`} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Recommended Actions</h3>
                      <ul className="space-y-3">
                        {scenarios.find(s => s.id === activeScenario)?.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-semibold text-primary">{idx + 1}</span>
                            </div>
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {liveDemoMode && (
                        <Button className="w-full mt-6">
                          Model This Scenario Live
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Script Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-3">Advisor Script:</h4>
              <p className="text-sm leading-relaxed italic">
                "We can instantly model 'what if' scenarios — from retiring early, to a market downturn, 
                to major life events. Clients see the direct impact in real time. This empowers them to 
                make informed decisions about their future and gives you concrete data to support your recommendations."
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
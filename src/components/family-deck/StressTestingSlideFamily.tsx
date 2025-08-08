import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingDown, Heart, AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface StressTestingSlideFamilyProps {
  presentationMode?: boolean;
}

export const StressTestingSlideFamily: React.FC<StressTestingSlideFamilyProps> = ({
  presentationMode
}) => {
  const [activeTest, setActiveTest] = useState<string>('market_crash');

  const stressTests = [
    {
      id: 'market_crash',
      name: 'Market Downturn',
      description: 'What if the market drops 30% in your early retirement years?',
      icon: TrendingDown,
      beforeSuccess: 85,
      afterSuccess: 72,
      impact: 'Plan adjusts to maintain your lifestyle with temporary spending reductions',
      color: 'red'
    },
    {
      id: 'healthcare',
      name: 'Healthcare Emergency',
      description: 'Long-term care costs $75,000 per year for 4 years',
      icon: Heart,
      beforeSuccess: 85,
      afterSuccess: 68,
      impact: 'Healthcare reserves and insurance strategies protect your family',
      color: 'orange'
    },
    {
      id: 'longevity',
      name: 'Living to 95',
      description: 'Both spouses live longer than expected',
      icon: Clock,
      beforeSuccess: 85,
      afterSuccess: 78,
      impact: 'Portfolio designed to support a longer, healthier life',
      color: 'blue'
    },
    {
      id: 'inflation',
      name: 'High Inflation',
      description: '5% inflation for 10 years instead of 2.5%',
      icon: AlertTriangle,
      beforeSuccess: 85,
      afterSuccess: 74,
      impact: 'Growth investments help maintain purchasing power',
      color: 'yellow'
    }
  ];

  const selectedTest = stressTests.find(test => test.id === activeTest) || stressTests[0];

  const getColorClasses = (color: string) => ({
    red: 'border-red-200 bg-red-50 text-red-800',
    orange: 'border-orange-200 bg-orange-50 text-orange-800',
    blue: 'border-blue-200 bg-blue-50 text-blue-800',
    yellow: 'border-yellow-200 bg-yellow-50 text-yellow-800'
  }[color]);

  return (
    <div className="min-h-[600px] p-8 md:p-16 bg-gradient-to-br from-blue-50 via-background to-red-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 bg-blue-100 text-blue-800">
            What-If Planning
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-blue-600">Stress-Testing</span> & Scenario Modeling
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Life is unpredictable. Our Monte Carlo simulation shows you exactly how your 
            family's financial plan holds up against life's unexpected challenges.
          </p>
        </motion.div>

        {/* Main Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Chart Area */}
          <Card className="p-8">
            <h3 className="text-2xl font-semibold mb-6 text-center">Plan Success Probability</h3>
            
            <div className="space-y-6">
              {/* Normal Conditions */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Normal Conditions</span>
                  <Badge className="bg-green-100 text-green-800">85%</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-6">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-6 rounded-full flex items-center justify-end pr-2"
                  >
                    <span className="text-white text-xs font-medium">85%</span>
                  </motion.div>
                </div>
              </div>

              {/* Stress Test Results */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">With {selectedTest.name}</span>
                  <Badge className="bg-orange-100 text-orange-800">
                    {selectedTest.afterSuccess}%
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-6">
                  <motion.div
                    key={selectedTest.id}
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedTest.afterSuccess}%` }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-6 rounded-full flex items-center justify-end pr-2"
                  >
                    <span className="text-white text-xs font-medium">
                      {selectedTest.afterSuccess}%
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>What this means:</strong> {selectedTest.impact}
              </p>
            </div>
          </Card>

          {/* Scenario Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Test Your Plan Against:</h3>
            
            {stressTests.map((test) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + stressTests.indexOf(test) * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 ${
                    activeTest === test.id ? `ring-2 ring-blue-500 ${getColorClasses(test.color)}` : 'hover:shadow-md'
                  }`}
                  onClick={() => setActiveTest(test.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${activeTest === test.id ? 'bg-white' : 'bg-gray-100'}`}>
                        <test.icon className={`h-5 w-5 ${activeTest === test.id ? `text-${test.color}-500` : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{test.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {test.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Success Rate:</span>
                          <span className={`font-medium ${
                            test.afterSuccess >= 75 ? 'text-green-600' : 
                            test.afterSuccess >= 65 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {test.afterSuccess}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Family-Focused Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-blue-800">
                Peace of Mind Through Preparation
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                We don't just plan for the best-case scenario. By stress-testing your plan 
                against life's uncertainties, we help ensure your family stays on track 
                no matter what comes your way.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                  <div className="text-sm text-muted-foreground">Market scenarios tested</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                  <div className="text-sm text-muted-foreground">Client confidence after testing</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">30+</div>
                  <div className="text-sm text-muted-foreground">Years of market data analyzed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
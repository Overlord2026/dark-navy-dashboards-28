import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, TrendingDown, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface StressTestSlideProps {
  liveDemoMode?: boolean;
  whiteLabelEnabled?: boolean;
  presentationMode?: boolean;
}

export const StressTestSlide: React.FC<StressTestSlideProps> = ({
  liveDemoMode,
  whiteLabelEnabled,
  presentationMode
}) => {
  const [activeStressTest, setActiveStressTest] = useState<string | null>(null);

  const stressTests = [
    {
      id: 'market_crash',
      name: '30% Market Drop',
      icon: TrendingDown,
      description: 'Portfolio loses 30% in year 3 of retirement',
      normalSuccess: 85,
      stressSuccess: 62,
      color: 'red'
    },
    {
      id: 'healthcare',
      name: 'Long-Term Care Event',
      icon: AlertTriangle,
      description: '$75,000/year LTC costs starting at age 78',
      normalSuccess: 85,
      stressSuccess: 58,
      color: 'orange'
    },
    {
      id: 'inflation',
      name: 'High Inflation',
      icon: TrendingUp,
      description: '5% inflation for 10 years vs. 2.5% expected',
      normalSuccess: 85,
      stressSuccess: 71,
      color: 'yellow'
    },
    {
      id: 'longevity',
      name: 'Longevity Risk',
      icon: Shield,
      description: 'Both spouses live to age 95 instead of 85',
      normalSuccess: 85,
      stressSuccess: 67,
      color: 'blue'
    }
  ];

  const getColorClasses = (color: string) => ({
    red: 'text-red-500 bg-red-50 border-red-200',
    orange: 'text-orange-500 bg-orange-50 border-orange-200',
    yellow: 'text-yellow-500 bg-yellow-50 border-yellow-200',
    blue: 'text-blue-500 bg-blue-50 border-blue-200'
  }[color]);

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
            Stress Testing & Risk Management
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The <span className="text-primary">Stress-Test</span> Advantage
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our engine stress-tests every plan against the unexpected — market downturns, 
            healthcare costs, longevity risk, tax law changes — so clients know exactly 
            where they stand in good times and bad.
          </p>
        </motion.div>

        {/* Main Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Chart Area */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-center">Plan Success Probability</h3>
                
                {/* Animated Bar Chart */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Normal Conditions</span>
                    <Badge variant="default">85%</Badge>
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

                  <div className="flex justify-between items-center mt-6">
                    <span className="text-sm font-medium">With Stress Events</span>
                    <Badge variant="destructive">
                      {activeStressTest ? stressTests.find(t => t.id === activeStressTest)?.stressSuccess : 62}%
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-6">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${activeStressTest ? stressTests.find(t => t.id === activeStressTest)?.stressSuccess : 62}%` 
                      }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-6 rounded-full flex items-center justify-end pr-2"
                    >
                      <span className="text-white text-xs font-medium">
                        {activeStressTest ? stressTests.find(t => t.id === activeStressTest)?.stressSuccess : 62}%
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Select Stress Test</h3>
                {stressTests.map((test, index) => (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 ${
                        activeStressTest === test.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setActiveStressTest(activeStressTest === test.id ? null : test.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${getColorClasses(test.color)}`}>
                            <test.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{test.name}</div>
                            <div className="text-sm text-muted-foreground">{test.description}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-red-500">{test.stressSuccess}%</div>
                            <div className="text-xs text-muted-foreground">Success Rate</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Live Demo Controls */}
        {liveDemoMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mb-8"
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Live Demo Controls</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" onClick={() => setActiveStressTest('market_crash')}>
                    Run Market Crash
                  </Button>
                  <Button variant="outline" onClick={() => setActiveStressTest('healthcare')}>
                    Add LTC Event
                  </Button>
                  <Button variant="outline" onClick={() => setActiveStressTest('inflation')}>
                    Test High Inflation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

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
                "Our engine stress-tests every plan against the unexpected — market downturns, healthcare costs, 
                longevity risk, tax law changes — so clients know exactly where they stand in good times and bad. 
                This isn't just about being prepared; it's about giving your clients confidence that their plan 
                can weather any storm."
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
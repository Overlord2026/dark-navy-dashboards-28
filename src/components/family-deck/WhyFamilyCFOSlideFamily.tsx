import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Building2, Users, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface WhyFamilyCFOSlideFamilyProps {
  presentationMode?: boolean;
}

export const WhyFamilyCFOSlideFamily: React.FC<WhyFamilyCFOSlideFamilyProps> = ({
  presentationMode
}) => {
  const painPoints = [
    {
      stat: '78%',
      description: 'of retirees don\'t have a written financial plan',
      icon: TrendingDown,
      color: 'text-red-500'
    },
    {
      stat: '1 in 3',
      description: 'retirees outlive their savings',
      icon: AlertTriangle,
      color: 'text-orange-500'
    },
    {
      stat: '68%',
      description: 'of families lack coordination between advisors',
      icon: Users,
      color: 'text-yellow-600'
    }
  ];

  const complexityFactors = [
    'Tax law changes affecting retirement planning',
    'Healthcare costs rising faster than inflation',
    'Market volatility and sequence of returns risk',
    'Estate planning complexity with multiple states',
    'Multiple advisor relationships with no coordination',
    'Technology gaps leaving families in the dark'
  ];

  return (
    <div className="min-h-[600px] p-8 md:p-16 bg-gradient-to-br from-background to-red-50/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 text-red-600 border-red-200">
            The Reality Check
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Every Family <span className="text-blue-600">Needs a CFO</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Financial complexity has exploded, but most families are still using outdated approaches 
            that leave them vulnerable to gaps, risks, and missed opportunities.
          </p>
        </motion.div>

        {/* Pain Points Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {painPoints.map((point, index) => (
            <Card key={index} className="text-center border-red-100 bg-red-50/50">
              <CardContent className="p-6">
                <point.icon className={`h-12 w-12 mx-auto mb-4 ${point.color}`} />
                <div className={`text-4xl font-bold mb-2 ${point.color}`}>
                  {point.stat}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {point.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Corporate vs Family Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12"
        >
          {/* Corporate Side */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Building2 className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-2xl font-bold text-green-800">Fortune 500 Company</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <span className="text-sm">Dedicated CFO for financial strategy</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <span className="text-sm">Real-time financial dashboards</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <span className="text-sm">Scenario planning and stress testing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <span className="text-sm">Quarterly board reviews</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <span className="text-sm">Integrated risk management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <span className="text-sm">Professional team coordination</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-100 rounded-lg border border-green-200">
                <p className="text-sm italic text-green-800">
                  "No major company would operate without strategic financial oversight and coordination."
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Family Side */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Users className="h-8 w-8 text-red-600 mr-3" />
                <h3 className="text-2xl font-bold text-red-800">Typical Family</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                  <span className="text-sm text-muted-foreground">Fragmented advisor relationships</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                  <span className="text-sm text-muted-foreground">No unified financial picture</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                  <span className="text-sm text-muted-foreground">Limited scenario planning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                  <span className="text-sm text-muted-foreground">Annual advisor meetings only</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                  <span className="text-sm text-muted-foreground">Reactive rather than proactive</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                  <span className="text-sm text-muted-foreground">No coordination between specialists</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-red-100 rounded-lg border border-red-200">
                <p className="text-sm italic text-red-800">
                  "Most families are flying blind with their most important financial decisions."
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Complexity Factors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-6 text-blue-800">
                Today's Financial Complexity Requires Professional Oversight
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complexityFactors.map((factor, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                    <span className="text-sm">{factor}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Solution Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-blue-800">
                The Solution: Your Family's Dedicated CFO
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Just like Fortune 500 companies, your family deserves strategic financial oversight, 
                coordination, and planning — without the traditional 1% fee trap.
              </p>
              <Badge className="bg-blue-600 text-white px-6 py-2 text-base">
                Introducing the SWAG™ Retirement Roadmap
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
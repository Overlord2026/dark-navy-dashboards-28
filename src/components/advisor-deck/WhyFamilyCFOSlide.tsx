import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, TrendingDown, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface WhyFamilyCFOSlideProps {
  liveDemoMode?: boolean;
  whiteLabelEnabled?: boolean;
  presentationMode?: boolean;
}

export const WhyFamilyCFOSlide: React.FC<WhyFamilyCFOSlideProps> = ({
  liveDemoMode,
  whiteLabelEnabled,
  presentationMode
}) => {
  const stats = [
    { label: 'Families without financial plan', value: '68%', icon: TrendingDown, color: 'text-red-500' },
    { label: 'Retirement savings shortfall', value: '$4.1T', icon: AlertTriangle, color: 'text-orange-500' },
    { label: 'Americans confident in retirement', value: '22%', icon: Users, color: 'text-blue-500' },
  ];

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
            The Financial Planning Gap
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Every Major Company Has a CFO —{' '}
            <span className="text-primary">Why Not Every Family?</span>
          </h2>
        </motion.div>

        {/* Split Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Corporate CFO Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Building2 className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-2xl font-bold">Corporate CFO</h3>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Strategic financial planning</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Risk management & scenario modeling</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Cash flow optimization</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Regular board reporting</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Tax efficiency strategies</span>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm italic">
                    "Every Fortune 500 company relies on strategic financial oversight 
                    to ensure long-term sustainability and growth."
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Family Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="h-full border-orange-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Users className="h-8 w-8 text-orange-500 mr-3" />
                  <h3 className="text-2xl font-bold">Family Without CFO</h3>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="text-muted-foreground">Ad-hoc financial decisions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="text-muted-foreground">Limited scenario planning</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="text-muted-foreground">Fragmented investment approach</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="text-muted-foreground">Annual advisor meetings only</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="text-muted-foreground">Reactive tax planning</span>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-sm italic text-orange-800">
                    "Families deserve the same disciplined planning that Fortune 500 companies have."
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Statistics Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4">
                With SWAG™ GPS™, we deliver the same level of strategic oversight — 
                customized to each client's unique goals and life phases.
              </h3>
              <p className="text-muted-foreground">
                Companies wouldn't dream of operating without a financial strategy. 
                Families deserve the same disciplined approach.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
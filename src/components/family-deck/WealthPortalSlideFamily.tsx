import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  FileText, 
  Shield, 
  Users, 
  Smartphone, 
  Home,
  Heart,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';

interface WealthPortalSlideFamilyProps {
  presentationMode?: boolean;
}

export const WealthPortalSlideFamily: React.FC<WealthPortalSlideFamilyProps> = ({
  presentationMode
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const portalFeatures = [
    {
      id: 'overview',
      name: 'Family Overview',
      icon: Home,
      description: 'Complete financial picture for your entire family',
      highlights: [
        'All accounts and assets in one place',
        'Real-time net worth tracking',
        'Goal progress visualization',
        'Family member access controls'
      ]
    },
    {
      id: 'roadmap',
      name: 'Retirement Roadmap',
      icon: Target,
      description: 'Your personalized SWAG™ plan with progress tracking',
      highlights: [
        'Four-phase strategy visualization',
        'Monthly progress updates',
        'Stress-test results',
        'Adjustment recommendations'
      ]
    },
    {
      id: 'health',
      name: 'Health & Longevity',
      icon: Heart,
      description: 'Integrated health planning and healthcare cost forecasting',
      highlights: [
        'Healthcare cost projections',
        'Long-term care planning',
        'Health savings account optimization',
        'Longevity impact modeling'
      ]
    },
    {
      id: 'documents',
      name: 'Secure Vault',
      icon: Shield,
      description: 'All important documents safely stored and organized',
      highlights: [
        'Estate planning documents',
        'Insurance policies',
        'Tax returns and records',
        'Family sharing controls'
      ]
    }
  ];

  const familyBenefits = [
    'Share access with spouse and adult children',
    '24/7 access from any device',
    'Automatic account syncing',
    'Secure document sharing with professionals'
  ];

  return (
    <div className="min-h-[600px] p-8 md:p-16 bg-gradient-to-br from-blue-50 via-background to-green-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 bg-blue-100 text-blue-800">
            Your Family's Command Center
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Custom <span className="text-blue-600">Family Wealth Portal</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything your family needs to stay on track — retirement planning, health planning, 
            estate documents, and progress tracking — all in one secure, easy-to-use portal.
          </p>
        </motion.div>

        {/* Portal Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="overflow-hidden shadow-2xl">
            {/* Portal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">The Johnson Family Portal</h3>
                    <p className="text-blue-100">Welcome back, Sarah & Michael</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5 opacity-75" />
                  <span className="text-sm opacity-75">Mobile Ready</span>
                </div>
              </div>
            </div>

            {/* Portal Content */}
            <div className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
                  {portalFeatures.map((feature) => (
                    <TabsTrigger 
                      key={feature.id} 
                      value={feature.id}
                      className="flex items-center space-x-2 py-4"
                    >
                      <feature.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{feature.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {portalFeatures.map((feature) => (
                  <TabsContent key={feature.id} value={feature.id} className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Feature Description */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-2xl font-semibold mb-3">{feature.name}</h4>
                          <p className="text-muted-foreground text-lg">
                            {feature.description}
                          </p>
                        </div>

                        <div>
                          <h5 className="font-semibold mb-3 text-blue-800">Key Features:</h5>
                          <ul className="space-y-3">
                            {feature.highlights.map((highlight, index) => (
                              <li key={index} className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                <span className="text-sm">{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Explore {feature.name}
                        </Button>
                      </div>

                      {/* Mock Interface */}
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
                        <div className="text-center space-y-6">
                          <feature.icon className="h-20 w-20 mx-auto text-blue-500" />
                          
                          {/* Sample Data Visualization */}
                          {feature.id === 'overview' && (
                            <div className="space-y-4">
                              <div className="text-3xl font-bold text-blue-600">$2.4M</div>
                              <div className="text-sm text-muted-foreground">Total Family Net Worth</div>
                              <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                  <div className="text-lg font-semibold text-green-600">92%</div>
                                  <div className="text-xs text-muted-foreground">On Track</div>
                                </div>
                                <div>
                                  <div className="text-lg font-semibold text-blue-600">$127K</div>
                                  <div className="text-xs text-muted-foreground">Retirement Income</div>
                                </div>
                              </div>
                            </div>
                          )}

                          {feature.id !== 'overview' && (
                            <div className="space-y-2">
                              <div className="h-4 bg-blue-200 rounded w-3/4 mx-auto" />
                              <div className="h-4 bg-blue-200 rounded w-1/2 mx-auto" />
                              <div className="h-4 bg-blue-200 rounded w-2/3 mx-auto" />
                            </div>
                          )}
                          
                          <Badge variant="outline" className="mx-auto">
                            Interactive {feature.name}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </Card>
        </motion.div>

        {/* Family Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
        >
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-8">
              <Users className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4 text-green-800">Built for Families</h3>
              <ul className="space-y-3">
                {familyBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-8">
              <Shield className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Bank-Level Security</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span className="text-sm">256-bit encryption</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span className="text-sm">Multi-factor authentication</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span className="text-sm">SOC 2 compliant</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span className="text-sm">Regular security audits</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-blue-800">
                Your Family Deserves This Level of Organization
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                No more scattered accounts, lost documents, or wondering if you're on track. 
                Everything your family needs for financial success, all in one place.
              </p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Set Up Your Family Portal
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
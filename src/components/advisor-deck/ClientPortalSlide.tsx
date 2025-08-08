import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  FileText, 
  Shield, 
  Settings, 
  Smartphone, 
  Monitor,
  Clock,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ClientPortalSlideProps {
  liveDemoMode?: boolean;
  whiteLabelEnabled?: boolean;
  presentationMode?: boolean;
}

export const ClientPortalSlide: React.FC<ClientPortalSlideProps> = ({
  liveDemoMode,
  whiteLabelEnabled,
  presentationMode
}) => {
  const [activeTab, setActiveTab] = useState('plan');

  const portalFeatures = [
    {
      id: 'plan',
      name: 'My Plan',
      icon: BarChart3,
      description: 'Interactive retirement roadmap with SWAG™ phases',
      features: [
        'Real-time portfolio tracking',
        'Phase-based allocation view',
        'Progress towards retirement goals',
        'Income gap analysis'
      ]
    },
    {
      id: 'scenarios',
      name: 'Scenarios',
      icon: Settings,
      description: 'Run what-if scenarios and stress tests',
      features: [
        'Early retirement modeling',
        'Market downturn stress tests',
        'Healthcare cost scenarios',
        'Tax strategy comparisons'
      ]
    },
    {
      id: 'reports',
      name: 'Reports',
      icon: FileText,
      description: 'Professional reports and documentation',
      features: [
        'Quarterly plan updates',
        'Tax optimization reports',
        'Estate planning summaries',
        'Investment performance reviews'
      ]
    },
    {
      id: 'vault',
      name: 'Document Vault',
      icon: Shield,
      description: 'Secure document storage and sharing',
      features: [
        'Estate planning documents',
        'Tax returns and statements',
        'Insurance policies',
        'Secure family sharing'
      ]
    }
  ];

  const securityFeatures = [
    'Bank-level 256-bit encryption',
    'Multi-factor authentication',
    'SOC 2 Type II compliant',
    'Regular security audits'
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
            24/7 Client Access
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The <span className="text-primary">Client Portal</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your clients can log in 24/7 to see their personalized plan, run their own scenarios, 
            and store important documents — all in a secure, white-label capable environment.
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
            <div className="bg-gradient-to-r from-primary to-accent p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold">
                      {whiteLabelEnabled ? 'Your Firm Portal' : 'SWAG™ Client Portal'}
                    </div>
                    <div className="text-xs opacity-75">Welcome back, John Smith</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Monitor className="h-4 w-4" />
                  <Smartphone className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Portal Content */}
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
                  {portalFeatures.map((feature) => (
                    <TabsTrigger 
                      key={feature.id} 
                      value={feature.id}
                      className="flex items-center space-x-2"
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
                          <h3 className="text-2xl font-semibold mb-3">{feature.name}</h3>
                          <p className="text-muted-foreground">{feature.description}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Key Features:</h4>
                          <ul className="space-y-2">
                            {feature.features.map((item, index) => (
                              <li key={index} className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-primary rounded-full" />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {liveDemoMode && (
                          <Button className="w-full">
                            Experience {feature.name} Live
                          </Button>
                        )}
                      </div>

                      {/* Mock Interface */}
                      <div className="bg-muted/30 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <feature.icon className="h-16 w-16 mx-auto text-primary" />
                          <div className="space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                            <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
                            <div className="h-4 bg-muted rounded w-2/3 mx-auto" />
                          </div>
                          <Badge variant="outline" className="mx-auto">
                            Interactive {feature.name} View
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">24/7 Access</h3>
              <p className="text-sm text-muted-foreground">
                Clients can access their plan anytime, anywhere
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Bank-Level Security</h3>
              <p className="text-sm text-muted-foreground">
                Enterprise-grade security and compliance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Eye className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Full Transparency</h3>
              <p className="text-sm text-muted-foreground">
                Complete visibility into their financial future
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                Security & Compliance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

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
                "Your clients can log in 24/7 to see their personalized plan, run their own scenarios, 
                and store important documents — all in a secure, white-label capable environment. 
                This level of transparency and accessibility sets you apart from other advisors 
                and keeps your clients engaged with their financial future."
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
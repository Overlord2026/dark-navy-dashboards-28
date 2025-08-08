import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Infinity, 
  Calculator, 
  Building2, 
  Bot, 
  BarChart3, 
  Globe, 
  TrendingUp,
  Zap,
  Crown,
  Eye,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AccountantPremiumToolsStep: React.FC = () => {
  const [showMarketingDemo, setShowMarketingDemo] = useState(false);

  const premiumTools = [
    {
      icon: <Infinity className="w-6 h-6" />,
      name: 'Unlimited Clients & Vault Storage',
      description: 'Scale your practice without limits. Manage unlimited clients with enterprise-grade storage.',
      features: ['Unlimited clients', 'Unlimited storage', 'Advanced permissions'],
      category: 'scaling'
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      name: 'Advanced Tax Planning Suite',
      description: 'Multi-year Roth conversions, state residency planning, NUA/ESPP/RSU analysis, charitable giving optimizer.',
      features: ['Multi-year forecasts', 'State tax optimization', 'Advanced scenarios'],
      category: 'planning'
    },
    {
      icon: <Bot className="w-6 h-6" />,
      name: 'AI Filing Helper',
      description: 'Draft and validate filings in minutes with AI-powered automation and compliance checking.',
      features: ['Auto-draft filings', 'Compliance validation', 'Error detection'],
      category: 'ai'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      name: 'Lead-to-Sales Marketing Engine',
      description: 'Multi-channel campaigns, automated drip sequences, conversion analytics, and ROI tracking.',
      features: ['Email/SMS campaigns', 'Lead scoring', 'ROI analytics'],
      category: 'marketing',
      featured: true
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      name: 'Entity Ownership & Family Tree',
      description: 'Visualize complex entity relationships and ownership structures with interactive diagrams.',
      features: ['Visual entity trees', 'Ownership tracking', 'Relationship mapping'],
      category: 'entities'
    },
    {
      icon: <Bot className="w-6 h-6" />,
      name: 'AI Copilot (Linda)',
      description: 'Summarize meetings, prep reports, create action lists, and automate administrative tasks.',
      features: ['Meeting summaries', 'Report generation', 'Task automation'],
      category: 'ai'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      name: 'Advanced Analytics',
      description: 'Segment clients, track profitability, streamline workflows, and optimize practice performance.',
      features: ['Client segmentation', 'Profitability analysis', 'Workflow optimization'],
      category: 'analytics'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      name: 'Marketplace Publisher Access',
      description: 'Offer your services to the platform\'s network and connect with potential clients.',
      features: ['Service listings', 'Client matching', 'Referral network'],
      category: 'marketing'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white border-primary">
            <Crown className="w-4 h-4 mr-2" />
            Premium Tier
          </Badge>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">
          Supercharge Your Practice
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Unlock advanced features designed for serious practitioners who want to scale, 
          automate, and deliver premium experiences to high-value clients.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {premiumTools.map((tool, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className={`h-full hover:shadow-lg transition-all duration-300 ${
              tool.featured ? 'border-primary ring-2 ring-primary/20' : 'border-primary/20'
            }`}>
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    tool.featured ? 'bg-primary text-white' : 'bg-primary/10'
                  }`}>
                    <div className={tool.featured ? 'text-white' : 'text-primary'}>
                      {tool.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      {tool.featured && (
                        <Badge className="ml-2 bg-primary/20 text-primary border-primary/30">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{tool.description}</p>
                    
                    <div className="space-y-1 mb-4">
                      {tool.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="w-3 h-3 mr-2 text-primary" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {tool.featured && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMarketingDemo(true)}
                        className="border-primary text-primary hover:bg-primary hover:text-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        See Demo
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <Zap className="w-8 h-8 text-primary" />
        </div>
        
        <h3 className="text-xl font-semibold mb-3">
          Ready to Transform Your Practice?
        </h3>
        
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Join successful CPAs who've increased client satisfaction by 40% and practice 
          efficiency by 60% using our premium suite.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90">
            Start 30-Day Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button variant="outline" size="lg">
            Schedule Demo
          </Button>
        </div>
      </motion.div>

      {/* Marketing Engine Demo Modal */}
      <Dialog open={showMarketingDemo} onOpenChange={setShowMarketingDemo}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-primary" />
              Lead-to-Sales Marketing Engine Demo
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Campaign Workflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary font-semibold">1</span>
                      </div>
                      <span className="text-sm">Identify prospects</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary font-semibold">2</span>
                      </div>
                      <span className="text-sm">Automated email/SMS sequences</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary font-semibold">3</span>
                      </div>
                      <span className="text-sm">Track engagement & conversions</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ROI Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Campaigns Active</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Leads Generated</span>
                      <span className="font-semibold">147</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Conversion Rate</span>
                      <span className="font-semibold text-green-600">23%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">ROI</span>
                      <span className="font-semibold text-green-600">340%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-primary/5 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Sample Email Template Preview:</h4>
              <div className="bg-white border rounded p-4 text-sm">
                <div className="font-semibold mb-2">Subject: Your Tax Strategy Could Save You $15,000+</div>
                <div className="text-muted-foreground">
                  Hi [First Name], <br/><br/>
                  Are you maximizing your tax efficiency? Our recent analysis shows business owners 
                  like you could save an average of $15,000 annually with proper planning...<br/><br/>
                  <Button size="sm" className="mt-2">Schedule Free Consultation</Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
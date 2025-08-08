import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Infinity, 
  FileText, 
  Building2, 
  Bot, 
  BarChart3, 
  Globe, 
  TrendingUp,
  Calendar,
  Crown,
  CheckCircle,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AttorneyPremiumToolsStep: React.FC = () => {
  const premiumTools = [
    {
      icon: <Infinity className="w-6 h-6" />,
      name: 'Unlimited Clients & Vault Storage',
      description: 'Scale your practice without limits. Manage unlimited clients with enterprise-grade storage.',
      features: ['Unlimited clients', 'Unlimited storage', 'Advanced permissions']
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      name: 'CLE Tracking with State-Specific Rules',
      description: 'Automated continuing education tracking with state compliance rules and deadlines.',
      features: ['State-specific rules', 'Automated alerts', 'Compliance reporting']
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      name: 'Estate Planning Integration',
      description: 'Complete estate planning tools with trust management and beneficiary tracking.',
      features: ['Trust management', 'Estate documents', 'Beneficiary tracking']
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      name: 'Advanced Compliance Calendar',
      description: 'Comprehensive compliance tracking with automated deadlines and regulatory updates.',
      features: ['Automated deadlines', 'Regulatory updates', 'Audit trails']
    },
    {
      icon: <Bot className="w-6 h-6" />,
      name: 'AI Document Drafting Assistance',
      description: 'AI-powered document creation, review, and legal research assistance.',
      features: ['Document drafting', 'Legal research', 'Review assistance']
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      name: 'Lead-to-Sales Marketing Engine',
      description: 'Multi-channel campaigns, automated client acquisition, and conversion analytics.',
      features: ['Email/SMS campaigns', 'Lead scoring', 'ROI analytics'],
      featured: true
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      name: 'Advanced Analytics & Reports',
      description: 'Practice analytics, client profitability, and performance optimization tools.',
      features: ['Practice analytics', 'Profitability analysis', 'Performance tracking']
    },
    {
      icon: <Globe className="w-6 h-6" />,
      name: 'Marketplace Publisher Access',
      description: 'Offer your legal services to the platform\'s network and connect with potential clients.',
      features: ['Service listings', 'Client matching', 'Referral network']
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
          Supercharge Your Legal Practice
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Unlock advanced features designed for serious legal professionals who want to scale, 
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
                    
                    <div className="space-y-1">
                      {tool.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="w-3 h-3 mr-2 text-primary" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
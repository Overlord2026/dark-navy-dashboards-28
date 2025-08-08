import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Shield, 
  TrendingUp, 
  CreditCard, 
  Building2, 
  Calculator,
  Bot,
  Heart,
  Crown,
  Star,
  Eye,
  CheckCircle,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ClientFamilyPremiumFeaturesStep: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const premiumFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Advanced Secure Vault + Avatar',
      description: 'Record and deliver legacy messages.',
      details: {
        features: ['Unlimited storage', 'Video message recording', 'Legacy vault for heirs', 'Advanced encryption', 'Time-locked delivery'],
        benefits: 'Create lasting legacy messages and ensure important documents reach the right people at the right time.'
      },
      highlighted: true
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Retirement Roadmap Analyzer',
      description: 'Multi-year tax-efficient income planning.',
      details: {
        features: ['Monte Carlo projections', 'Tax optimization scenarios', 'Social Security analysis', 'Withdrawal strategies', 'Inflation modeling'],
        benefits: 'Plan your retirement with sophisticated modeling tools used by professional financial advisors.'
      }
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Automated Bill Pay',
      description: 'Vendor integration, autopay, reminders.',
      details: {
        features: ['Automatic payments', 'Vendor integration', 'Smart categorization', 'Fraud protection', 'Payment optimization'],
        benefits: 'Never miss a payment with intelligent automation that learns your patterns and optimizes timing.'
      }
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: 'Advanced Properties & Entity Mgmt',
      description: 'Link to LLCs, track compliance.',
      details: {
        features: ['Entity relationship mapping', 'Compliance tracking', 'Ownership visualization', 'Tax integration', 'Performance analytics'],
        benefits: 'Manage complex property and entity structures with professional-grade tools and compliance tracking.'
      }
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: 'Advanced Tax Planning Suite',
      description: 'Roth conversions, state residency optimization.',
      details: {
        features: ['Roth conversion analysis', 'State tax optimization', 'Charitable giving strategies', 'Estate tax planning', 'Multi-year scenarios'],
        benefits: 'Minimize your tax burden with advanced strategies typically available only to ultra-high-net-worth families.'
      },
      highlighted: true
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: 'Concierge AI Copilot',
      description: 'Personalized guidance.',
      details: {
        features: ['24/7 AI assistance', 'Personalized recommendations', 'Document analysis', 'Smart reminders', 'Goal tracking'],
        benefits: 'Get instant, personalized financial guidance powered by AI that understands your unique situation.'
      }
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Proactive Health Premium',
      description: 'Preventive screening tracker, provider integration.',
      details: {
        features: ['Health screening schedules', 'Provider network', 'Preventive care tracking', 'Health analytics', 'Family health history'],
        benefits: 'Take control of your family\'s health with proactive tracking and access to premium healthcare providers.'
      }
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white border-primary text-lg px-4 py-2">
            <Crown className="w-5 h-5 mr-2" />
            Premium Features
          </Badge>
        </div>
        
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">
          Unlock Professional-Grade Tools
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          Access the same advanced wealth management tools used by ultra-high-net-worth families 
          and their private family offices.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {premiumFeatures.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className={`h-full hover:shadow-xl transition-all duration-300 cursor-pointer group ${
              feature.highlighted 
                ? 'border-2 border-primary ring-2 ring-primary/20 bg-gradient-to-br from-primary/5 to-accent/5' 
                : 'border-primary/30 hover:border-primary/50'
            }`}
            onClick={() => setSelectedFeature(feature)}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    feature.highlighted 
                      ? 'bg-primary text-white group-hover:bg-primary/90' 
                      : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                  }`}>
                    {feature.icon}
                  </div>
                  
                  <div className="flex flex-col items-end space-y-1">
                    {feature.highlighted && (
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-4">
                  {feature.description}
                </p>
                
                <div className="flex items-center text-sm text-primary font-medium">
                  <Zap className="w-4 h-4 mr-2" />
                  Premium Feature
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Premium Value Proposition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-8 text-center"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold mb-4">
          The Tools Ultra-Wealthy Families Use
        </h3>
        
        <p className="text-muted-foreground max-w-3xl mx-auto mb-6 text-lg">
          Access sophisticated wealth management strategies, AI-powered insights, and professional-grade 
          tools previously available only to families with $100M+ in assets.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">$2.5M+</div>
            <p className="text-sm text-muted-foreground">Average tax savings for Premium users</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">15x</div>
            <p className="text-sm text-muted-foreground">ROI on Premium subscription</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">95%</div>
            <p className="text-sm text-muted-foreground">Client satisfaction rate</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary px-8">
            Start Premium Trial
            <Star className="w-5 h-5 ml-2" />
          </Button>
          
          <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
            Compare Plans
          </Button>
        </div>
      </motion.div>

      {/* Feature Detail Modal */}
      <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {selectedFeature?.icon && (
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                  selectedFeature.highlighted ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                }`}>
                  {selectedFeature.icon}
                </div>
              )}
              {selectedFeature?.title}
              {selectedFeature?.highlighted && (
                <Badge className="ml-2 bg-primary/20 text-primary border-primary/30">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedFeature && (
            <div className="space-y-6">
              <p className="text-muted-foreground">
                {selectedFeature.details.benefits}
              </p>
              
              <div>
                <h4 className="font-semibold mb-3">Premium Features Included:</h4>
                <div className="space-y-2">
                  {selectedFeature.details.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium Only
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  This advanced feature is available exclusively to Premium subscribers and includes 
                  dedicated support and regular feature updates.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
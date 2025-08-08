import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  TrendingUp, 
  Shield, 
  Building2, 
  CreditCard, 
  Target,
  GraduationCap,
  Globe,
  CheckCircle,
  Eye,
  Link
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ClientFamilyBasicFeaturesStep: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const basicFeatures = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Net Worth Dashboard',
      description: 'Manual entry + Plaid sync.',
      details: {
        features: ['Manual account entry', 'Plaid bank connections', 'Basic portfolio tracking', 'Net worth calculations'],
        benefits: 'See all your accounts and assets in one place with automatic updates from connected financial institutions.'
      }
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Basic Secure Family Vault',
      description: 'Document uploads & tagging.',
      details: {
        features: ['Document upload (5GB storage)', 'Basic tagging system', 'Secure sharing', 'Access controls'],
        benefits: 'Store important documents securely with the ability to organize and share with family members.'
      }
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: 'Properties Management (Basic)',
      description: 'Real estate list & details.',
      details: {
        features: ['Property listings', 'Basic details tracking', 'Photos and documents', 'Value estimates'],
        benefits: 'Keep track of all your real estate investments with basic property management tools.'
      }
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Bill Pay (Basic)',
      description: 'Manual bills, reminders.',
      details: {
        features: ['Manual bill entry', 'Due date reminders', 'Basic categorization', 'Payment tracking'],
        benefits: 'Never miss a payment with organized bill tracking and reminder notifications.'
      }
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Goals & Budgets',
      description: 'Track savings & spending.',
      details: {
        features: ['Savings goals', 'Budget categories', 'Progress tracking', 'Spending analysis'],
        benefits: 'Set financial goals and track your progress with comprehensive budgeting tools.'
      }
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: 'Education & Solutions Hub',
      description: 'Self-paced learning.',
      details: {
        features: ['Educational articles', 'Video tutorials', 'Self-paced courses', 'Resource library'],
        benefits: 'Expand your financial knowledge with curated educational content and resources.'
      }
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Marketplace Access',
      description: 'Find vetted professionals.',
      details: {
        features: ['Professional directory', 'Advisor profiles', 'Service categories', 'Contact information'],
        benefits: 'Connect with vetted financial advisors, tax professionals, and other service providers.'
      }
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Badge className="bg-green-100 text-green-700 border-green-200 text-lg px-4 py-2">
            <CheckCircle className="w-5 h-5 mr-2" />
            Free Features
          </Badge>
        </div>
        
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">
          Essential Tools to Get Started
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          Start managing your family's wealth with these comprehensive basic features. 
          Perfect for families beginning their wealth management journey.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {basicFeatures.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group border-green-200 hover:border-green-400"
                  onClick={() => setSelectedFeature(feature)}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <div className="text-green-600">
                      {feature.icon}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                
                <CardTitle className="text-lg group-hover:text-green-700 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-4">
                  {feature.description}
                </p>
                
                <div className="flex items-center text-sm text-green-600 font-medium">
                  <Link className="w-4 h-4 mr-2" />
                  Click to learn more
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Value Proposition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold mb-4 text-green-900">
          Everything You Need to Start
        </h3>
        
        <p className="text-green-700 max-w-3xl mx-auto mb-6 text-lg">
          These essential features provide a solid foundation for managing your family's wealth. 
          Get organized, stay on track, and build toward your financial goals — all completely free.
        </p>
        
        <div className="flex justify-center">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8">
            Start Using Basic Features
          </Button>
        </div>
      </motion.div>

      {/* Feature Detail Modal */}
      <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {selectedFeature?.icon && (
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <div className="text-green-600">
                    {selectedFeature.icon}
                  </div>
                </div>
              )}
              {selectedFeature?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedFeature && (
            <div className="space-y-6">
              <p className="text-muted-foreground">
                {selectedFeature.details.benefits}
              </p>
              
              <div>
                <h4 className="font-semibold mb-3">What's Included:</h4>
                <div className="space-y-2">
                  {selectedFeature.details.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Free Forever
                  </Badge>
                </div>
                <p className="text-sm text-green-700">
                  This feature is included in your free account with no time limits or restrictions.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
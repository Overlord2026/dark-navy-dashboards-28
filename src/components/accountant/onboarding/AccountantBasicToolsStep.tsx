import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GoldButton } from '@/components/ui/brandButtons';
import { 
  Users, 
  FileText, 
  Building2, 
  BookOpen, 
  Globe, 
  Mail,
  CheckCircle,
  Star 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AccountantBasicToolsStep: React.FC = () => {
  const basicTools = [
    {
      icon: <Users className="w-6 h-6" />,
      name: 'Client Dashboard & Vault Access',
      description: 'Secure document storage and sharing with basic client management features.',
      features: ['Up to 10 clients', 'Basic document storage', 'Secure sharing']
    },
    {
      icon: <FileText className="w-6 h-6" />,
      name: 'Basic Tax Planning Tools',
      description: 'Simple calculators and planning templates for standard tax scenarios.',
      features: ['Tax calculators', 'Basic templates', 'Standard reports']
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      name: 'Basic Entity Tracking',
      description: 'Manage up to 3 entities with filing reminders and basic compliance tracking.',
      features: ['3 entity limit', 'Filing reminders', 'Basic compliance']
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      name: 'Basic CE Tracking',
      description: 'Record and monitor continuing education hours with manual entry.',
      features: ['Manual CE entry', 'Basic tracking', 'Simple reports']
    },
    {
      icon: <Globe className="w-6 h-6" />,
      name: 'Marketplace Access',
      description: 'View vetted legal, financial, and business partners in your area.',
      features: ['Partner directory', 'Contact information', 'Basic profiles']
    },
    {
      icon: <Mail className="w-6 h-6" />,
      name: 'Basic Communications Suite',
      description: 'Email, chat, and file sharing for client communication.',
      features: ['Email integration', 'Basic chat', 'File sharing']
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="w-4 h-4 mr-2" />
            Free Tier
          </Badge>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">
          Start with Essential Tools
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Get started immediately with these core features. Perfect for small practices 
          or trying out the platform before upgrading.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {basicTools.map((tool, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-green-200">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <div className="text-green-600">
                      {tool.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{tool.name}</CardTitle>
                    <p className="text-muted-foreground text-sm mb-3">{tool.description}</p>
                    
                    <div className="space-y-1">
                      {tool.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <Star className="w-8 h-8 text-green-600" />
        </div>
        
        <h3 className="text-xl font-semibold mb-3 text-green-900">
          Perfect for Getting Started
        </h3>
        
        <p className="text-green-700 max-w-2xl mx-auto mb-6">
          These basic tools provide everything you need to begin modernizing your practice. 
          Test the platform, invite a few clients, and see the difference immediately.
        </p>
        
        <GoldButton>
          Start Free Account
        </GoldButton>
      </motion.div>
    </div>
  );
};
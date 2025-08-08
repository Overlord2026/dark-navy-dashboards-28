import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Shield, 
  Calculator, 
  TrendingUp, 
  FileText,
  CheckCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AccountantWelcomeStep: React.FC = () => {
  const benefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Centralized Client Management',
      description: 'Manage all clients, households, prospects, and tasks in one secure platform with automated workflows.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Automated Compliance & CE Tracking',
      description: 'Never miss a deadline with automated continuing education tracking, filing reminders, and audit-ready documentation.'
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: 'Advanced Tax Planning Tools',
      description: 'Multi-year tax forecasts, Roth conversion analysis, and charitable giving optimization for high-value clients.'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Lead-to-Sales Marketing Engine',
      description: 'Automated marketing campaigns, lead scoring, conversion analytics, and ROI tracking to grow your practice.'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Secure Client Collaboration',
      description: 'Encrypted document sharing, family vault access, and seamless collaboration tools for modern tax practices.'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mx-auto mb-6 flex items-center justify-center"
        >
          <Calculator className="w-10 h-10 text-white" />
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-4">
          Welcome to Your CPA Practice Suite
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Transform your accounting practice with next-generation tools that delight clients, 
          streamline compliance, and grow your business — all built on fiduciary principles.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <div className="text-primary">
                      {benefit.icon}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg mb-2">{benefit.title}</CardTitle>
                    <p className="text-muted-foreground">{benefit.description}</p>
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
        className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <CheckCircle className="w-4 h-4 mr-2" />
            Fiduciary Standard
          </Badge>
        </div>
        
        <h3 className="text-xl font-semibold mb-3">
          Built on Fiduciary Duty Principles™
        </h3>
        
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Every tool is designed to put your clients' interests first. No commissions, 
          no conflicts of interest — just clarity, transparency, and professional excellence.
        </p>
      </motion.div>
    </div>
  );
};
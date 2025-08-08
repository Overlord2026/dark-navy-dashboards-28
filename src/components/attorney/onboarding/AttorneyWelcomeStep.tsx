import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Scale, 
  Shield, 
  BookOpen, 
  Building2, 
  Mail,
  CheckCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AttorneyWelcomeStep: React.FC = () => {
  const benefits = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'CLE Tracking Automation',
      description: 'Automated continuing legal education tracking with state-specific rules and deadline alerts.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Document Vault & Sharing',
      description: 'Secure, encrypted storage for case files, contracts, and client documents with controlled access.'
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: 'Entity & Estate Integration',
      description: 'Manage client trusts, LLCs, and estate planning documents with relationship mapping.'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Client Collaboration Tools',
      description: 'Secure communication, document requests, and case status updates for modern legal practice.'
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: 'Lead-to-Sales Marketing Engine',
      description: 'Automated marketing campaigns and client acquisition tools designed for legal professionals.'
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
          <Scale className="w-10 h-10 text-white" />
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-4">
          Welcome to Your Legal Practice Suite
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Transform your legal practice with modern tools for case management, compliance, 
          and client growth — all built on professional standards.
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
            Professional Standard
          </Badge>
        </div>
        
        <h3 className="text-xl font-semibold mb-3">
          Built for Legal Excellence
        </h3>
        
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Every feature is designed to enhance your professional practice while maintaining 
          the highest standards of client confidentiality and regulatory compliance.
        </p>
      </motion.div>
    </div>
  );
};
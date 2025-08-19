import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, FileCheck, Eye } from 'lucide-react';

const SecurityIndexPage: React.FC = () => {
  const securityTopics = [
    {
      title: 'Data Protection',
      description: 'How we protect your personal and financial information',
      icon: Shield,
      details: 'Bank-grade encryption, secure data centers, and strict access controls protect your sensitive information.'
    },
    {
      title: 'Privacy Policy',
      description: 'Our commitment to your privacy and data rights',
      icon: Eye,
      details: 'Transparent policies on data collection, usage, and sharing with clear opt-out options.'
    },
    {
      title: 'Compliance Standards',
      description: 'Regulatory compliance and industry certifications',
      icon: FileCheck,
      details: 'SOC 2 Type II certified, GDPR compliant, and adhering to financial industry regulations.'
    },
    {
      title: 'Account Security',
      description: 'Best practices for keeping your account secure',
      icon: Lock,
      details: 'Multi-factor authentication, strong password requirements, and regular security monitoring.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Security & Compliance
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Learn about our security measures, compliance standards, and how we protect your financial data.
              </p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {securityTopics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <Card key={topic.title} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-accent/10">
                          <Icon className="h-6 w-6 text-accent" />
                        </div>
                        <CardTitle className="text-xl">{topic.title}</CardTitle>
                      </div>
                      <CardDescription className="text-muted-foreground">
                        {topic.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {topic.details}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-12 p-6 bg-muted/50 rounded-lg">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Security Commitment</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your security is our top priority. We employ industry-leading security measures and continuously 
                monitor for threats. Our team of security experts ensures that your financial data remains protected 
                at all times. If you have any security concerns or questions, please contact our support team immediately.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SecurityIndexPage;
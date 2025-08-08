import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2,
  FileCheck,
  TrendingUp,
  Vault,
  Bot,
  ArrowRight
} from 'lucide-react';

interface EliteToolsStepProps {
  onNext: () => void;
}

export const EliteToolsStep: React.FC<EliteToolsStepProps> = ({ onNext }) => {
  const toolCategories = [
    {
      icon: Building2,
      title: 'Client & Entity Management',
      description: 'Comprehensive oversight of family structures, entities, and relationships',
      features: ['Multi-family dashboards', 'Entity relationship mapping', 'Ownership tracking']
    },
    {
      icon: FileCheck,
      title: 'Compliance & Reporting',
      description: 'Automated deadlines and regulatory requirements management',
      features: ['Filing calendar automation', 'State-specific alerts', 'Compliance scoring']
    },
    {
      icon: TrendingUp,
      title: 'Investment Oversight',
      description: 'Portfolio monitoring and performance tracking across all clients',
      features: ['Consolidated reporting', 'Performance analytics', 'Risk assessment']
    },
    {
      icon: Vault,
      title: 'Secure Document Vault',
      description: 'Enterprise-grade security for sensitive financial documents',
      features: ['Encrypted storage', 'Access controls', 'Audit trails']
    },
    {
      icon: Bot,
      title: 'AI Concierge',
      description: 'Intelligent task automation and coordination assistant',
      features: ['Meeting coordination', 'Automated reminders', 'Report generation']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Tool Categories</h1>
        <p className="text-lg text-muted-foreground">
          Explore the comprehensive suite of tools designed for elite family office management
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {toolCategories.map((category, index) => (
          <Card key={index} className="border-2 hover:border-primary/20 transition-colors h-full">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                <category.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">{category.title}</CardTitle>
              <CardDescription className="text-sm">{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {category.features.map((feature, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs mr-2 mb-2">
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold mb-3">Premium Integration Features</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Cross-platform data synchronization
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              White-label customization
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Advanced analytics and reporting
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
              24/7 priority support
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
              Custom integrations available
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
              Dedicated account management
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button 
          onClick={onNext}
          size="lg"
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
        >
          View Pricing Options
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
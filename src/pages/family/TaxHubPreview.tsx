import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { recordReceipt } from '@/features/receipts/record';
import { analytics } from '@/lib/analytics';
import { TrendingUp, Calculator, FileText, Shield } from 'lucide-react';

export default function TaxHubPreview() {
  const { toast } = useToast();

  const handleFeatureDemo = (feature: string) => {
    // Record receipt
    recordReceipt({
      id: `taxhub_${Date.now()}`,
      type: 'Decision-RDS',
      policy_version: 'E-2025.08',
      inputs_hash: 'sha256:taxhub_preview',
      result: 'approve',
      reasons: [`TAXHUB_${feature.toUpperCase()}_DEMO`],
      created_at: new Date().toISOString()
    });

    analytics.trackEvent('family.tool.demo', { 
      tool: 'taxhub-preview',
      feature
    });

    toast(
      <div className="space-y-2">
        <p><strong>{feature} Demo</strong> - TaxHub feature demonstration completed</p>
        <Badge variant="outline" className="text-xs">
          Saved to Proof Slips
        </Badge>
      </div>
    );
  };

  const features = [
    {
      icon: Calculator,
      title: 'Tax Calculator',
      description: 'Advanced tax estimation and planning tools',
      action: () => handleFeatureDemo('calculator')
    },
    {
      icon: TrendingUp,
      title: 'Tax Optimization',
      description: 'Strategies to minimize your tax burden',
      action: () => handleFeatureDemo('optimization')
    },
    {
      icon: FileText,
      title: 'Document Vault',
      description: 'Secure storage for tax documents',
      action: () => handleFeatureDemo('vault')
    },
    {
      icon: Shield,
      title: 'Compliance Check',
      description: 'Ensure you meet all tax requirements',
      action: () => handleFeatureDemo('compliance')
    }
  ];

  return (
    <>
      <Helmet>
        <title>TaxHub Preview | Comprehensive Tax Planning Tools</title>
        <meta name="description" content="Preview advanced tax planning and optimization tools" />
      </Helmet>
      
      <ToolHeader title="TaxHub Preview" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">TaxHub Preview</h1>
            <p className="text-muted-foreground text-lg">
              Comprehensive tax planning and optimization platform
            </p>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{feature.description}</p>
                  <Button onClick={feature.action} variant="outline" className="w-full">
                    Preview Feature
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
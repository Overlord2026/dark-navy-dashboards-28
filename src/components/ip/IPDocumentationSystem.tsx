import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Calendar, Shield, Lightbulb, Code2 } from 'lucide-react';

interface IPFeature {
  id: string;
  name: string;
  category: 'workflow' | 'ui' | 'algorithm' | 'integration';
  dateFirstUse: string;
  inventors: string[];
  description: string;
  technicalDetails: string;
  noveltyFactor: string;
  patentStatus: 'pending' | 'filed' | 'granted' | 'ready';
}

export function IPDocumentationSystem() {
  const [features] = useState<IPFeature[]>([
    {
      id: 'family-vault',
      name: 'Family Legacy Vault™',
      category: 'workflow',
      dateFirstUse: '2024-01-15',
      inventors: ['Tony Gomes', 'Pedro [CTO]'],
      description: 'Multi-generational secure digital vault with encrypted audio/video messaging, automated inheritance triggers, and role-based access control.',
      technicalDetails: 'Combines AES-256 encryption, time-delayed message delivery, biometric access controls, and blockchain-verified inheritance chains.',
      noveltyFactor: 'First platform to integrate secure multi-generational messaging with automated inheritance triggers and family role hierarchy management.',
      patentStatus: 'ready'
    },
    {
      id: 'swag-lead-score',
      name: 'SWAG Lead Score™',
      category: 'algorithm',
      dateFirstUse: '2024-02-01',
      inventors: ['Tony Gomes', 'AI Development Team'],
      description: 'Proprietary AI-powered HNW prospect scoring using integrated Plaid, Catchlight, and custom BFO wealth indicators.',
      technicalDetails: 'Machine learning algorithm analyzing 200+ financial, behavioral, and demographic factors with real-time API integration.',
      noveltyFactor: 'First wealth-tech platform to combine real-time bank data, social signals, and behavioral patterns for HNW prospect identification.',
      patentStatus: 'ready'
    },
    {
      id: 'integrated-onboarding',
      name: 'Persona-Adaptive Onboarding Workflow',
      category: 'workflow',
      dateFirstUse: '2024-01-20',
      inventors: ['Tony Gomes', 'UX Team'],
      description: 'Dynamic persona detection and routing system with automated document gathering, e-signature workflows, and tier-gated access.',
      technicalDetails: 'Real-time persona classification, automated document routing, integrated e-signature APIs, and compliance validation.',
      noveltyFactor: 'First platform to automatically adapt onboarding workflows based on detected user persona and regulatory requirements.',
      patentStatus: 'pending'
    },
    {
      id: 'linda-ai-assistant',
      name: 'Linda Voice AI Meeting Assistant',
      category: 'integration',
      dateFirstUse: '2024-03-01',
      inventors: ['Tony Gomes', 'AI Team'],
      description: 'VOIP/SMS AI assistant for automated meeting confirmations, rescheduling, and follow-up with firm branding.',
      technicalDetails: 'Integration of VAPI/VOIP technology with custom NLP, calendar APIs, and branded communication workflows.',
      noveltyFactor: 'First financial services AI assistant to handle complete meeting lifecycle with voice and SMS capabilities.',
      patentStatus: 'ready'
    },
    {
      id: 'compliance-automation',
      name: 'Real-time Multi-Role Compliance Management',
      category: 'workflow',
      dateFirstUse: '2024-01-10',
      inventors: ['Tony Gomes', 'Compliance Team'],
      description: 'Automated compliance monitoring with state/jurisdictional triggers and AI-powered audit preparation.',
      technicalDetails: 'Real-time regulatory database integration, automated audit trail generation, and role-based compliance workflows.',
      noveltyFactor: 'First platform to provide real-time, multi-jurisdictional compliance monitoring for diverse financial service roles.',
      patentStatus: 'pending'
    },
    {
      id: 'marketplace-workflow',
      name: 'Advisor/Family Marketplace Engine',
      category: 'workflow',
      dateFirstUse: '2024-02-15',
      inventors: ['Tony Gomes', 'Marketplace Team'],
      description: 'Rules engine for matching, screening, and rating professionals within a controlled family office marketplace.',
      technicalDetails: 'AI-powered matching algorithm, reputation scoring, automated vetting workflows, and secure communication channels.',
      noveltyFactor: 'First integrated marketplace specifically designed for family office professional services with automated vetting.',
      patentStatus: 'ready'
    }
  ]);

  const exportDocumentation = () => {
    const docData = {
      exportDate: new Date().toISOString(),
      features: features,
      metadata: {
        company: 'BFO Family Office',
        platform: 'Integrated Family Office Marketplace',
        totalFeatures: features.length,
        patentReadyFeatures: features.filter(f => f.patentStatus === 'ready').length
      }
    };

    const blob = new Blob([JSON.stringify(docData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BFO-IP-Documentation-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'workflow': return <FileText className="h-4 w-4" />;
      case 'algorithm': return <Code2 className="h-4 w-4" />;
      case 'integration': return <Lightbulb className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'filed': return 'bg-blue-100 text-blue-700';
      case 'granted': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gold via-primary to-emerald bg-clip-text text-transparent">
            IP Documentation System
          </h2>
          <p className="text-muted-foreground">
            Comprehensive intellectual property documentation and patent preparation
          </p>
        </div>
        <Button onClick={exportDocumentation} className="btn-primary-gold gap-2">
          <Download className="h-4 w-4" />
          Export Documentation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Features</p>
                <p className="text-2xl font-bold">{features.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Patent Ready</p>
                <p className="text-2xl font-bold text-green-600">
                  {features.filter(f => f.patentStatus === 'ready').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {features.filter(f => f.patentStatus === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Algorithms</p>
                <p className="text-2xl font-bold text-blue-600">
                  {features.filter(f => f.category === 'algorithm').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4">
            {features.map((feature) => (
              <Card key={feature.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(feature.category)}
                      <CardTitle className="text-lg">{feature.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`capitalize ${getStatusColor(feature.patentStatus)}`}>
                        {feature.patentStatus}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {feature.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground">Description</h4>
                    <p>{feature.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground">Novelty Factor</h4>
                    <p className="text-sm">{feature.noveltyFactor}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">First Use:</span> {feature.dateFirstUse}
                    </div>
                    <div>
                      <span className="font-semibold">Inventors:</span> {feature.inventors.join(', ')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflows">
          <div className="grid gap-4">
            {features.filter(f => f.category === 'workflow').map((feature) => (
              <Card key={feature.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {feature.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p>{feature.description}</p>
                    <div className="bg-muted p-3 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">Technical Implementation</h4>
                      <p className="text-sm">{feature.technicalDetails}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="algorithms">
          <div className="grid gap-4">
            {features.filter(f => f.category === 'algorithm').map((feature) => (
              <Card key={feature.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5" />
                    {feature.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p>{feature.description}</p>
                    <div className="bg-muted p-3 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">Algorithm Details</h4>
                      <p className="text-sm">{feature.technicalDetails}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="grid gap-4">
            {features.filter(f => f.category === 'integration').map((feature) => (
              <Card key={feature.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    {feature.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p>{feature.description}</p>
                    <div className="bg-muted p-3 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">Integration Architecture</h4>
                      <p className="text-sm">{feature.technicalDetails}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
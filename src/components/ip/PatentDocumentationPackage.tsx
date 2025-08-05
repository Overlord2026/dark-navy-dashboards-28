import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileDown, Package, CheckCircle, Clock, FileText, Folder } from 'lucide-react';
import { PatentPendingBanner } from './PatentPendingBanner';

export const PatentDocumentationPackage = () => {
  const [packageStatus, setPackageStatus] = useState<'ready' | 'generating' | 'complete'>('ready');

  const deliverables = [
    {
      id: 'wireframes',
      title: 'UI/UX Wireframes',
      description: 'Complete wireframe exports for all personas and workflows',
      status: 'ready',
      files: ['svg', 'png', 'pdf', 'figma'],
      patentClaims: 7
    },
    {
      id: 'technical-specs',
      title: 'Technical Specifications',
      description: 'Architecture diagrams and system specifications',
      status: 'ready',
      files: ['mermaid', 'pdf', 'svg'],
      patentClaims: 6
    },
    {
      id: 'patent-claims',
      title: 'Patent Claim Drafts',
      description: 'Detailed patent claims for each innovation',
      status: 'ready',
      files: ['pdf', 'docx', 'txt'],
      patentClaims: 13
    },
    {
      id: 'ip-logs',
      title: 'IP Invention Logs',
      description: 'Complete invention timeline and documentation',
      status: 'ready',
      files: ['csv', 'json', 'pdf'],
      patentClaims: 0
    },
    {
      id: 'legal-templates',
      title: 'Legal Templates',
      description: 'NDAs, onboarding materials, compliance documents',
      status: 'ready',
      files: ['pdf', 'docx'],
      patentClaims: 0
    },
    {
      id: 'patent-assets',
      title: 'Patent Pending Assets',
      description: 'Branded badges, logos, and marketing materials',
      status: 'ready',
      files: ['svg', 'png', 'eps'],
      patentClaims: 0
    }
  ];

  const patentMapping = [
    { claim: 'Multi-Persona Authentication System', wireframe: 'Authentication Flow', specs: 'Permission Engine' },
    { claim: 'Role-Based Dashboard Orchestration', wireframe: 'Dashboard Views', specs: 'Module Provider' },
    { claim: 'Secure Document Workflow System', wireframe: 'Document Sharing', specs: 'Security Architecture' },
    { claim: 'VIP Onboarding with LinkedIn Integration', wireframe: 'Onboarding Flow', specs: 'VIP System' },
    { claim: 'AI-Powered Workflow Optimization', wireframe: 'AI Routing', specs: 'AI Engine' },
    { claim: 'Automated Compliance Management', wireframe: 'Compliance Dashboard', specs: 'Compliance Engine' },
    { claim: 'Multi-Channel Notification System', wireframe: 'Notification Views', specs: 'Notification Architecture' },
    { claim: 'SWAG Lead Scoring Algorithm', wireframe: 'Lead Scoring UI', specs: 'Scoring Engine' },
    { claim: 'Family Legacy Vault Technology', wireframe: 'Vault Interface', specs: 'Storage System' },
    { claim: 'Voice AI Assistant Integration', wireframe: 'Linda AI Interface', specs: 'AI Integration' },
    { claim: 'Real-Time Audit Logging System', wireframe: 'Audit Dashboard', specs: 'Audit Architecture' },
    { claim: 'State-Specific Compliance Engine', wireframe: 'Compliance Workflows', specs: 'Rule Processor' },
    { claim: 'Integrated API Orchestration Gateway', wireframe: 'API Management', specs: 'API Architecture' }
  ];

  const generateCompletePackage = () => {
    setPackageStatus('generating');
    
    // Simulate package generation
    setTimeout(() => {
      const packageData = {
        metadata: {
          projectName: 'Family Office Multi-Persona Collaboration Platform',
          packageVersion: '1.0.0',
          generatedDate: new Date().toISOString(),
          totalPatentClaims: patentMapping.length,
          totalDeliverables: deliverables.length,
          legalStatus: 'Patent Pending',
          confidentialityLevel: 'Attorney-Client Privileged'
        },
        deliverables: deliverables,
        patentMapping: patentMapping,
        legalInstructions: {
          nextSteps: [
            'Review all patent claims for novelty and non-obviousness',
            'Conduct prior art search for each innovation',
            'File provisional patent applications for core technologies',
            'Implement patent pending notices in all marketing materials',
            'Set up IP monitoring and competitive intelligence',
            'Schedule quarterly IP review meetings'
          ],
          urgentActions: [
            'File provisional patents within 30 days',
            'Update website with patent pending notices',
            'Brief all employees on IP confidentiality requirements',
            'Establish inventor recognition program'
          ]
        },
        exportInstructions: {
          figmaAccess: 'Request Figma share links from design team',
          technicalReview: 'Schedule CTO review of all architecture diagrams',
          legalReview: 'Patent attorney to validate all claims before filing',
          marketingUpdate: 'Update all marketing materials with patent pending language'
        }
      };

      // Create download
      const blob = new Blob([JSON.stringify(packageData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patent-documentation-package-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setPackageStatus('complete');
    }, 3000);
  };

  const downloadIndividualDeliverable = (deliverable: any) => {
    const data = {
      deliverable: deliverable,
      timestamp: new Date().toISOString(),
      patentStatus: 'Patent Pending'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deliverable.id}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PatentPendingBanner feature="Documentation Package" />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            Patent Documentation Package
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">13 Patent Claims</Badge>
            <Badge variant="outline">6 Deliverable Categories</Badge>
            <Badge variant="default">Legal Ready</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
              <TabsTrigger value="mapping">Patent Mapping</TabsTrigger>
              <TabsTrigger value="export">Export Package</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">13</div>
                    <div className="text-sm text-muted-foreground">Patent Claims</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Folder className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">6</div>
                    <div className="text-sm text-muted-foreground">Deliverable Categories</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Package className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">25+</div>
                    <div className="text-sm text-muted-foreground">Export Formats</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Package Contents Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <strong>Core Innovations:</strong> Multi-persona platform orchestration, AI workflow optimization, secure document vault, VIP onboarding automation
                  </div>
                  <div className="text-sm">
                    <strong>Technical Components:</strong> Role-based permission engine, compliance automation, real-time audit logging, integrated API gateway
                  </div>
                  <div className="text-sm">
                    <strong>UI/UX Innovations:</strong> Dynamic dashboard provisioning, persona-specific workflows, voice AI integration, automated notifications
                  </div>
                  <div className="text-sm">
                    <strong>Legal Readiness:</strong> Complete patent claims, invention logs, NDA templates, onboarding compliance materials
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deliverables" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {deliverables.map(deliverable => (
                  <Card key={deliverable.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{deliverable.title}</h4>
                            {deliverable.status === 'ready' && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {deliverable.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="text-xs text-muted-foreground">
                              Formats: {deliverable.files.join(', ').toUpperCase()}
                            </div>
                            {deliverable.patentClaims > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {deliverable.patentClaims} Claims
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => downloadIndividualDeliverable(deliverable)}
                        >
                          <FileDown className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mapping" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Patent Claim to Deliverable Mapping</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Cross-reference guide for patent attorney review
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {patentMapping.map((mapping, index) => (
                      <div key={index} className="border border-border rounded-lg p-3">
                        <div className="font-semibold text-sm mb-2">{mapping.claim}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div>
                            <strong>Wireframe:</strong> {mapping.wireframe}
                          </div>
                          <div>
                            <strong>Technical Spec:</strong> {mapping.specs}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Package Export</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Generate complete documentation package for legal handoff
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {packageStatus === 'ready' && (
                    <Button onClick={generateCompletePackage} className="w-full" size="lg">
                      <Package className="h-5 w-5 mr-2" />
                      Generate Complete Patent Documentation Package
                    </Button>
                  )}

                  {packageStatus === 'generating' && (
                    <div className="text-center p-8">
                      <Clock className="h-8 w-8 mx-auto mb-4 text-blue-500 animate-spin" />
                      <div className="text-lg font-semibold mb-2">Generating Package...</div>
                      <p className="text-sm text-muted-foreground">
                        Compiling all deliverables, patent claims, and legal instructions
                      </p>
                    </div>
                  )}

                  {packageStatus === 'complete' && (
                    <div className="text-center p-8 border-2 border-green-200 rounded-lg bg-green-50">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <div className="text-xl font-bold mb-2 text-green-800">Package Complete!</div>
                      <p className="text-sm text-green-700 mb-4">
                        All patent documentation has been compiled and downloaded
                      </p>
                      <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
                        Ready for Legal Review
                      </Badge>
                    </div>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Next Steps for Legal Team</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm">
                        <strong>1. Patent Attorney Review:</strong> Validate all 13 patent claims for novelty
                      </div>
                      <div className="text-sm">
                        <strong>2. Prior Art Search:</strong> Conduct comprehensive prior art analysis
                      </div>
                      <div className="text-sm">
                        <strong>3. Provisional Filing:</strong> File provisional patents within 30 days
                      </div>
                      <div className="text-sm">
                        <strong>4. Marketing Update:</strong> Implement patent pending notices
                      </div>
                      <div className="text-sm">
                        <strong>5. IP Monitoring:</strong> Set up competitive intelligence tracking
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
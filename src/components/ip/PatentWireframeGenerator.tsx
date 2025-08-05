import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileDown, Users, Shield, Brain, Settings, FileText, Camera } from 'lucide-react';
import { PatentPendingBanner } from './PatentPendingBanner';

export const PatentWireframeGenerator = () => {
  const [selectedPersona, setSelectedPersona] = useState<string>('client');
  const [exportFormat, setExportFormat] = useState<string>('svg');

  const personas = [
    { id: 'client', name: 'Family Office Client', icon: Users, color: 'bg-blue-500' },
    { id: 'advisor', name: 'Financial Advisor', icon: Brain, color: 'bg-green-500' },
    { id: 'accountant', name: 'CPA/Accountant', icon: FileText, color: 'bg-purple-500' },
    { id: 'attorney', name: 'Estate Attorney', icon: Shield, color: 'bg-red-500' },
    { id: 'insurance', name: 'Insurance Agent', icon: Shield, color: 'bg-orange-500' },
    { id: 'imo', name: 'IMO/FMO', icon: Settings, color: 'bg-yellow-500' },
    { id: 'coach', name: 'Financial Coach', icon: Users, color: 'bg-pink-500' },
    { id: 'consultant', name: 'Consultant', icon: Brain, color: 'bg-indigo-500' },
    { id: 'compliance', name: 'Compliance Officer', icon: Shield, color: 'bg-gray-500' }
  ];

  const wireframes = {
    authentication: {
      title: 'Multi-Persona Authentication Flow',
      description: 'Role-based login with LinkedIn integration and VIP pre-creation',
      patentClaim: 'Novel multi-persona authentication system with role-based dashboard routing'
    },
    dashboard: {
      title: 'Persona-Specific Dashboard Orchestration',
      description: 'Dynamic module provisioning based on user role and permissions',
      patentClaim: 'Automated role-based feature provisioning and dashboard customization'
    },
    communication: {
      title: 'Secure Inter-Persona Communication Workflow',
      description: 'Document sharing, e-signature, and audit trail across personas',
      patentClaim: 'Secure multi-party document workflow with automated compliance tracking'
    },
    onboarding: {
      title: 'VIP Reserved Profile Onboarding',
      description: '1-click LinkedIn import with admin pre-creation workflow',
      patentClaim: 'Automated VIP onboarding with social profile integration'
    },
    compliance: {
      title: 'Automated Compliance Management Engine',
      description: 'State-specific rules, alerts, and audit logs per persona',
      patentClaim: 'AI-powered compliance automation with persona-specific rule engines'
    },
    ai_workflow: {
      title: 'AI-Powered Workflow Orchestration',
      description: 'Smart routing, SWAG scoring, and automated recommendations',
      patentClaim: 'Machine learning workflow optimization for financial services'
    },
    notification: {
      title: 'Integrated Multi-Channel Notification System',
      description: 'Voice/SMS/email with audit overlay and patent badges',
      patentClaim: 'Unified notification system with compliance audit integration'
    }
  };

  const generateWireframe = (wireframeKey: string) => {
    const wireframe = wireframes[wireframeKey as keyof typeof wireframes];
    
    // In a real implementation, this would generate actual wireframes
    // For now, we'll create a structured representation
    return {
      svg: `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="400" y="50" text-anchor="middle" font-size="24" font-weight="bold">${wireframe.title}</text>
        <text x="400" y="80" text-anchor="middle" font-size="14" fill="#666">${wireframe.description}</text>
        <rect x="50" y="100" width="700" height="400" fill="white" stroke="#e2e8f0" rx="8"/>
        <text x="400" y="550" text-anchor="middle" font-size="12" fill="#888">Patent Claim: ${wireframe.patentClaim}</text>
        <rect x="650" y="20" width="120" height="30" fill="#f59e0b" rx="4"/>
        <text x="710" y="40" text-anchor="middle" font-size="12" fill="white">Patent Pending</text>
      </svg>`,
      metadata: {
        title: wireframe.title,
        description: wireframe.description,
        patentClaim: wireframe.patentClaim,
        persona: selectedPersona,
        exportFormat: exportFormat,
        timestamp: new Date().toISOString()
      }
    };
  };

  const exportWireframes = () => {
    const allWireframes = Object.keys(wireframes).map(key => generateWireframe(key));
    
    // Create export package
    const exportData = {
      metadata: {
        projectName: 'Family Office Multi-Persona Platform',
        exportDate: new Date().toISOString(),
        selectedPersona: selectedPersona,
        format: exportFormat,
        totalWireframes: allWireframes.length
      },
      wireframes: allWireframes,
      patentMapping: Object.entries(wireframes).map(([key, value]) => ({
        wireframeId: key,
        title: value.title,
        patentClaim: value.patentClaim
      }))
    };

    // Download as JSON (in real implementation, would generate actual files)
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patent-wireframes-${selectedPersona}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAllFormats = () => {
    const formats = ['svg', 'png', 'pdf', 'figma'];
    formats.forEach(format => {
      setExportFormat(format);
      setTimeout(() => exportWireframes(), 100 * formats.indexOf(format));
    });
  };

  return (
    <div className="space-y-6">
      <PatentPendingBanner feature="Wireframe Generator" />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Persona Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Select Persona
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {personas.map(persona => {
              const Icon = persona.icon;
              return (
                <Button
                  key={persona.id}
                  variant={selectedPersona === persona.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedPersona(persona.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="text-sm">{persona.name}</span>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Wireframe Generation */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Patent-Ready Platform Wireframes</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Persona: {personas.find(p => p.id === selectedPersona)?.name}</Badge>
              <Badge variant="outline">Format: {exportFormat.toUpperCase()}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="workflows" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="workflows">Workflows</TabsTrigger>
                <TabsTrigger value="architecture">Architecture</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>

              <TabsContent value="workflows" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(wireframes).slice(0, 4).map(([key, wireframe]) => (
                    <Card key={key} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm">{wireframe.title}</h4>
                          <Camera className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{wireframe.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {wireframe.patentClaim.substring(0, 40)}...
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="architecture" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Role-Based Permission Engine</h4>
                      <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-xs text-muted-foreground">
{`┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Authentication │───▶│  Role Detection  │───▶│ Module Provider │
│     Service      │    │     Engine       │    │    Service      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  VIP Onboarding │    │ Compliance Rules │    │  AI Workflow    │
│     System      │    │     Engine       │    │   Orchestrator  │
└─────────────────┘    └─────────────────┘    └─────────────────┘`}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Data Security & Audit Architecture</h4>
                      <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-xs text-muted-foreground">
{`┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Document Vault │───▶│  Audit Logger   │───▶│ Compliance Check│
│   (Encrypted)   │    │    Service      │    │     Engine      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Access Control │    │ State-Specific  │    │   Notification  │
│     Matrix      │    │ Rule Processor  │    │    Gateway      │
└─────────────────┘    └─────────────────┘    └─────────────────┘`}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="export" className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['svg', 'png', 'pdf', 'figma'].map(format => (
                      <Button
                        key={format}
                        variant={exportFormat === format ? "default" : "outline"}
                        size="sm"
                        onClick={() => setExportFormat(format)}
                        className="uppercase"
                      >
                        {format}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Button onClick={exportWireframes} className="w-full">
                      <FileDown className="h-4 w-4 mr-2" />
                      Export {exportFormat.toUpperCase()} Wireframes
                    </Button>
                    
                    <Button onClick={exportAllFormats} variant="outline" className="w-full">
                      <FileDown className="h-4 w-4 mr-2" />
                      Export All Formats (SVG, PNG, PDF, Figma)
                    </Button>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Patent Documentation Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm">
                        <strong>Total Wireframes:</strong> {Object.keys(wireframes).length}
                      </div>
                      <div className="text-sm">
                        <strong>Selected Persona:</strong> {personas.find(p => p.id === selectedPersona)?.name}
                      </div>
                      <div className="text-sm">
                        <strong>Export Format:</strong> {exportFormat.toUpperCase()}
                      </div>
                      <div className="text-sm">
                        <strong>Patent Claims:</strong> {Object.keys(wireframes).length} unique innovations documented
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
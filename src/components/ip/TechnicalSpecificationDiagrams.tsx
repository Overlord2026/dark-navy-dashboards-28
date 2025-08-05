import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, GitBranch, Database, Cpu, Shield, Zap } from 'lucide-react';
import { PatentPendingBanner } from './PatentPendingBanner';

export const TechnicalSpecificationDiagrams = () => {
  const [selectedDiagram, setSelectedDiagram] = useState<string>('permission-engine');

  const specifications = {
    'permission-engine': {
      title: 'Role-Based Permission Engine Architecture',
      description: 'Multi-persona access control with dynamic module provisioning',
      patentClaim: 'Novel role-based permission system with dynamic feature allocation',
      diagram: `graph TB
        A[Authentication Service] --> B[Role Detection Engine]
        B --> C[Permission Matrix]
        C --> D[Module Provider]
        D --> E[Dashboard Orchestrator]
        
        F[VIP Onboarding] --> B
        G[LinkedIn Integration] --> F
        H[Admin Pre-Creation] --> F
        
        C --> I[Compliance Rules Engine]
        I --> J[State-Specific Processor]
        J --> K[Audit Logger]
        
        subgraph "Patent Pending: Permission Engine"
          B
          C
          D
          E
        end
        
        style A fill:#e1f5fe
        style B fill:#f3e5f5
        style C fill:#fff3e0
        style D fill:#e8f5e8`
    },
    'ai-workflow': {
      title: 'AI Workflow Routing & Decision Engine',
      description: 'Machine learning powered workflow optimization with SWAG scoring',
      patentClaim: 'AI-powered workflow orchestration with predictive routing algorithms',
      diagram: `graph TD
        A[User Action] --> B[AI Workflow Orchestrator]
        B --> C{SWAG Score Analysis}
        C -->|High Score| D[Priority Routing]
        C -->|Medium Score| E[Standard Routing]
        C -->|Low Score| F[Automated Routing]
        
        D --> G[Immediate Advisor Assignment]
        E --> H[Queue Management]
        F --> I[AI Response System]
        
        G --> J[Smart Recommendations]
        H --> J
        I --> J
        
        J --> K[Multi-Channel Notification]
        K --> L[Voice/SMS/Email Gateway]
        
        subgraph "Patent Pending: AI Engine"
          B
          C
          J
        end
        
        style B fill:#e1f5fe
        style C fill:#f3e5f5
        style J fill:#fff3e0`
    },
    'security-audit': {
      title: 'Data Security & Audit Architecture',
      description: 'End-to-end encryption with real-time compliance monitoring',
      patentClaim: 'Integrated security and audit system with automated compliance tracking',
      diagram: `graph LR
        A[Document Vault] --> B[Encryption Layer]
        B --> C[Access Control Matrix]
        C --> D[Audit Logger]
        
        E[User Request] --> F[Permission Validator]
        F --> G{Access Granted?}
        G -->|Yes| H[Secure Document Delivery]
        G -->|No| I[Security Alert]
        
        H --> D
        I --> D
        D --> J[Compliance Dashboard]
        
        K[Real-time Monitoring] --> L[Anomaly Detection]
        L --> M[Automated Alerts]
        M --> N[Multi-Persona Notification]
        
        subgraph "Patent Pending: Security System"
          B
          C
          D
          L
        end
        
        style B fill:#ffebee
        style C fill:#f3e5f5
        style D fill:#e8f5e8
        style L fill:#fff3e0`
    },
    'api-integration': {
      title: 'Third-Party API Integration Flow',
      description: 'Unified API gateway with intelligent data mapping and error handling',
      patentClaim: 'Centralized API orchestration system with intelligent data synchronization',
      diagram: `graph TB
        A[API Gateway] --> B[Authentication Hub]
        B --> C[Service Router]
        
        C --> D[Zoom Integration]
        C --> E[Plaid Banking]
        C --> F[Stripe Payments]
        C --> G[Facebook/Meta APIs]
        C --> H[Twilio Communication]
        C --> I[OpenAI/GPT Services]
        C --> J[Google Workspace]
        
        D --> K[Data Mapper]
        E --> K
        F --> K
        G --> K
        H --> K
        I --> K
        J --> K
        
        K --> L[Error Handler]
        L --> M[Retry Logic]
        M --> N[Fallback System]
        
        K --> O[Response Formatter]
        O --> P[Client Delivery]
        
        subgraph "Patent Pending: API Orchestration"
          A
          C
          K
          L
        end
        
        style A fill:#e1f5fe
        style C fill:#f3e5f5
        style K fill:#fff3e0
        style L fill:#ffebee`
    },
    'notification-system': {
      title: 'Integrated Multi-Channel Notification Architecture',
      description: 'Unified notification system with audit overlay and compliance tracking',
      patentClaim: 'Multi-channel notification system with integrated compliance monitoring',
      diagram: `graph TD
        A[Notification Trigger] --> B[Channel Selector]
        B --> C{Priority Level}
        
        C -->|High| D[Voice Call]
        C -->|Medium| E[SMS Text]
        C -->|Low| F[Email]
        
        D --> G[Twilio Voice API]
        E --> H[Twilio SMS API]
        F --> I[SendGrid/Resend]
        
        G --> J[Delivery Tracker]
        H --> J
        I --> J
        
        J --> K[Audit Logger]
        K --> L[Compliance Checker]
        L --> M[State Regulation Validator]
        
        M --> N[Dashboard Update]
        N --> O[Real-time Status]
        
        subgraph "Patent Pending: Notification Engine"
          B
          C
          J
          K
        end
        
        style B fill:#e1f5fe
        style C fill:#f3e5f5
        style J fill:#fff3e0
        style K fill:#e8f5e8`
    },
    'vip-onboarding': {
      title: 'VIP Reserved Profile Onboarding System',
      description: 'Automated VIP onboarding with LinkedIn integration and admin pre-creation',
      patentClaim: 'Automated VIP profile creation with social media integration and pre-provisioning',
      diagram: `graph LR
        A[VIP Invitation] --> B[LinkedIn OAuth]
        B --> C[Profile Import]
        C --> D[Data Enrichment]
        
        D --> E[Admin Pre-Creation]
        E --> F[Role Assignment]
        F --> G[Module Provisioning]
        
        G --> H[Personalized Dashboard]
        H --> I[Welcome Sequence]
        I --> J[Guided Tour]
        
        K[Background Checks] --> L[Compliance Validation]
        L --> M[KYC/AML Processing]
        M --> N[Approval Workflow]
        
        N --> O[Account Activation]
        O --> P[Notification Dispatch]
        
        subgraph "Patent Pending: VIP Onboarding"
          B
          C
          D
          E
        end
        
        style B fill:#e1f5fe
        style C fill:#f3e5f5
        style D fill:#fff3e0
        style E fill:#e8f5e8`
    }
  };

  const exportDiagram = (format: string) => {
    const spec = specifications[selectedDiagram as keyof typeof specifications];
    const exportData = {
      title: spec.title,
      description: spec.description,
      patentClaim: spec.patentClaim,
      diagram: spec.diagram,
      format: format,
      timestamp: new Date().toISOString(),
      patentStatus: 'Patent Pending'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDiagram}-${format}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAllDiagrams = () => {
    const allSpecs = Object.entries(specifications).map(([key, spec]) => ({
      id: key,
      ...spec,
      exportTimestamp: new Date().toISOString()
    }));

    const masterExport = {
      metadata: {
        projectName: 'Family Office Multi-Persona Platform',
        totalDiagrams: allSpecs.length,
        exportDate: new Date().toISOString(),
        patentStatus: 'Patent Pending'
      },
      specifications: allSpecs,
      patentMapping: allSpecs.map(spec => ({
        diagramId: spec.id,
        title: spec.title,
        patentClaim: spec.patentClaim
      }))
    };

    const blob = new Blob([JSON.stringify(masterExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `technical-specifications-complete-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PatentPendingBanner feature="Technical Specifications" />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Diagram Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Specifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(specifications).map(([key, spec]) => {
              const icons = {
                'permission-engine': Shield,
                'ai-workflow': Cpu,
                'security-audit': Database,
                'api-integration': Zap,
                'notification-system': GitBranch,
                'vip-onboarding': Shield
              };
              const Icon = icons[key as keyof typeof icons] || GitBranch;
              
              return (
                <Button
                  key={key}
                  variant={selectedDiagram === key ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => setSelectedDiagram(key)}
                >
                  <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-xs">{spec.title}</span>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Diagram Display */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{specifications[selectedDiagram as keyof typeof specifications].title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Patent Pending</Badge>
              <Badge variant="outline">Technical Specification</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="diagram" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="diagram">Diagram</TabsTrigger>
                <TabsTrigger value="specification">Specification</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>

              <TabsContent value="diagram" className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
                    <GitBranch className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">
                      {specifications[selectedDiagram as keyof typeof specifications].title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {specifications[selectedDiagram as keyof typeof specifications].description}
                    </p>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      Patent Pending Technology
                    </Badge>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mermaid Diagram Code</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                      {specifications[selectedDiagram as keyof typeof specifications].diagram}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specification" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Patent Claim</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                      {specifications[selectedDiagram as keyof typeof specifications].patentClaim}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Technical Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {specifications[selectedDiagram as keyof typeof specifications].description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Innovation Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <strong>Novelty:</strong> First-to-market multi-persona financial platform orchestration
                    </div>
                    <div className="text-sm">
                      <strong>Technical Advantage:</strong> Automated role-based feature provisioning with AI optimization
                    </div>
                    <div className="text-sm">
                      <strong>Market Application:</strong> Family offices, wealth management, financial advisory
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="export" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['svg', 'png', 'pdf', 'mermaid'].map(format => (
                    <Button
                      key={format}
                      variant="outline"
                      size="sm"
                      onClick={() => exportDiagram(format)}
                      className="uppercase"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      {format}
                    </Button>
                  ))}
                </div>

                <Button onClick={exportAllDiagrams} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Complete Technical Specification Package
                </Button>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Export Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <strong>Total Specifications:</strong> {Object.keys(specifications).length}
                    </div>
                    <div className="text-sm">
                      <strong>Patent Claims:</strong> {Object.keys(specifications).length} unique innovations
                    </div>
                    <div className="text-sm">
                      <strong>Export Formats:</strong> SVG, PNG, PDF, Mermaid
                    </div>
                    <div className="text-sm">
                      <strong>Ready for:</strong> Patent filing, legal review, technical documentation
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
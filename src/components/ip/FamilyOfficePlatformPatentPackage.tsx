import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Shield, FileText, Briefcase, Users, Database, Lock, TrendingUp, Calendar, Camera, Award } from 'lucide-react';
import { toast } from 'sonner';

interface PatentClaim {
  claimNumber: number;
  claimType: 'independent' | 'dependent';
  title: string;
  description: string;
  technicalElements: string[];
  noveltyFactors: string[];
}

interface ArchitectureComponent {
  name: string;
  description: string;
  connections: string[];
  patentableAspects: string[];
}

interface UIWireframe {
  componentName: string;
  description: string;
  patentableFeatures: string[];
  userFlow: string[];
}

const patentClaims: PatentClaim[] = [
  {
    claimNumber: 1,
    claimType: 'independent',
    title: 'Multi-Persona Family Office Platform System',
    description: 'A computer-implemented system for managing family office operations through persona-based routing and automated compliance',
    technicalElements: [
      'Multi-persona authentication and routing system',
      'Dynamic role-based dashboard generation',
      'Automated compliance trigger system',
      'Cross-generational data inheritance protocols'
    ],
    noveltyFactors: [
      'Persona-driven UI adaptation',
      'Family-specific compliance automation',
      'Multi-generational vault inheritance'
    ]
  },
  {
    claimNumber: 2,
    claimType: 'dependent',
    title: 'SWAG Lead Scoring Integration',
    description: 'The system of claim 1, wherein the platform integrates Strategic Wealth Alpha GPS™ scoring for HNW lead identification',
    technicalElements: [
      'Open banking API integration for wealth assessment',
      'Alternative investment eligibility analysis',
      'Dynamic persona trigger generation',
      'Multi-factor lead scoring algorithm'
    ],
    noveltyFactors: [
      'HNW-specific data points integration',
      'BFO™ methodology implementation',
      'Real-time persona classification'
    ]
  },
  {
    claimNumber: 3,
    claimType: 'dependent',
    title: 'Multimedia Family Vault System',
    description: 'The system of claim 1, featuring a secure multimedia vault with trigger-based content delivery',
    technicalElements: [
      'Encrypted multimedia storage system',
      'Event-based content trigger mechanism',
      'Version control for family documents',
      'Cross-platform synchronization'
    ],
    noveltyFactors: [
      'Family milestone trigger system',
      'Multi-generational content inheritance',
      'Contextual document delivery'
    ]
  },
  {
    claimNumber: 4,
    claimType: 'independent',
    title: 'Automated Compliance Management Method',
    description: 'A method for automated compliance monitoring and documentation in family office environments',
    technicalElements: [
      'Real-time regulatory change monitoring',
      'Automated compliance checklist generation',
      'Stakeholder notification system',
      'Audit trail documentation'
    ],
    noveltyFactors: [
      'Family office specific compliance rules',
      'Automated regulatory adaptation',
      'Multi-jurisdiction compliance tracking'
    ]
  },
  {
    claimNumber: 5,
    claimType: 'dependent',
    title: 'Voice-Activated Meeting Management',
    description: 'The method of claim 4, incorporating voice-activated meeting management and documentation',
    technicalElements: [
      'Voice recognition and processing',
      'Automated meeting transcription',
      'Action item extraction and assignment',
      'Follow-up automation system'
    ],
    noveltyFactors: [
      'Family office meeting context awareness',
      'Wealth management specific terminology processing',
      'Automated follow-up with compliance integration'
    ]
  },
  {
    claimNumber: 6,
    claimType: 'independent',
    title: 'API Risk Assessment Dashboard',
    description: 'A system for real-time API integration risk assessment and go/no-go decision making',
    technicalElements: [
      'Real-time API health monitoring',
      'Security vulnerability assessment',
      'Performance impact analysis',
      'Automated decision recommendation engine'
    ],
    noveltyFactors: [
      'Family office data sensitivity scoring',
      'Multi-factor API risk assessment',
      'Automated integration approval workflow'
    ]
  },
  {
    claimNumber: 7,
    claimType: 'dependent',
    title: 'Marketplace Integration Framework',
    description: 'The system of claim 1, including a secure marketplace for family office service providers',
    technicalElements: [
      'Vendor verification and onboarding system',
      'Service capability matching algorithm',
      'Secure communication channels',
      'Performance tracking and rating system'
    ],
    noveltyFactors: [
      'Family office specific service categorization',
      'Trust-based vendor verification',
      'Family wealth context-aware matching'
    ]
  },
  {
    claimNumber: 8,
    claimType: 'dependent',
    title: 'Onboarding Automation System',
    description: 'The system of claim 1, featuring automated onboarding workflows for different family office personas',
    technicalElements: [
      'Persona-specific onboarding flow generation',
      'Document collection automation',
      'Progress tracking and notification system',
      'Compliance verification integration'
    ],
    noveltyFactors: [
      'Family role-based onboarding customization',
      'Automated document verification',
      'Multi-generational onboarding workflows'
    ]
  },
  {
    claimNumber: 9,
    claimType: 'independent',
    title: 'Data Privacy and Audit System',
    description: 'A comprehensive data privacy and audit system for sensitive family office information',
    technicalElements: [
      'Granular access control system',
      'Immutable audit log generation',
      'Data encryption and key management',
      'Privacy compliance automation'
    ],
    noveltyFactors: [
      'Family office specific privacy rules',
      'Multi-jurisdictional compliance automation',
      'Generational data access inheritance'
    ]
  },
  {
    claimNumber: 10,
    claimType: 'dependent',
    title: 'Collaboration Platform Integration',
    description: 'The system of claim 9, incorporating secure collaboration tools for family office stakeholders',
    technicalElements: [
      'Encrypted communication channels',
      'Document collaboration with version control',
      'Role-based collaboration permissions',
      'Integration with external communication tools'
    ],
    noveltyFactors: [
      'Family office stakeholder identification',
      'Context-aware collaboration permissions',
      'Wealth management specific collaboration workflows'
    ]
  },
  {
    claimNumber: 11,
    claimType: 'dependent',
    title: 'Investment Performance Integration',
    description: 'The system of claim 1, featuring integration with investment platforms and performance tracking',
    technicalElements: [
      'Multi-platform investment data aggregation',
      'Performance analytics and reporting',
      'Risk assessment and monitoring',
      'Automated rebalancing recommendations'
    ],
    noveltyFactors: [
      'Family office investment strategy alignment',
      'Multi-generational investment tracking',
      'Wealth preservation optimization'
    ]
  },
  {
    claimNumber: 12,
    claimType: 'independent',
    title: 'Legacy Digital Vault Management',
    description: 'A method for managing digital legacy content with automated inheritance and trigger systems',
    technicalElements: [
      'Time-based content release mechanisms',
      'Beneficiary verification system',
      'Content categorization and tagging',
      'Multi-format content preservation'
    ],
    noveltyFactors: [
      'Family milestone-based content release',
      'Digital inheritance automation',
      'Multi-generational content curation'
    ]
  }
];

const architectureComponents: ArchitectureComponent[] = [
  {
    name: 'Persona Authentication Gateway',
    description: 'Central authentication system that routes users based on family office roles',
    connections: ['Dashboard System', 'Compliance Engine', 'Vault System'],
    patentableAspects: ['Multi-persona role detection', 'Dynamic UI generation', 'Family hierarchy mapping']
  },
  {
    name: 'SWAG™ Lead Scoring Engine',
    description: 'AI-powered system for identifying and scoring high-net-worth prospects',
    connections: ['Plaid Integration', 'CRM System', 'Analytics Dashboard'],
    patentableAspects: ['HNW-specific data analysis', 'Alternative investment eligibility', 'Dynamic persona triggers']
  },
  {
    name: 'Compliance Automation Engine',
    description: 'Automated system for monitoring and managing family office compliance requirements',
    connections: ['Audit System', 'Notification System', 'Document Management'],
    patentableAspects: ['Automated compliance triggers', 'Multi-jurisdiction monitoring', 'Family office specific rules']
  },
  {
    name: 'Digital Family Vault',
    description: 'Secure multimedia storage with trigger-based content delivery',
    connections: ['Authentication Gateway', 'Trigger System', 'Inheritance Manager'],
    patentableAspects: ['Event-based content release', 'Multi-generational access', 'Contextual document delivery']
  },
  {
    name: 'Voice AI Assistant (Linda)',
    description: 'Voice-activated meeting management and task automation',
    connections: ['Meeting System', 'Task Manager', 'Compliance Engine'],
    patentableAspects: ['Family office context awareness', 'Automated meeting documentation', 'Wealth management terminology']
  },
  {
    name: 'API Risk Dashboard',
    description: 'Real-time monitoring and risk assessment for third-party integrations',
    connections: ['Security Monitor', 'Integration Manager', 'Decision Engine'],
    patentableAspects: ['Real-time risk assessment', 'Automated go/no-go decisions', 'Family office data sensitivity scoring']
  }
];

const uiWireframes: UIWireframe[] = [
  {
    componentName: 'Multi-Persona Dashboard',
    description: 'Adaptive dashboard that changes based on user role and family office position',
    patentableFeatures: ['Dynamic widget arrangement', 'Role-based information hierarchy', 'Family wealth context display'],
    userFlow: ['Login', 'Persona Detection', 'Dashboard Generation', 'Widget Customization', 'Information Access']
  },
  {
    componentName: 'SWAG™ Lead Scoring Interface',
    description: 'Interactive interface for viewing and managing high-net-worth lead scores',
    patentableFeatures: ['Real-time score visualization', 'BFO™ methodology display', 'Persona trigger indicators'],
    userFlow: ['Lead Import', 'Data Analysis', 'Score Calculation', 'Persona Assignment', 'Action Recommendations']
  },
  {
    componentName: 'Family Vault Interface',
    description: 'Secure interface for accessing family documents and multimedia content',
    patentableFeatures: ['Trigger-based content display', 'Inheritance timeline visualization', 'Context-aware organization'],
    userFlow: ['Authentication', 'Permission Check', 'Content Discovery', 'Trigger Evaluation', 'Content Access']
  },
  {
    componentName: 'Compliance Dashboard',
    description: 'Automated compliance monitoring and management interface',
    patentableFeatures: ['Real-time compliance status', 'Automated checklist generation', 'Regulatory change alerts'],
    userFlow: ['Compliance Check', 'Status Review', 'Action Items', 'Documentation', 'Audit Trail']
  }
];

const productTimeline = [
  {
    date: '2024-01-15',
    milestone: 'Initial Platform Concept',
    description: 'First conception of multi-persona family office platform',
    evidence: 'Initial wireframes and system architecture documents'
  },
  {
    date: '2024-02-20',
    milestone: 'SWAG™ Algorithm Development',
    description: 'Development of Strategic Wealth Alpha GPS™ scoring methodology',
    evidence: 'Algorithm documentation and test implementations'
  },
  {
    date: '2024-03-10',
    milestone: 'Family Vault Implementation',
    description: 'First working version of multimedia family vault with triggers',
    evidence: 'System screenshots and functionality demonstrations'
  },
  {
    date: '2024-04-05',
    milestone: 'Compliance Automation Launch',
    description: 'Automated compliance monitoring system goes live',
    evidence: 'Live system screenshots and audit logs'
  },
  {
    date: '2024-05-15',
    milestone: 'Voice AI Integration',
    description: 'Linda AI voice assistant integrated for meeting management',
    evidence: 'Voice interaction recordings and transcription examples'
  },
  {
    date: '2024-06-01',
    milestone: 'Marketplace Beta Launch',
    description: 'Family office service provider marketplace launched',
    evidence: 'Platform screenshots and vendor onboarding workflows'
  }
];

export function FamilyOfficePlatformPatentPackage() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const exportCompletePackage = () => {
    const packageData = {
      exportDate: new Date().toISOString(),
      packageTitle: "Family Office Platform™ Provisional Patent Application Package",
      patentClaims,
      architectureComponents,
      uiWireframes,
      productTimeline,
      technicalNarrative: {
        dataPrivacy: "Implementation of granular access controls with family office specific privacy rules",
        personaRouting: "Dynamic UI generation based on family role and wealth management context",
        apiManagement: "Real-time risk assessment and automated decision making for third-party integrations",
        auditLogging: "Comprehensive audit trail with immutable logging for compliance and governance"
      },
      inventorInformation: {
        inventors: ["Platform Development Team"],
        assignee: "Family Office Platform Inc.",
        filingDate: new Date().toISOString(),
        applicationTitle: "Multi-Persona Family Office Management Platform with Automated Compliance and Digital Vault Systems"
      }
    };

    const blob = new Blob([JSON.stringify(packageData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Family-Office-Platform-Provisional-Patent-Package-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Complete Family Office Platform™ patent package exported for attorney filing");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gold font-playfair flex items-center gap-2">
            <Award className="h-6 w-6" />
            Family Office Platform™ Provisional Patent Package
          </h2>
          <p className="text-muted-foreground">Comprehensive patent application package ready for attorney filing</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-amber-500/10 text-amber-700 border-amber-200">
            <Shield className="h-3 w-3 mr-1" />
            PATENT PENDING
          </Badge>
          <Badge className="bg-red-500/10 text-red-700 border-red-200">
            <Lock className="h-3 w-3 mr-1" />
            NDA REQUIRED
          </Badge>
          <Button onClick={exportCompletePackage} className="bg-gold hover:bg-gold/90 text-deep-blue">
            <Download className="h-4 w-4 mr-2" />
            Export Complete Package
          </Button>
        </div>
      </div>

      {/* Patent Summary Card */}
      <Card className="bg-gradient-to-br from-background to-gold/5 border-gold/20">
        <CardHeader>
          <CardTitle className="text-xl text-gold font-playfair flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Patent Application Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gold">{patentClaims.length}</div>
              <div className="text-sm text-muted-foreground">Patent Claims</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{architectureComponents.length}</div>
              <div className="text-sm text-muted-foreground">Architecture Components</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{uiWireframes.length}</div>
              <div className="text-sm text-muted-foreground">UI Wireframes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{productTimeline.length}</div>
              <div className="text-sm text-muted-foreground">Development Milestones</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Patent Claims</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="wireframes">UI Wireframes</TabsTrigger>
          <TabsTrigger value="timeline">Product Timeline</TabsTrigger>
          <TabsTrigger value="technical">Technical Narrative</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {patentClaims.map((claim, index) => (
              <Card key={index} className="border-l-4 border-l-gold/50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold">Claim {claim.claimNumber}</CardTitle>
                      <p className="text-sm font-medium text-gold">{claim.title}</p>
                      <Badge variant="outline" className="mt-1">
                        {claim.claimType.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{claim.description}</p>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Technical Elements:</h4>
                    <ul className="space-y-1">
                      {claim.technicalElements.map((element, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-gold">•</span>
                          {element}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Key Novelty Factors:</h4>
                    <div className="flex flex-wrap gap-2">
                      {claim.noveltyFactors.map((factor, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs text-emerald-700 border-emerald-200">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-4">
          <div className="grid gap-4">
            {architectureComponents.map((component, index) => (
              <Card key={index} className="bg-gradient-to-br from-background to-emerald-500/5 border-emerald-500/20">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-emerald-700 flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    {component.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{component.description}</p>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-2">System Connections:</h4>
                    <div className="flex flex-wrap gap-2">
                      {component.connections.map((connection, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {connection}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Patentable Aspects:</h4>
                    <ul className="space-y-1">
                      {component.patentableAspects.map((aspect, idx) => (
                        <li key={idx} className="text-sm text-emerald-700 flex items-start gap-2">
                          <span className="text-emerald-500">⦿</span>
                          {aspect}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="wireframes" className="space-y-4">
          <div className="grid gap-4">
            {uiWireframes.map((wireframe, index) => (
              <Card key={index} className="bg-gradient-to-br from-background to-blue-500/5 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {wireframe.componentName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{wireframe.description}</p>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-2">User Flow:</h4>
                    <div className="flex flex-wrap gap-2">
                      {wireframe.userFlow.map((step, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {idx + 1}. {step}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Patentable UI Features:</h4>
                    <ul className="space-y-1">
                      {wireframe.patentableFeatures.map((feature, idx) => (
                        <li key={idx} className="text-sm text-blue-700 flex items-start gap-2">
                          <span className="text-blue-500">◆</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <div className="space-y-4">
            {productTimeline.map((event, index) => (
              <Card key={index} className="bg-gradient-to-br from-background to-purple-500/5 border-purple-500/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold text-purple-700 flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {event.milestone}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                    <Badge variant="outline" className="text-purple-700 border-purple-200">
                      <Camera className="h-3 w-3 mr-1" />
                      DOCUMENTED
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                  <div className="text-xs text-purple-700 bg-purple-50 p-2 rounded">
                    <strong>Evidence:</strong> {event.evidence}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-gold font-playfair">Technical Implementation Narrative</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-l-gold pl-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Data Privacy Architecture
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    The platform implements a novel approach to data privacy in family office environments through 
                    granular access controls that respect family hierarchies and wealth management relationships. 
                    The system automatically applies privacy rules based on family role, generation, and wealth 
                    management context, ensuring sensitive financial information is appropriately compartmentalized 
                    while maintaining necessary transparency for family office operations.
                  </p>
                </div>

                <div className="border-l-4 border-l-emerald-500 pl-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Persona Routing Innovation
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    The platform's persona routing system represents a significant advancement in family office 
                    technology by dynamically generating user interfaces based on detected family roles and 
                    responsibilities. Unlike traditional role-based systems, our approach considers generational 
                    position, wealth management involvement, and family governance structure to create truly 
                    personalized experiences that adapt to the complex relationships within family offices.
                  </p>
                </div>

                <div className="border-l-4 border-l-blue-500 pl-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    API and Secret Management
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    The platform's API management system provides real-time risk assessment for third-party 
                    integrations, automatically evaluating security posture, data sensitivity, and potential 
                    impact on family office operations. The system uses machine learning to assess integration 
                    risks and provides automated go/no-go recommendations, with the ability to dynamically 
                    adjust access levels based on changing risk profiles.
                  </p>
                </div>

                <div className="border-l-4 border-l-purple-500 pl-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Audit Logging and Compliance
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    The comprehensive audit logging system creates immutable records of all platform activities 
                    with particular attention to family office governance requirements. The system automatically 
                    identifies compliance-relevant activities and generates appropriate documentation, while 
                    maintaining detailed chains of custody for all family documents and financial decisions. 
                    This approach ensures that family offices can meet evolving regulatory requirements while 
                    maintaining operational efficiency.
                  </p>
                </div>
              </div>

              <div className="bg-gold/10 p-4 rounded-lg">
                <h4 className="font-semibold text-gold mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Patent Filing Recommendation
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• <strong>Primary Filing:</strong> US Provisional Patent Application for comprehensive platform protection</li>
                  <li>• <strong>International Strategy:</strong> PCT filing within 12 months for global protection</li>
                  <li>• <strong>Continuation Applications:</strong> Separate filings for SWAG™ algorithm and vault inheritance system</li>
                  <li>• <strong>Trade Secret Protection:</strong> Specific algorithmic implementations for competitive advantage</li>
                  <li>• <strong>Trademark Registrations:</strong> Family Office Platform™, SWAG™, BFO™ methodologies</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
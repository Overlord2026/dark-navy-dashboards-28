import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Download, Shield, FileText, Briefcase, Users, Database, Lock, 
  TrendingUp, Calendar, Camera, Award, Video, Image, ExternalLink,
  PlayCircle, FileImage, Presentation, Scale, Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface WorkflowDiagram {
  name: string;
  description: string;
  components: string[];
  patentableElements: string[];
  userJourney: string[];
  technicalSpecs: string[];
}

interface IPLogEntry {
  date: string;
  milestone: string;
  description: string;
  evidence: string;
  inventors: string[];
  documentation: string[];
  screenshots: string[];
}

interface ClaimStructure {
  claimNumber: number;
  claimType: 'independent' | 'dependent';
  title: string;
  summary: string;
  technicalElements: string[];
  noveltyFactors: string[];
  priorArtDifferentiation: string[];
}

const workflowDiagrams: WorkflowDiagram[] = [
  {
    name: "Multi-Persona Onboarding Flow",
    description: "Adaptive onboarding system that customizes based on family office role and generation",
    components: ["Persona Detection", "Role Assignment", "Customized Workflow", "Compliance Verification", "Access Provisioning"],
    patentableElements: [
      "Automated family role detection algorithm",
      "Dynamic workflow generation based on persona",
      "Generational access inheritance system",
      "Family office specific compliance checks"
    ],
    userJourney: ["Initial Contact", "Persona Assessment", "Customized Onboarding", "Document Collection", "Verification", "Access Grant"],
    technicalSpecs: [
      "React-based adaptive UI components",
      "Supabase backend with role-based access control",
      "Automated document verification system",
      "Integration with compliance databases"
    ]
  },
  {
    name: "SWAG™ Lead Scoring Architecture",
    description: "AI-powered system for identifying and scoring high-net-worth prospects using Strategic Wealth Alpha GPS™",
    components: ["Data Ingestion", "HNW Analysis", "BFO™ Processing", "Persona Triggers", "Score Generation"],
    patentableElements: [
      "Multi-source financial data integration",
      "Alternative investment eligibility analysis",
      "Family office prospect identification algorithm",
      "Dynamic persona trigger generation"
    ],
    userJourney: ["Lead Import", "Data Analysis", "Score Calculation", "Persona Assignment", "Engagement Triggers"],
    technicalSpecs: [
      "Plaid API integration for banking data",
      "Machine learning scoring algorithms",
      "Real-time data processing pipeline",
      "Automated lead classification system"
    ]
  },
  {
    name: "Digital Family Vault System",
    description: "Secure multimedia storage with event-triggered content delivery and inheritance management",
    components: ["Secure Storage", "Trigger Engine", "Access Control", "Inheritance Manager", "Content Delivery"],
    patentableElements: [
      "Event-based content release mechanism",
      "Multi-generational access inheritance",
      "Contextual document organization",
      "Automated content categorization"
    ],
    userJourney: ["Content Upload", "Categorization", "Trigger Setup", "Access Control", "Delivery Activation"],
    technicalSpecs: [
      "Encrypted file storage system",
      "Event-driven trigger architecture",
      "Role-based access matrix",
      "Automated backup and versioning"
    ]
  },
  {
    name: "Automated Compliance Management",
    description: "Real-time compliance monitoring and automated documentation for family office regulations",
    components: ["Regulatory Monitor", "Compliance Engine", "Auto-Documentation", "Alert System", "Audit Trail"],
    patentableElements: [
      "Automated regulatory change detection",
      "Family office specific compliance rules",
      "Real-time violation detection",
      "Automated remediation workflows"
    ],
    userJourney: ["Monitoring Setup", "Rule Configuration", "Real-time Scanning", "Violation Detection", "Automated Response"],
    technicalSpecs: [
      "Regulatory API integrations",
      "Rule-based compliance engine",
      "Automated documentation generation",
      "Immutable audit logging system"
    ]
  },
  {
    name: "VIP Profile Auto-Creation",
    description: "Automated system for creating and maintaining VIP client profiles based on wealth indicators",
    components: ["Wealth Detection", "Profile Generation", "Data Enrichment", "Relationship Mapping", "Update Automation"],
    patentableElements: [
      "Automated VIP status determination",
      "Multi-source data aggregation for profiles",
      "Family relationship mapping algorithm",
      "Dynamic profile updating system"
    ],
    userJourney: ["Client Identification", "Wealth Assessment", "Profile Creation", "Data Enrichment", "Relationship Mapping"],
    technicalSpecs: [
      "Third-party data integrations",
      "Machine learning classification",
      "Automated profile templates",
      "Real-time data synchronization"
    ]
  }
];

const detailedClaims: ClaimStructure[] = [
  {
    claimNumber: 1,
    claimType: 'independent',
    title: 'Family Office Platform System',
    summary: 'A computer-implemented system for managing family office operations through persona-based routing and automated compliance',
    technicalElements: [
      'Multi-persona authentication and routing system',
      'Dynamic role-based dashboard generation',
      'Automated compliance trigger system',
      'Cross-generational data inheritance protocols',
      'Real-time wealth assessment algorithms'
    ],
    noveltyFactors: [
      'Family office specific persona detection',
      'Generational wealth management integration',
      'Multi-role compliance automation',
      'Adaptive UI generation based on family position'
    ],
    priorArtDifferentiation: [
      'Unlike Salesforce: Family office specific vs. general CRM',
      'Unlike Fidelity: Multi-generational vs. individual client focus',
      'Unlike traditional systems: Automated persona detection vs. manual role assignment'
    ]
  },
  {
    claimNumber: 2,
    claimType: 'dependent',
    title: 'SWAG™ Lead Scoring Integration',
    summary: 'The system of claim 1, wherein the platform integrates Strategic Wealth Alpha GPS™ scoring for HNW lead identification',
    technicalElements: [
      'Open banking API integration for wealth assessment',
      'Alternative investment eligibility analysis',
      'Dynamic persona trigger generation',
      'Multi-factor lead scoring algorithm',
      'Real-time prospect classification'
    ],
    noveltyFactors: [
      'HNW-specific data points integration',
      'BFO™ methodology implementation',
      'Real-time persona classification',
      'Family office prospect identification'
    ],
    priorArtDifferentiation: [
      'Beyond traditional lead scoring: HNW-specific vs. general demographic analysis',
      'Advanced data integration: Multiple financial sources vs. single platform data',
      'Dynamic triggers: Real-time adaptation vs. static scoring rules'
    ]
  },
  {
    claimNumber: 3,
    claimType: 'dependent',
    title: 'Multimedia Family Vault System',
    summary: 'The system of claim 1, featuring a secure multimedia vault with trigger-based content delivery',
    technicalElements: [
      'Encrypted multimedia storage system',
      'Event-based content trigger mechanism',
      'Version control for family documents',
      'Cross-platform synchronization',
      'Automated inheritance protocols'
    ],
    noveltyFactors: [
      'Family milestone trigger system',
      'Multi-generational content inheritance',
      'Contextual document delivery',
      'Event-driven content release'
    ],
    priorArtDifferentiation: [
      'Beyond cloud storage: Event-triggered vs. manual access',
      'Family-specific: Generational inheritance vs. standard file sharing',
      'Contextual delivery: Milestone-based vs. time-based release'
    ]
  }
];

const ipLogEntries: IPLogEntry[] = [
  {
    date: '2024-01-15',
    milestone: 'Initial Platform Concept',
    description: 'First conception and documentation of family office platform',
    evidence: 'Initial concept documents, wireframes, and technical specifications',
    inventors: ['Platform Development Team', 'Architecture Lead', 'UX Design Lead'],
    documentation: ['Concept_Doc_v1.pdf', 'Initial_Wireframes.fig', 'Technical_Spec_v1.md'],
    screenshots: ['concept_dashboard.png', 'persona_flow.png', 'initial_mockups.png']
  },
  {
    date: '2024-02-20',
    milestone: 'SWAG™ Algorithm Development',
    description: 'Development and implementation of Strategic Wealth Alpha GPS™ scoring methodology',
    evidence: 'Algorithm documentation, test results, and implementation code',
    inventors: ['AI/ML Team Lead', 'Financial Analysis Expert', 'Data Science Team'],
    documentation: ['SWAG_Algorithm_v1.pdf', 'Test_Results.xlsx', 'Implementation_Guide.md'],
    screenshots: ['swag_dashboard.png', 'scoring_interface.png', 'results_visualization.png']
  },
  {
    date: '2024-03-10',
    milestone: 'Family Vault Implementation',
    description: 'First working version of multimedia family vault with trigger-based content delivery',
    evidence: 'System demonstrations, functionality tests, and user interface screenshots',
    inventors: ['Security Team Lead', 'Frontend Development Team', 'System Architecture Lead'],
    documentation: ['Vault_System_Spec.pdf', 'Security_Audit.pdf', 'User_Guide_v1.pdf'],
    screenshots: ['vault_interface.png', 'trigger_setup.png', 'content_delivery.png']
  },
  {
    date: '2024-04-05',
    milestone: 'Compliance Automation Launch',
    description: 'Automated compliance monitoring system with real-time regulatory change detection',
    evidence: 'Live system demonstrations, compliance reports, and audit trails',
    inventors: ['Compliance Team Lead', 'Regulatory Expert', 'Automation Engineer'],
    documentation: ['Compliance_System.pdf', 'Regulatory_Integration.md', 'Audit_Trail_Spec.pdf'],
    screenshots: ['compliance_dashboard.png', 'alert_system.png', 'audit_interface.png']
  },
  {
    date: '2024-05-15',
    milestone: 'Voice AI Integration',
    description: 'Linda AI voice assistant integrated for meeting management and task automation',
    evidence: 'Voice interaction recordings, transcription examples, and system integration tests',
    inventors: ['AI Team Lead', 'Voice Technology Expert', 'Integration Specialist'],
    documentation: ['Voice_AI_Spec.pdf', 'Integration_Guide.md', 'Performance_Metrics.xlsx'],
    screenshots: ['voice_interface.png', 'meeting_transcription.png', 'ai_dashboard.png']
  },
  {
    date: '2024-06-01',
    milestone: 'Marketplace Beta Launch',
    description: 'Family office service provider marketplace with vendor verification and matching',
    evidence: 'Platform demonstrations, vendor onboarding workflows, and user feedback',
    inventors: ['Marketplace Team Lead', 'Vendor Relations Expert', 'Quality Assurance Lead'],
    documentation: ['Marketplace_Spec.pdf', 'Vendor_Guide.pdf', 'Beta_Results.xlsx'],
    screenshots: ['marketplace_home.png', 'vendor_profiles.png', 'matching_algorithm.png']
  }
];

const demoVideoScript = `
# Family Office Platform™ Demo Video Script
## "The Future of Family Wealth Management"

### Opening Scene (0:00 - 0:30)
**Visual:** Elegant family office setting, modern technology
**Narrator:** "For generations, family offices have managed wealth through relationships, intuition, and experience. But what if technology could enhance these human connections while preserving the personal touch that makes family offices unique?"

### Problem Statement (0:30 - 1:00)
**Visual:** Traditional challenges - scattered systems, manual processes
**Narrator:** "Today's family offices face unprecedented challenges: complex regulations, multi-generational expectations, and the need for transparency while maintaining privacy."

### Solution Introduction (1:00 - 1:30)
**Visual:** Platform overview, elegant interface
**Narrator:** "Introducing the Family Office Platform™ - the first comprehensive system designed specifically for multi-generational family wealth management."

### Key Features Demonstration (1:30 - 4:00)

#### SWAG™ Lead Scoring (1:30 - 2:00)
**Visual:** SWAG dashboard, real-time scoring
**Narrator:** "Our proprietary SWAG™ algorithm identifies high-net-worth prospects using over 200 data points, ensuring your family office connects with the right clients."

#### Multi-Persona Dashboard (2:00 - 2:30)
**Visual:** Different user interfaces for different roles
**Narrator:** "Every family member sees exactly what they need - from the patriarch's comprehensive oversight to the next generation's targeted engagement tools."

#### Digital Family Vault (2:30 - 3:00)
**Visual:** Vault interface, trigger demonstrations
**Narrator:** "Preserve your family's legacy with our Digital Family Vault - securely storing documents, photos, and memories with intelligent triggers for milestone releases."

#### Compliance Automation (3:00 - 3:30)
**Visual:** Compliance dashboard, automated alerts
**Narrator:** "Stay ahead of regulatory changes with automated compliance monitoring that adapts to your family office's unique structure and requirements."

#### Voice AI Assistant (3:30 - 4:00)
**Visual:** Linda AI in action, meeting management
**Narrator:** "Meet Linda, your AI assistant who manages meetings, tracks action items, and ensures nothing falls through the cracks."

### Patent Innovation Highlight (4:00 - 4:30)
**Visual:** Patent pending badges, innovation timeline
**Narrator:** "With 12+ patent-pending innovations, the Family Office Platform™ represents the most significant advancement in family wealth management technology."

### Call to Action (4:30 - 5:00)
**Visual:** Contact information, demo scheduling
**Narrator:** "Ready to transform your family office? Schedule your personalized demonstration today and discover how technology can enhance your family's wealth management legacy."

### Closing (5:00 - 5:15)
**Visual:** Logo, patent pending badges
**Narrator:** "Family Office Platform™ - Where tradition meets innovation."
`;

export function ComprehensivePatentFilingPackage() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const generatePatentPendingBadges = () => {
    const horizontalSVG = `
      <svg width="300" height="60" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#D4A574;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#B8860B;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="300" height="60" rx="10" fill="url(#goldGradient)" stroke="#8B4513" stroke-width="2"/>
        <text x="150" y="25" font-family="serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1a365d">PATENT PENDING</text>
        <text x="150" y="45" font-family="serif" font-size="10" text-anchor="middle" fill="#1a365d">Family Office Platform™</text>
      </svg>
    `;

    const verticalSVG = `
      <svg width="120" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="goldGradientV" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#D4A574;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#B8860B;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="120" height="200" rx="10" fill="url(#goldGradientV)" stroke="#8B4513" stroke-width="2"/>
        <text x="60" y="30" font-family="serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#1a365d">PATENT</text>
        <text x="60" y="50" font-family="serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#1a365d">PENDING</text>
        <text x="60" y="120" font-family="serif" font-size="8" text-anchor="middle" fill="#1a365d" transform="rotate(-90 60 120)">Family Office Platform™</text>
      </svg>
    `;

    return { horizontalSVG, verticalSVG };
  };

  const generateNDAForms = () => {
    const employeeNDA = `
# CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT
## Family Office Platform™ - Employee Agreement

**EFFECTIVE DATE:** ${new Date().toLocaleDateString()}

### PARTIES
- **Company:** Family Office Platform Inc.
- **Employee:** [Employee Name]

### CONFIDENTIAL INFORMATION
Employee acknowledges access to confidential and proprietary information including:
- Patent-pending technologies and methodologies
- SWAG™ algorithm and scoring systems
- Client data and family office operational procedures
- Software architecture and technical specifications
- Business strategies and financial information

### OBLIGATIONS
1. **Non-Disclosure:** Employee shall not disclose confidential information
2. **Non-Use:** Information shall only be used for authorized company purposes
3. **Protection:** Reasonable steps must be taken to protect confidentiality
4. **Return:** All materials must be returned upon termination

### TERM
This agreement remains in effect during employment and for 5 years thereafter.

### GOVERNING LAW
This agreement shall be governed by [Jurisdiction] law.

**Employee Signature:** ______________________ **Date:** __________
**Company Representative:** _________________ **Date:** __________
    `;

    const partnerNDA = `
# MUTUAL NON-DISCLOSURE AGREEMENT
## Family Office Platform™ - Business Partner Agreement

**EFFECTIVE DATE:** ${new Date().toLocaleDateString()}

### PARTIES
- **Party A:** Family Office Platform Inc.
- **Party B:** [Partner Company Name]

### PURPOSE
Evaluation of potential business relationship regarding Family Office Platform™ technology.

### CONFIDENTIAL INFORMATION
Includes patent-pending innovations, technical specifications, client data, and business strategies.

### MUTUAL OBLIGATIONS
Both parties agree to:
- Maintain strict confidentiality
- Use information solely for evaluation purposes
- Implement reasonable security measures
- Return all materials upon request

### EXCEPTIONS
Information that is:
- Publicly available
- Independently developed
- Rightfully received from third parties

### TERM
3 years from the effective date.

**Party A Representative:** _________________ **Date:** __________
**Party B Representative:** _________________ **Date:** __________
    `;

    return { employeeNDA, partnerNDA };
  };

  const exportComprehensivePackage = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate comprehensive export process
      const steps = [
        "Generating technical diagrams...",
        "Compiling patent claims...",
        "Creating visual assets...",
        "Generating NDA forms...",
        "Creating demo script...",
        "Packaging for attorney review...",
        "Finalizing export bundle..."
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setExportProgress(((i + 1) / steps.length) * 100);
        toast.info(steps[i]);
      }

      const { horizontalSVG, verticalSVG } = generatePatentPendingBadges();
      const { employeeNDA, partnerNDA } = generateNDAForms();

      const comprehensivePackage = {
        metadata: {
          title: "Family Office Platform™ Provisional Patent Filing Package",
          version: "1.0",
          exportDate: new Date().toISOString(),
          packageType: "Attorney & Investor Ready",
          totalDocuments: workflowDiagrams.length + detailedClaims.length + ipLogEntries.length + 7
        },
        patentClaims: detailedClaims,
        workflowDiagrams,
        ipLogAndTimeline: ipLogEntries,
        legalDocuments: {
          employeeNDA,
          partnerNDA
        },
        marketingAssets: {
          demoVideoScript,
          patentBadges: {
            horizontal: horizontalSVG,
            vertical: verticalSVG
          }
        },
        technicalSpecifications: {
          architecture: "Multi-tier microservices with React frontend",
          database: "PostgreSQL with Row Level Security",
          security: "End-to-end encryption with role-based access",
          integrations: "Plaid, Supabase, third-party APIs",
          scalability: "Cloud-native with auto-scaling capabilities"
        },
        presentationDeck: {
          slides: [
            "Title: Family Office Platform™ Innovation Overview",
            "Problem: Current family office technology limitations",
            "Solution: Multi-persona platform with automated compliance",
            "Technology: Patent-pending innovations and architecture",
            "Market: Family office and wealth management opportunity",
            "IP Strategy: 12+ patents covering core innovations",
            "Business Model: Platform licensing and service marketplace",
            "Investment: Funding requirements and growth projections"
          ]
        },
        attorneyInstructions: {
          filingStrategy: "File provisional patent application within 30 days",
          priorityClaims: "Focus on multi-persona system and SWAG algorithm",
          internationalFiling: "Consider PCT filing for global protection",
          trademarkRegistrations: "Family Office Platform™, SWAG™, BFO™",
          continuationApplications: "Separate filings for vault and compliance systems"
        }
      };

      // Create and download the package
      const blob = new Blob([JSON.stringify(comprehensivePackage, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Family-Office-Platform-Patent-Filing-Package-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportProgress(100);
      toast.success("Complete patent filing package exported successfully!");
      
    } catch (error) {
      toast.error("Error exporting package");
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(0), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gold font-playfair flex items-center gap-2">
            <Scale className="h-6 w-6" />
            Comprehensive Patent Filing Package
          </h2>
          <p className="text-muted-foreground">Attorney and investor-ready documentation with all supporting materials</p>
          <div className="flex gap-2 mt-2">
            <Badge className="bg-amber-500/10 text-amber-700 border-amber-200">
              <Shield className="h-3 w-3 mr-1" />
              PATENT PENDING
            </Badge>
            <Badge className="bg-red-500/10 text-red-700 border-red-200">
              <Lock className="h-3 w-3 mr-1" />
              CONFIDENTIAL
            </Badge>
            <Badge className="bg-purple-500/10 text-purple-700 border-purple-200">
              <Briefcase className="h-3 w-3 mr-1" />
              ATTORNEY READY
            </Badge>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {isExporting && (
            <div className="w-64">
              <Progress value={exportProgress} className="mb-2" />
              <p className="text-xs text-muted-foreground text-center">
                Exporting... {Math.round(exportProgress)}%
              </p>
            </div>
          )}
          <Button 
            onClick={exportComprehensivePackage} 
            disabled={isExporting}
            className="bg-gold hover:bg-gold/90 text-deep-blue"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Complete Package
          </Button>
        </div>
      </div>

      {/* Package Summary */}
      <Card className="bg-gradient-to-br from-background to-gold/5 border-gold/20">
        <CardHeader>
          <CardTitle className="text-xl text-gold font-playfair flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Package Contents Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">{detailedClaims.length}</div>
              <div className="text-sm text-muted-foreground">Patent Claims</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{workflowDiagrams.length}</div>
              <div className="text-sm text-muted-foreground">Technical Diagrams</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{ipLogEntries.length}</div>
              <div className="text-sm text-muted-foreground">IP Log Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">15+</div>
              <div className="text-sm text-muted-foreground">Supporting Documents</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Claims</TabsTrigger>
          <TabsTrigger value="diagrams">Diagrams</TabsTrigger>
          <TabsTrigger value="timeline">IP Timeline</TabsTrigger>
          <TabsTrigger value="assets">Design Assets</TabsTrigger>
          <TabsTrigger value="legal">Legal Docs</TabsTrigger>
          <TabsTrigger value="presentation">Presentation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {detailedClaims.map((claim, index) => (
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
                  <p className="text-sm text-muted-foreground">{claim.summary}</p>
                  
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
                    <h4 className="text-sm font-semibold mb-2">Prior Art Differentiation:</h4>
                    <ul className="space-y-1">
                      {claim.priorArtDifferentiation.map((diff, idx) => (
                        <li key={idx} className="text-sm text-emerald-700 flex items-start gap-2">
                          <span className="text-emerald-500">✓</span>
                          {diff}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="diagrams" className="space-y-4">
          <div className="grid gap-4">
            {workflowDiagrams.map((diagram, index) => (
              <Card key={index} className="bg-gradient-to-br from-background to-blue-500/5 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    {diagram.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{diagram.description}</p>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-2">System Components:</h4>
                    <div className="flex flex-wrap gap-2">
                      {diagram.components.map((component, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {component}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Patentable Elements:</h4>
                    <ul className="space-y-1">
                      {diagram.patentableElements.map((element, idx) => (
                        <li key={idx} className="text-sm text-blue-700 flex items-start gap-2">
                          <span className="text-blue-500">◆</span>
                          {element}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Technical Specifications:</h4>
                    <ul className="space-y-1">
                      {diagram.technicalSpecs.map((spec, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-gray-400">→</span>
                          {spec}
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
            {ipLogEntries.map((entry, index) => (
              <Card key={index} className="bg-gradient-to-br from-background to-purple-500/5 border-purple-500/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold text-purple-700 flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {entry.milestone}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{entry.date}</p>
                    </div>
                    <Badge variant="outline" className="text-purple-700 border-purple-200">
                      <Camera className="h-3 w-3 mr-1" />
                      DOCUMENTED
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{entry.description}</p>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Inventors:</h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.inventors.map((inventor, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {inventor}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Documentation:</h4>
                    <ul className="space-y-1">
                      {entry.documentation.map((doc, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                          <FileText className="h-3 w-3" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Visual Evidence:</h4>
                    <ul className="space-y-1">
                      {entry.screenshots.map((screenshot, idx) => (
                        <li key={idx} className="text-xs text-purple-700 flex items-center gap-2">
                          <Image className="h-3 w-3" />
                          {screenshot}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Patent Pending Badges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Horizontal Badge (300x60px):</h4>
                  <div className="bg-gray-100 p-4 rounded border">
                    <div className="w-fit bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-3 rounded text-blue-900 font-bold text-center border-2 border-yellow-700">
                      <div>PATENT PENDING</div>
                      <div className="text-xs">Family Office Platform™</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Vertical Badge (120x200px):</h4>
                  <div className="bg-gray-100 p-4 rounded border">
                    <div className="w-fit bg-gradient-to-b from-yellow-400 to-yellow-600 px-4 py-8 rounded text-blue-900 font-bold text-center border-2 border-yellow-700">
                      <div className="text-sm">PATENT</div>
                      <div className="text-sm">PENDING</div>
                      <div className="text-xs mt-4 transform rotate-180" style={{writingMode: 'vertical-rl'}}>
                        Family Office Platform™
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Visual Asset Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <FileImage className="h-4 w-4 text-blue-500" />
                    High-resolution screenshots of all major platform interfaces
                  </li>
                  <li className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-emerald-500" />
                    System architecture diagrams in vector format
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    User flow wireframes for each persona type
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gold" />
                    SWAG™ scoring interface visualizations
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-red-500" />
                    Vault interface and trigger mechanism diagrams
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="legal" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Employee NDA Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded border text-sm font-mono whitespace-pre-wrap">
                  {generateNDAForms().employeeNDA.substring(0, 500)}...
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Full NDA template included in export package
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Partner NDA Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded border text-sm font-mono whitespace-pre-wrap">
                  {generateNDAForms().partnerNDA.substring(0, 500)}...
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Full mutual NDA template included in export package
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="presentation" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Demo Video Script
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded border text-sm whitespace-pre-wrap">
                  {demoVideoScript.substring(0, 1000)}...
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Complete 5-minute demo script included in export package
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Presentation className="h-5 w-5" />
                  Investor Presentation Outline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-gold text-white rounded-full text-xs flex items-center justify-center">1</span>
                    Innovation Overview & Patent Portfolio
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center">2</span>
                    Market Opportunity & Problem Statement
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-emerald-500 text-white rounded-full text-xs flex items-center justify-center">3</span>
                    Technical Differentiation & Competitive Advantage
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-500 text-white rounded-full text-xs flex items-center justify-center">4</span>
                    Business Model & Revenue Projections
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">5</span>
                    Investment Requirements & Growth Strategy
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Shield } from 'lucide-react';

export function PatentClaimDrafts() {
  const patentClaims = [
    {
      innovation: "Family Legacy Vault™",
      title: "Multi-Generational Digital Asset and Message Preservation System",
      claims: [
        {
          number: 1,
          type: "System Claim",
          text: "A computer-implemented system for multi-generational digital asset preservation and secure message delivery, comprising: a secure digital vault configured to store financial documents, personal messages, and multimedia content; a time-based message delivery engine that triggers release of stored content based on predetermined life events, anniversaries, or temporal conditions; an encryption layer that maintains data integrity across generational transfers; and a family tree mapping interface that enables selective content sharing based on familial relationships and predetermined access hierarchies."
        },
        {
          number: 2,
          type: "Method Claim",
          text: "A method for automated multi-generational wealth preservation comprising: receiving and encrypting family legacy content including financial documents, personal messages, and multimedia files; establishing time-based delivery triggers linked to family member life events; maintaining a secure family relationship graph that defines content access permissions; automatically delivering stored content to designated family members upon trigger event occurrence; and providing audit trails for all content access and delivery activities."
        },
        {
          number: 3,
          type: "UI/Process Claim",
          text: "A user interface system for family legacy management comprising: an intuitive content upload interface enabling drag-and-drop submission of legacy materials; a family tree visualization tool for defining content access relationships; a message scheduling interface allowing users to pre-compose messages for future delivery; and real-time notification systems that alert family members when legacy content becomes available."
        }
      ]
    },
    {
      innovation: "SWAG Lead Score™",
      title: "Proprietary Wealth Assessment and Lead Scoring Algorithm",
      claims: [
        {
          number: 1,
          type: "Algorithm Claim",
          text: "A computer-implemented wealth assessment system comprising: an integrated data aggregation engine that collects financial data from multiple sources including bank accounts, investment portfolios, and property records; a proprietary scoring algorithm that weights financial indicators based on liquidity, growth potential, and wealth sustainability metrics; a dynamic risk assessment module that adjusts scoring based on market conditions and individual client factors; and an automated lead qualification system that routes prospects to appropriate wealth management services based on calculated SWAG scores."
        },
        {
          number: 2,
          type: "Method Claim",
          text: "A method for automated wealth prospect qualification comprising: aggregating financial data from connected accounts and external databases; applying a proprietary weighted scoring algorithm that considers liquid assets, investment diversity, real estate holdings, and income stability; generating a composite SWAG score that predicts wealth management service needs; automatically categorizing prospects into service tiers (Gold, Silver, Bronze) based on score ranges; and triggering appropriate advisor assignment and onboarding workflows."
        },
        {
          number: 3,
          type: "System Integration Claim",
          text: "An integrated prospect management system comprising: API integrations with financial institutions for real-time account data; a machine learning engine that continuously refines scoring accuracy based on conversion outcomes; automated advisor matching based on SWAG score compatibility and advisor specialization; and dynamic dashboard updates that provide real-time prospect intelligence to wealth management teams."
        }
      ]
    },
    {
      innovation: "Integrated Advisor Onboarding Engine",
      title: "Automated Multi-Role Professional Onboarding and Compliance System",
      claims: [
        {
          number: 1,
          type: "System Claim",
          text: "A computer-implemented professional onboarding system comprising: a multi-role detection engine that identifies user types (advisor, attorney, accountant, client) and applies appropriate onboarding workflows; an automated document collection system that gathers required compliance materials based on role and jurisdiction; a dynamic form generation engine that customizes onboarding forms based on professional licensing requirements; and an integrated e-signature platform that streamlines document execution and regulatory compliance."
        },
        {
          number: 2,
          type: "Compliance Method Claim",
          text: "A method for automated regulatory compliance management comprising: detecting user professional role and applicable regulatory jurisdictions; dynamically generating compliance checklists and required documentation based on role-specific regulations; monitoring compliance status in real-time and triggering alerts for missing or expired requirements; and maintaining audit trails for all compliance activities to support regulatory examinations."
        },
        {
          number: 3,
          type: "Workflow Automation Claim",
          text: "An automated professional workflow system comprising: intelligent role-based routing that directs users through appropriate onboarding sequences; progressive disclosure interfaces that reveal additional requirements based on user responses; automated verification of professional credentials through third-party databases; and seamless integration with practice management tools and CRM systems."
        }
      ]
    },
    {
      innovation: "Linda Voice AI Assistant",
      title: "Intelligent Voice-Based Meeting Management and Client Interaction System",
      claims: [
        {
          number: 1,
          type: "AI System Claim",
          text: "An intelligent voice-based assistant system comprising: a natural language processing engine configured to understand financial services terminology and client requests; an automated meeting scheduling system that integrates with calendar applications and sends confirmations via voice and text; a client interaction module that provides personalized responses based on client portfolio and service history; and a voice synthesis engine that delivers consistent, professional audio communications."
        },
        {
          number: 2,
          type: "Integration Method Claim",
          text: "A method for voice-integrated wealth management comprising: receiving voice commands from clients regarding meeting scheduling, account inquiries, and service requests; processing natural language inputs through financial services-trained AI models; automatically executing approved actions including meeting scheduling, document delivery, and status updates; and providing voice-based confirmations and follow-up communications."
        },
        {
          number: 3,
          type: "Communication System Claim",
          text: "A voice-enabled client communication system comprising: intelligent call routing based on client priority and advisor availability; automated meeting reminders and confirmations delivered via preferred communication channels; real-time language translation for multi-lingual client support; and conversation analytics that track client satisfaction and engagement metrics."
        }
      ]
    },
    {
      innovation: "Real-Time Multi-Role Compliance Management",
      title: "Dynamic Regulatory Compliance Monitoring and Enforcement System",
      claims: [
        {
          number: 1,
          type: "Monitoring System Claim",
          text: "A computer-implemented compliance monitoring system comprising: a real-time regulatory database that tracks changing compliance requirements across multiple jurisdictions; a multi-role permission engine that enforces access controls based on professional licensing and regulatory status; an automated alert system that notifies relevant parties of compliance deadline approaches and requirement changes; and a comprehensive audit trail system that maintains immutable records of all compliance-related activities."
        },
        {
          number: 2,
          type: "Enforcement Method Claim",
          text: "A method for automated compliance enforcement comprising: continuously monitoring user activities against applicable regulatory requirements; automatically restricting access to features or data when compliance status becomes inadequate; generating compliance reports and documentation required for regulatory submissions; and maintaining real-time compliance dashboards for management oversight."
        },
        {
          number: 3,
          type: "Multi-Jurisdiction System Claim",
          text: "A cross-jurisdictional compliance management system comprising: automated detection of applicable regulatory frameworks based on user location and business activities; dynamic rule engines that apply jurisdiction-specific compliance requirements; automated notification systems that alert users to regulatory changes affecting their practice; and integrated reporting tools that generate jurisdiction-appropriate compliance documentation."
        }
      ]
    },
    {
      innovation: "Integrated Family Office Marketplace",
      title: "Professional Services Matching and Quality Management Platform",
      claims: [
        {
          number: 1,
          type: "Marketplace System Claim",
          text: "A computer-implemented professional services marketplace comprising: a multi-dimensional matching engine that pairs family office clients with qualified professionals based on specialization, experience, and availability; a dynamic quality scoring system that evaluates professional performance based on client feedback, regulatory compliance, and service delivery metrics; an integrated billing and payment system that facilitates transparent fee structures and automated payments; and a comprehensive review system that maintains service quality standards."
        },
        {
          number: 2,
          type: "Matching Algorithm Claim",
          text: "A method for automated professional-client matching comprising: analyzing client service requirements including asset size, complexity, and geographic location; evaluating professional qualifications including certifications, experience, and specialization areas; applying a proprietary matching algorithm that considers compatibility factors, availability, and performance history; and automatically recommending optimal professional matches with confidence scoring."
        },
        {
          number: 3,
          type: "Quality Management Claim",
          text: "A professional services quality management system comprising: automated collection of client feedback and satisfaction metrics; real-time monitoring of professional compliance status and regulatory standing; dynamic ranking algorithms that adjust professional visibility based on performance indicators; and automated quality assurance workflows that ensure service standards maintenance."
        }
      ]
    }
  ];

  const handleExportClaims = (innovation: string) => {
    const claimData = patentClaims.find(p => p.innovation === innovation);
    if (claimData) {
      const exportContent = {
        innovation: claimData.innovation,
        title: claimData.title,
        claims: claimData.claims,
        exportDate: new Date().toISOString(),
        platform: "BFO Family Office Platform"
      };
      
      console.log(`Exporting patent claims for ${innovation}:`, exportContent);
    }
  };

  const handleExportAllClaims = () => {
    const allClaims = {
      platform: "BFO Family Office Platform",
      exportDate: new Date().toISOString(),
      totalInnovations: patentClaims.length,
      totalClaims: patentClaims.reduce((acc, p) => acc + p.claims.length, 0),
      claims: patentClaims
    };
    
    console.log("Exporting all patent claims:", allClaims);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Patent Claim Drafts</h2>
          <p className="text-muted-foreground">
            Sample patent claims for core BFO Platform innovations
          </p>
        </div>
        <Button onClick={handleExportAllClaims} className="bg-gradient-to-r from-blue-500 to-blue-600">
          <Download className="h-4 w-4 mr-2" />
          Export All Claims
        </Button>
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-blue-600" />
            <div>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 mb-2">
                USPTO Ready Format
              </Badge>
              <p className="text-sm text-blue-700">
                Patent claims drafted in USPTO-compliant format. Ready for attorney review and filing preparation.
                Each innovation includes system, method, and integration claims for comprehensive protection.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {patentClaims.map((patent, index) => (
          <Card key={index} className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2">{patent.innovation}</CardTitle>
                  <p className="text-lg font-medium text-muted-foreground">{patent.title}</p>
                  <Badge variant="secondary" className="mt-2">
                    {patent.claims.length} Claims
                  </Badge>
                </div>
                <Button onClick={() => handleExportClaims(patent.innovation)} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patent.claims.map((claim, claimIndex) => (
                  <div key={claimIndex} className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-4 w-4" />
                      <span className="font-semibold">Claim {claim.number}</span>
                      <Badge variant="outline" className="text-xs">
                        {claim.type}
                      </Badge>
                    </div>
                    <p className="text-sm leading-relaxed text-justify">
                      {claim.text}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{patentClaims.length}</div>
              <div className="text-sm text-muted-foreground">Core Innovations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {patentClaims.reduce((acc, p) => acc + p.claims.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Claims</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">USPTO Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Ready</div>
              <div className="text-sm text-muted-foreground">For Attorney Review</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
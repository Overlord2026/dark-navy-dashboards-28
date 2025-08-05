import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Shield, Users } from 'lucide-react';

export function LegalTemplates() {
  const templates = [
    {
      category: "Non-Disclosure Agreements (NDAs)",
      description: "Comprehensive NDA templates for all stakeholder types",
      templates: [
        {
          name: "Employee IP Protection NDA",
          description: "Standard NDA for employees with access to proprietary technology",
          scope: "Full-time employees, contractors, interns",
          keyTerms: ["Confidential Information", "IP Assignment", "Non-Compete", "Duration: Employment + 2 years"],
          format: "PDF, DOC, Legal Plain Text"
        },
        {
          name: "Partner/Vendor NDA",
          description: "Mutual NDA for business partners and service providers",
          scope: "Technology partners, service vendors, consultants",
          keyTerms: ["Mutual Confidentiality", "Limited Use", "Return of Materials", "Duration: 3 years"],
          format: "PDF, DOC, Legal Plain Text"
        },
        {
          name: "Investor/Advisory NDA",
          description: "Investor-focused NDA for funding and advisory discussions",
          scope: "Potential investors, advisors, board members",
          keyTerms: ["Investment Discussions", "Proprietary Technology", "Market Information", "Duration: 5 years"],
          format: "PDF, DOC, Legal Plain Text"
        }
      ]
    },
    {
      category: "Employee IP Onboarding",
      description: "Training materials and acknowledgment forms for IP protection",
      templates: [
        {
          name: "IP Awareness Training Script",
          description: "Comprehensive training presentation on patent pending technology",
          scope: "All new employees, existing staff refresher",
          keyTerms: ["Patent Pending Features", "Confidentiality Requirements", "Proper Disclosure", "Violation Consequences"],
          format: "PowerPoint, PDF, Speaker Notes"
        },
        {
          name: "IP Acknowledgment Form",
          description: "Employee acknowledgment of patent pending technology access",
          scope: "Employees with access to proprietary features",
          keyTerms: ["Technology Understanding", "Confidentiality Agreement", "Proper Use", "Reporting Requirements"],
          format: "PDF Form, Digital Signature Ready"
        },
        {
          name: "Invention Disclosure Process",
          description: "Guidelines for employees to disclose new inventions",
          scope: "Development team, product managers, designers",
          keyTerms: ["Disclosure Requirements", "Documentation Process", "Evaluation Criteria", "Reward Programs"],
          format: "Process Document, Form Templates"
        }
      ]
    },
    {
      category: "Compliance and Legal Notices",
      description: "Standardized legal language for various applications",
      templates: [
        {
          name: "Website/App Legal Footer",
          description: "Comprehensive patent pending notice for digital platforms",
          scope: "Website footer, app about pages, legal sections",
          keyTerms: ["Patent Pending Status", "Technology Claims", "Usage Restrictions", "Contact Information"],
          format: "HTML, CSS, Plain Text, JSON"
        },
        {
          name: "Marketing Materials Disclaimer",
          description: "Patent pending language for marketing and sales materials",
          scope: "Brochures, presentations, sales decks, website content",
          keyTerms: ["Patent Pending Technology", "Competitive Advantage", "Innovation Claims", "Legal Protection"],
          format: "PDF, DOC, InDesign, Plain Text"
        },
        {
          name: "API Documentation Legal Notice",
          description: "Legal notice for API documentation and developer resources",
          scope: "Developer documentation, API guides, technical resources",
          keyTerms: ["API Usage Rights", "Technology Licensing", "Developer Restrictions", "Patent Claims"],
          format: "Markdown, HTML, PDF, Plain Text"
        }
      ]
    },
    {
      category: "Client and User Agreements",
      description: "User-facing agreements and terms of service updates",
      templates: [
        {
          name: "Terms of Service Patent Clause",
          description: "Patent pending clause for terms of service agreements",
          scope: "All platform users, family offices, advisors",
          keyTerms: ["Patent Pending Technology", "User Rights", "Usage Restrictions", "IP Protection"],
          format: "Legal Document, Plain Text, HTML"
        },
        {
          name: "Client Onboarding IP Notice",
          description: "Notice for clients about patent pending technology benefits",
          scope: "New client onboarding, feature introductions",
          keyTerms: ["Innovation Benefits", "Proprietary Advantages", "Technology Leadership", "Continuous Development"],
          format: "PDF, Email Template, Presentation"
        },
        {
          name: "Privacy Policy Patent Section",
          description: "Privacy policy updates related to patent pending features",
          scope: "All users accessing patent pending features",
          keyTerms: ["Data Protection", "Feature Privacy", "Innovation Security", "User Rights"],
          format: "Legal Document, HTML, Plain Text"
        }
      ]
    }
  ];

  const legalLanguageLibrary = {
    patentPendingNotices: [
      {
        context: "General Website/App",
        text: "This platform incorporates proprietary technology protected under U.S. patent applications. Unauthorized use, reproduction, or reverse engineering is prohibited."
      },
      {
        context: "Feature-Specific",
        text: "The [Feature Name]™ contains patent pending technology. This innovative solution is protected under U.S. patent application and represents proprietary intellectual property."
      },
      {
        context: "Marketing/Sales",
        text: "Our patent pending technology delivers competitive advantages through innovative solutions protected under U.S. patent applications."
      },
      {
        context: "Developer/API",
        text: "Use of this API grants limited access to patent pending technology. Commercial use restrictions apply. See licensing terms for details."
      }
    ],
    complianceStatements: [
      {
        purpose: "Employee Training",
        text: "All employees must maintain strict confidentiality regarding patent pending technology. Unauthorized disclosure may result in termination and legal action."
      },
      {
        purpose: "Partner Agreements",
        text: "Partner access to patent pending features requires execution of appropriate confidentiality agreements and IP protection protocols."
      },
      {
        purpose: "Client Communications",
        text: "Our patent pending technology ensures your data and workflows benefit from the latest innovations in family office management."
      }
    ]
  };

  const handleExportTemplate = (categoryName: string, templateName: string) => {
    console.log(`Exporting template: ${categoryName} - ${templateName}`);
  };

  const handleExportAllTemplates = () => {
    const exportData = {
      platform: "BFO Family Office Platform",
      exportDate: new Date().toISOString(),
      legalTemplates: templates,
      legalLanguageLibrary,
      totalTemplates: templates.reduce((acc, cat) => acc + cat.templates.length, 0),
      complianceReady: true
    };
    
    console.log("Exporting all legal templates:", exportData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Legal Templates & Compliance Materials</h2>
          <p className="text-muted-foreground">
            Comprehensive legal templates for IP protection and team onboarding
          </p>
        </div>
        <Button onClick={handleExportAllTemplates} className="bg-gradient-to-r from-red-500 to-red-600">
          <Download className="h-4 w-4 mr-2" />
          Export All Templates
        </Button>
      </div>

      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-red-600" />
            <div>
              <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 mb-2">
                Legal Review Required
              </Badge>
              <p className="text-sm text-red-700">
                All templates require review by qualified legal counsel before implementation.
                These materials are drafts and should be customized for specific jurisdictions and use cases.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Legal Language Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Patent Pending Notices</h4>
              <div className="space-y-2">
                {legalLanguageLibrary.patentPendingNotices.map((notice, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-muted/30">
                    <Badge variant="outline" className="text-xs mb-2">
                      {notice.context}
                    </Badge>
                    <p className="text-sm italic">"{notice.text}"</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Compliance Statements</h4>
              <div className="space-y-2">
                {legalLanguageLibrary.complianceStatements.map((statement, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-muted/30">
                    <Badge variant="outline" className="text-xs mb-2">
                      {statement.purpose}
                    </Badge>
                    <p className="text-sm italic">"{statement.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {templates.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2">{category.category}</CardTitle>
                  <p className="text-muted-foreground">{category.description}</p>
                  <Badge variant="secondary" className="mt-2">
                    {category.templates.length} Templates
                  </Badge>
                </div>
                <Button 
                  onClick={() => handleExportTemplate(category.category, "All")} 
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.templates.map((template, templateIndex) => (
                  <Card key={templateIndex} className="border border-border/50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4" />
                            <span className="font-semibold">{template.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {template.description}
                          </p>
                        </div>
                        <Button 
                          onClick={() => handleExportTemplate(category.category, template.name)}
                          size="sm" 
                          variant="outline"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium">Scope:</span>
                          <p className="text-xs text-muted-foreground">{template.scope}</p>
                        </div>
                        
                        <div>
                          <span className="text-xs font-medium">Key Terms:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {template.keyTerms.map((term, termIndex) => (
                              <Badge key={termIndex} variant="outline" className="text-xs">
                                {term}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-xs font-medium">Available Formats:</span>
                          <p className="text-xs text-muted-foreground">{template.format}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Implementation Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="legal-review" className="rounded" />
              <label htmlFor="legal-review" className="text-sm">
                Have all templates reviewed by qualified legal counsel
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="customize" className="rounded" />
              <label htmlFor="customize" className="text-sm">
                Customize templates for specific jurisdictions and business needs
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="train-hr" className="rounded" />
              <label htmlFor="train-hr" className="text-sm">
                Train HR and management teams on proper template usage
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="implement" className="rounded" />
              <label htmlFor="implement" className="text-sm">
                Implement templates in onboarding and operational processes
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="monitor" className="rounded" />
              <label htmlFor="monitor" className="text-sm">
                Establish monitoring and compliance tracking procedures
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="update" className="rounded" />
              <label htmlFor="update" className="text-sm">
                Schedule regular reviews and updates of legal materials
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Export Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{templates.length}</div>
              <div className="text-sm text-muted-foreground">Template Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {templates.reduce((acc, cat) => acc + cat.templates.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Templates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {legalLanguageLibrary.patentPendingNotices.length + legalLanguageLibrary.complianceStatements.length}
              </div>
              <div className="text-sm text-muted-foreground">Legal Clauses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Ready</div>
              <div className="text-sm text-muted-foreground">For Legal Review</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
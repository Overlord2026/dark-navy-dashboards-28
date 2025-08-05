import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, Image, Layers } from 'lucide-react';

export function UIWireframeExports() {
  const wireframeComponents = [
    {
      feature: "Family Legacy Vault™",
      description: "Multi-generational message and document storage interface",
      wireframes: [
        {
          name: "Vault Dashboard",
          type: "Main Interface",
          description: "Primary vault interface with family tree navigation and content organization",
          formats: ["PDF Export", "Figma Link", "PNG Screenshots"]
        },
        {
          name: "Message Composer",
          type: "Input Flow",
          description: "Interface for creating time-delayed messages and setting delivery triggers",
          formats: ["PDF Export", "Interactive Prototype", "Flow Diagram"]
        },
        {
          name: "Content Timeline",
          type: "Visualization",
          description: "Timeline view of scheduled message deliveries and content access",
          formats: ["PDF Export", "Figma Components", "Interactive Demo"]
        }
      ]
    },
    {
      feature: "SWAG Lead Score™ Dashboard",
      description: "Proprietary wealth assessment and lead qualification interface",
      wireframes: [
        {
          name: "Score Calculation Interface",
          type: "Algorithm Visualization",
          description: "Real-time wealth scoring with factor breakdown and confidence indicators",
          formats: ["PDF Export", "Figma Design System", "Component Library"]
        },
        {
          name: "Lead Qualification Flow",
          type: "Process Flow",
          description: "Step-by-step prospect qualification with automated tier assignment",
          formats: ["PDF Export", "Flow Diagram", "User Journey Map"]
        },
        {
          name: "Advisor Assignment Panel",
          type: "Management Interface",
          description: "Automated advisor matching based on SWAG score and specialization",
          formats: ["PDF Export", "Figma Prototype", "Interaction Specs"]
        }
      ]
    },
    {
      feature: "Integrated Advisor Onboarding",
      description: "Multi-role professional onboarding and compliance automation",
      wireframes: [
        {
          name: "Role Detection Interface",
          type: "Onboarding Flow",
          description: "Automated role identification and customized onboarding path selection",
          formats: ["PDF Export", "Figma Flow", "Decision Tree Diagram"]
        },
        {
          name: "Compliance Document Collector",
          type: "Form System",
          description: "Dynamic form generation based on professional role and jurisdiction",
          formats: ["PDF Export", "Form Templates", "Validation Rules"]
        },
        {
          name: "Progress Tracking Dashboard",
          type: "Status Interface",
          description: "Real-time onboarding progress with compliance status indicators",
          formats: ["PDF Export", "Dashboard Mockups", "State Diagrams"]
        }
      ]
    },
    {
      feature: "Linda Voice AI Interface",
      description: "Voice-enabled meeting management and client interaction system",
      wireframes: [
        {
          name: "Voice Command Interface",
          type: "Audio UI",
          description: "Voice interaction controls with visual feedback and command recognition",
          formats: ["PDF Export", "Audio UI Specs", "Interaction Patterns"]
        },
        {
          name: "Meeting Scheduler Integration",
          type: "Calendar Interface",
          description: "Voice-activated meeting scheduling with calendar integration",
          formats: ["PDF Export", "Calendar Mockups", "Integration Flows"]
        },
        {
          name: "Client Communication Hub",
          type: "Communication Interface",
          description: "Voice and text communication management with AI assistance",
          formats: ["PDF Export", "Communication Flows", "AI Interaction Specs"]
        }
      ]
    },
    {
      feature: "Compliance Management Center",
      description: "Real-time multi-role regulatory compliance monitoring",
      wireframes: [
        {
          name: "Compliance Dashboard",
          type: "Monitoring Interface",
          description: "Real-time compliance status across multiple roles and jurisdictions",
          formats: ["PDF Export", "Dashboard Design", "Alert System UI"]
        },
        {
          name: "Regulatory Update Feed",
          type: "Information Interface",
          description: "Automated regulatory change notifications with impact assessment",
          formats: ["PDF Export", "Feed Design", "Notification Patterns"]
        },
        {
          name: "Audit Trail Viewer",
          type: "Reporting Interface",
          description: "Comprehensive audit trail with search and export capabilities",
          formats: ["PDF Export", "Report Templates", "Data Visualization"]
        }
      ]
    },
    {
      feature: "Family Office Marketplace",
      description: "Professional services matching and quality management platform",
      wireframes: [
        {
          name: "Professional Matching Interface",
          type: "Marketplace UI",
          description: "AI-powered professional matching with compatibility scoring",
          formats: ["PDF Export", "Marketplace Design", "Matching Algorithm UI"]
        },
        {
          name: "Quality Rating System",
          type: "Review Interface",
          description: "Professional quality scoring with client feedback integration",
          formats: ["PDF Export", "Rating UI Components", "Feedback Forms"]
        },
        {
          name: "Service Delivery Tracking",
          type: "Project Management",
          description: "Service delivery monitoring with quality assurance workflows",
          formats: ["PDF Export", "Project UI", "Workflow Diagrams"]
        }
      ]
    }
  ];

  const figmaLinks = [
    {
      name: "BFO Design System",
      url: "https://figma.com/bfo-design-system",
      description: "Complete design system with components, tokens, and guidelines"
    },
    {
      name: "Core User Flows",
      url: "https://figma.com/bfo-user-flows",
      description: "Comprehensive user journey maps and interaction flows"
    },
    {
      name: "UI Component Library",
      url: "https://figma.com/bfo-components",
      description: "Reusable UI components and interface patterns"
    }
  ];

  const handleExportWireframes = (feature: string) => {
    const wireframeData = wireframeComponents.find(w => w.feature === feature);
    if (wireframeData) {
      console.log(`Exporting wireframes for ${feature}:`, wireframeData);
    }
  };

  const handleExportAllWireframes = () => {
    const exportData = {
      platform: "BFO Family Office Platform",
      exportDate: new Date().toISOString(),
      features: wireframeComponents.length,
      totalWireframes: wireframeComponents.reduce((acc, f) => acc + f.wireframes.length, 0),
      figmaLinks,
      wireframes: wireframeComponents
    };
    
    console.log("Exporting all UI wireframes:", exportData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">UI/UX Wireframe Exports</h2>
          <p className="text-muted-foreground">
            Interface designs and user flows for all patentable features
          </p>
        </div>
        <Button onClick={handleExportAllWireframes} className="bg-gradient-to-r from-purple-500 to-purple-600">
          <Download className="h-4 w-4 mr-2" />
          Export All Wireframes
        </Button>
      </div>

      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Layers className="h-5 w-5 text-purple-600" />
            <div>
              <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300 mb-2">
                Attorney Review Ready
              </Badge>
              <p className="text-sm text-purple-700">
                UI/UX wireframes exported in multiple formats for comprehensive patent documentation.
                Includes Figma links, PDF exports, and interactive prototypes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Figma Design Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {figmaLinks.map((link, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <h4 className="font-medium mb-1">{link.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">{link.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open in Figma
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {wireframeComponents.map((component, index) => (
          <Card key={index} className="border-l-4 border-l-purple-500">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2">{component.feature}</CardTitle>
                  <p className="text-muted-foreground">{component.description}</p>
                  <Badge variant="secondary" className="mt-2">
                    {component.wireframes.length} Wireframes
                  </Badge>
                </div>
                <Button onClick={() => handleExportWireframes(component.feature)} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {component.wireframes.map((wireframe, wireframeIndex) => (
                  <Card key={wireframeIndex} className="border border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Image className="h-4 w-4" />
                        <span className="font-semibold text-sm">{wireframe.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs mb-2">
                        {wireframe.type}
                      </Badge>
                      <p className="text-xs text-muted-foreground mb-3">
                        {wireframe.description}
                      </p>
                      <div className="space-y-1">
                        {wireframe.formats.map((format, formatIndex) => (
                          <div key={formatIndex} className="text-xs text-muted-foreground flex items-center gap-1">
                            <div className="w-1 h-1 bg-current rounded-full"></div>
                            {format}
                          </div>
                        ))}
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
          <CardTitle>Wireframe Export Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{wireframeComponents.length}</div>
              <div className="text-sm text-muted-foreground">Core Features</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {wireframeComponents.reduce((acc, f) => acc + f.wireframes.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Wireframes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Export Formats</div>
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
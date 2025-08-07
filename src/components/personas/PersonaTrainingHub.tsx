import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  Play,
  CheckCircle,
  Clock,
  Users,
  Smartphone,
  Monitor,
  Crown,
  Target,
  Award,
  Lightbulb
} from "lucide-react";

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'pdf' | 'interactive';
  completed: boolean;
  premium: boolean;
}

interface PersonaTraining {
  persona: string;
  icon: string;
  color: string;
  completionRate: number;
  modules: TrainingModule[];
}

const personaTrainingData: PersonaTraining[] = [
  {
    persona: "Advisors/RIAs",
    icon: "📊",
    color: "blue",
    completionRate: 75,
    modules: [
      {
        id: "advisor-1",
        title: "Getting Started with Your Advisor Dashboard",
        description: "Complete setup and navigation overview",
        duration: "15 min",
        type: "video",
        completed: true,
        premium: false
      },
      {
        id: "advisor-2", 
        title: "Client Onboarding Magic Links",
        description: "Streamline client onboarding with automated invitations",
        duration: "12 min",
        type: "video",
        completed: true,
        premium: false
      },
      {
        id: "advisor-3",
        title: "Portfolio Risk Analysis Setup",
        description: "Configure portfolio tracking and risk analysis tools",
        duration: "20 min",
        type: "interactive",
        completed: false,
        premium: false
      },
      {
        id: "advisor-4",
        title: "CE/ADV Automation (Premium)",
        description: "Automate continuing education and ADV filing management",
        duration: "18 min",
        type: "video",
        completed: false,
        premium: true
      },
      {
        id: "advisor-5",
        title: "Lead to Sales Engine Mastery (Premium)",
        description: "Convert prospects into clients with advanced CRM tools",
        duration: "25 min",
        type: "interactive",
        completed: false,
        premium: true
      },
      {
        id: "advisor-6",
        title: "AI Copilot & Meeting Analytics (Premium)",
        description: "Leverage AI for meeting insights and client analytics",
        duration: "22 min",
        type: "video",
        completed: false,
        premium: true
      }
    ]
  },
  {
    persona: "Accountants/CPAs",
    icon: "🧮",
    color: "green",
    completionRate: 60,
    modules: [
      {
        id: "cpa-1",
        title: "CPA Practice Dashboard Overview",
        description: "Navigate your accounting practice management tools",
        duration: "14 min",
        type: "video",
        completed: true,
        premium: false
      },
      {
        id: "cpa-2",
        title: "Secure Document Vault Setup",
        description: "Organize client documents with security and compliance",
        duration: "16 min",
        type: "interactive",
        completed: true,
        premium: false
      },
      {
        id: "cpa-3",
        title: "Tax Planning Calculators",
        description: "Use built-in tax planning and calculation tools",
        duration: "18 min",
        type: "video",
        completed: false,
        premium: false
      },
      {
        id: "cpa-4",
        title: "AI Tax Scanning (Premium)",
        description: "Automate document processing with AI-powered scanning",
        duration: "20 min",
        type: "video",
        completed: false,
        premium: true
      },
      {
        id: "cpa-5",
        title: "QuickBooks & Gusto Integration (Premium)",
        description: "Connect and sync with popular accounting software",
        duration: "15 min",
        type: "interactive",
        completed: false,
        premium: true
      }
    ]
  },
  {
    persona: "Attorneys/Legal",
    icon: "⚖️",
    color: "purple",
    completionRate: 45,
    modules: [
      {
        id: "attorney-1",
        title: "Legal Practice Management Setup",
        description: "Configure your attorney dashboard and case management",
        duration: "17 min",
        type: "video",
        completed: true,
        premium: false
      },
      {
        id: "attorney-2",
        title: "Contract & Document Library",
        description: "Organize legal documents and contract templates",
        duration: "13 min",
        type: "interactive",
        completed: false,
        premium: false
      },
      {
        id: "attorney-3",
        title: "CLE Tracking & Alerts",
        description: "Stay compliant with continuing legal education requirements",
        duration: "11 min",
        type: "video",
        completed: false,
        premium: false
      },
      {
        id: "attorney-4",
        title: "Advanced Workflow Automation (Premium)",
        description: "Automate case workflows and document processing",
        duration: "24 min",
        type: "interactive",
        completed: false,
        premium: true
      }
    ]
  },
  {
    persona: "Realtors/Property Managers",
    icon: "🏡",
    color: "orange",
    completionRate: 80,
    modules: [
      {
        id: "realtor-1",
        title: "Property Listings Dashboard",
        description: "Manage listings, showings, and client communications",
        duration: "16 min",
        type: "video",
        completed: true,
        premium: false
      },
      {
        id: "realtor-2",
        title: "Client & Owner Portals",
        description: "Set up secure portals for clients and property owners",
        duration: "14 min",
        type: "interactive",
        completed: true,
        premium: false
      },
      {
        id: "realtor-3",
        title: "Marketing Automation (Premium)",
        description: "Automate marketing campaigns and lead generation",
        duration: "19 min",
        type: "video",
        completed: false,
        premium: true
      }
    ]
  },
  {
    persona: "Consultants/Coaches",
    icon: "💡",
    color: "teal",
    completionRate: 65,
    modules: [
      {
        id: "consultant-1",
        title: "Consulting Practice Dashboard",
        description: "Manage clients, projects, and outcomes effectively",
        duration: "15 min",
        type: "video",
        completed: true,
        premium: false
      },
      {
        id: "consultant-2",
        title: "Client Outcome Tracking",
        description: "Measure and report on client progress and results",
        duration: "18 min",
        type: "interactive",
        completed: false,
        premium: false
      },
      {
        id: "consultant-3",
        title: "Bulk Portal Creation (Premium)",
        description: "Scale your practice with bulk client operations",
        duration: "21 min",
        type: "video",
        completed: false,
        premium: true
      }
    ]
  }
];

export const PersonaTrainingHub: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState(0);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const currentPersona = personaTrainingData[selectedPersona];

  const getModuleIcon = (type: string, completed: boolean) => {
    if (completed) return <CheckCircle className="h-4 w-4 text-green-600" />;
    
    switch (type) {
      case 'video': return <Video className="h-4 w-4 text-blue-600" />;
      case 'pdf': return <FileText className="h-4 w-4 text-orange-600" />;
      case 'interactive': return <Target className="h-4 w-4 text-purple-600" />;
      default: return <BookOpen className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Practice Management Training Hub</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive training materials for all professional personas. 
          Get up to speed quickly with step-by-step guides, video tutorials, and interactive training.
        </p>
      </div>

      <Tabs defaultValue="training" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="training">Training Modules</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="mobile">Mobile Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="training" className="space-y-6">
          {/* Persona Selector */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {personaTrainingData.map((persona, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedPersona === index ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => setSelectedPersona(index)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{persona.icon}</div>
                  <h3 className="font-semibold text-sm mb-2">{persona.persona}</h3>
                  <Progress value={persona.completionRate} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {persona.completionRate}% Complete
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Training Modules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-2xl">{currentPersona.icon}</span>
                {currentPersona.persona} Training Modules
              </CardTitle>
              <CardDescription>
                Master your practice management tools with these comprehensive training modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentPersona.modules.map((module) => (
                  <Card key={module.id} className={`${module.completed ? 'bg-green-50 border-green-200' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getModuleIcon(module.type, module.completed)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{module.title}</h4>
                              {module.premium && (
                                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                                  <Crown className="h-3 w-3 mr-1" />
                                  Premium
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {module.duration}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {module.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {module.completed ? (
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                              Completed
                            </Badge>
                          ) : (
                            <Button size="sm" variant={module.premium ? "default" : "outline"}>
                              <Play className="h-3 w-3 mr-1" />
                              {module.premium ? 'Upgrade to Access' : 'Start'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downloads" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  PDF Quick Start Guides
                </CardTitle>
                <CardDescription>Downloadable step-by-step setup guides</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-between">
                  Advisor Setup Guide
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  CPA Practice Guide
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Attorney Workflow Guide
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Realtor Marketing Guide
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Consultant Best Practices
                  <Download className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Training Series
                </CardTitle>
                <CardDescription>Comprehensive video walkthroughs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-between">
                  Dashboard Overview Series
                  <Play className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Client Onboarding Mastery
                  <Play className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Advanced Features Deep Dive
                  <Play className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Mobile App Training
                  <Play className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Training Materials
                </CardTitle>
                <CardDescription>Resources for training your staff</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-between">
                  Staff Onboarding Checklist
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Admin Training Slides
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Best Practices Manual
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Compliance Training Kit
                  <Download className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-muted p-2 rounded-lg">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('desktop')}
                className="gap-2"
              >
                <Monitor className="h-4 w-4" />
                Desktop
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('mobile')}
                className="gap-2"
              >
                <Smartphone className="h-4 w-4" />
                Mobile
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Mobile App Training
                </CardTitle>
                <CardDescription>
                  Learn to use the mobile app for {viewMode} productivity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {viewMode === 'mobile' ? 'Mobile App Demo' : 'Desktop App Training'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Quick Start Guide
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Video className="h-4 w-4 mr-2" />
                    Feature Walkthrough
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Target className="h-4 w-4 mr-2" />
                    Best Practices
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Tips & Tricks
                </CardTitle>
                <CardDescription>
                  {viewMode === 'mobile' ? 'Mobile-specific' : 'Desktop'} productivity tips
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {viewMode === 'mobile' ? (
                    <>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-sm mb-1">Quick Actions</h4>
                        <p className="text-xs text-muted-foreground">
                          Use the floating action button to quickly add clients, create tasks, or send messages on mobile.
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-sm mb-1">Offline Sync</h4>
                        <p className="text-xs text-muted-foreground">
                          Your mobile app works offline and syncs when connection is restored.
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <h4 className="font-medium text-sm mb-1">Push Notifications</h4>
                        <p className="text-xs text-muted-foreground">
                          Stay updated with client messages, task reminders, and compliance alerts.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-sm mb-1">Keyboard Shortcuts</h4>
                        <p className="text-xs text-muted-foreground">
                          Press Ctrl+K (Cmd+K on Mac) to quickly search and navigate anywhere in the platform.
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-sm mb-1">Multi-Tab Workflow</h4>
                        <p className="text-xs text-muted-foreground">
                          Open multiple client profiles in tabs for efficient management of multiple cases.
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <h4 className="font-medium text-sm mb-1">Bulk Operations</h4>
                        <p className="text-xs text-muted-foreground">
                          Select multiple items using Shift+Click or Ctrl+Click for bulk actions.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
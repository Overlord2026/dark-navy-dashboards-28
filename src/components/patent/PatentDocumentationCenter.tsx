import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { FileDown, FileText, Camera, Clock, Shield, CheckCircle, AlertTriangle, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PatentItem {
  id: string;
  title: string;
  status: "draft" | "ready" | "filed" | "pending";
  claims: number;
  inventors: string[];
  filingDate?: string;
  priority: "high" | "medium" | "low";
  description: string;
}

export function PatentDocumentationCenter() {
  const { toast } = useToast();
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const patentItems: PatentItem[] = [
    {
      id: "legacy-vault",
      title: "Family Legacy Vault™",
      status: "ready",
      claims: 15,
      inventors: ["System Architect", "Lead Developer"],
      priority: "high",
      description: "Secure multi-generational document storage with AI avatar integration"
    },
    {
      id: "swag-score",
      title: "SWAG Score™ Algorithm",
      status: "ready", 
      claims: 12,
      inventors: ["AI Specialist", "Algorithm Designer"],
      priority: "high",
      description: "Strategic Wealth Alpha GPS scoring system for lead qualification"
    },
    {
      id: "voice-ai",
      title: "Voice AI Assistant",
      status: "draft",
      claims: 8,
      inventors: ["Voice Tech Lead", "UX Designer"],
      priority: "medium",
      description: "Conversational AI for family office management"
    },
    {
      id: "vip-gtm",
      title: "VIP Go-to-Market Engine",
      status: "draft",
      claims: 10,
      inventors: ["Marketing Lead", "Growth Engineer"],
      priority: "medium",
      description: "Automated VIP customer identification and engagement system"
    },
    {
      id: "ai-avatars",
      title: "AI Legacy Avatars",
      status: "ready",
      claims: 18,
      inventors: ["AI Research Lead", "Ethics Specialist"],
      priority: "high",
      description: "Personal AI avatars trained on family legacy content"
    },
    {
      id: "marketplace-matching",
      title: "Marketplace Matching Algorithm",
      status: "pending",
      claims: 14,
      inventors: ["Matching Algorithm Lead", "Data Scientist"],
      filingDate: "2024-01-15",
      priority: "medium",
      description: "Professional service provider matching for family offices"
    }
  ];

  const handleExportAll = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const steps = [
      "Collecting UI wireframes...",
      "Generating workflow diagrams...", 
      "Compiling persona flows...",
      "Creating claim drafts...",
      "Building technical diagrams...",
      "Packaging for legal review..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setExportProgress(((i + 1) / steps.length) * 100);
      
      toast({
        title: "Export Progress",
        description: steps[i],
      });
    }

    setIsExporting(false);
    toast({
      title: "Export Complete!",
      description: "Patent documentation package ready for legal review.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready": return "bg-green-500";
      case "filed": return "bg-blue-500";
      case "pending": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patent Documentation Center</h1>
          <p className="text-muted-foreground mt-2">
            Family Office Platform™ IP Portfolio Management
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={handleExportAll}
            disabled={isExporting}
            className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export Complete Filing Package
          </Button>
        </div>
      </div>

      {isExporting && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <FileDown className="h-5 w-5 text-yellow-600 animate-bounce" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  Generating Patent Documentation Package...
                </p>
                <Progress value={exportProgress} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
          <TabsTrigger value="claims">Claims & Specifications</TabsTrigger>
          <TabsTrigger value="diagrams">Technical Diagrams</TabsTrigger>
          <TabsTrigger value="timeline">Filing Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {patentItems.map((item) => (
              <Card key={item.id} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {item.description}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={getPriorityColor(item.priority)}
                      className="ml-2"
                    >
                      {item.priority}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`} />
                        <span className="text-sm font-medium capitalize">{item.status}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Claims</span>
                      <span className="text-sm font-medium">{item.claims}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Inventors</span>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span className="text-sm font-medium">{item.inventors.length}</span>
                      </div>
                    </div>

                    {item.filingDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Filed</span>
                        <span className="text-sm font-medium">{item.filingDate}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t">
                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="h-3 w-3 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="claims" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Patent Claims Summary
              </CardTitle>
              <CardDescription>
                Core patentable elements across all innovations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">System Claims (Common Elements)</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Multi-tenant family office management platform</li>
                    <li>• Event-gated access control system</li>
                    <li>• Secure document vault with encryption</li>
                    <li>• AI-powered content analysis and matching</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold mb-2 text-green-800">High Priority Claims</h4>
                  <ul className="text-sm space-y-1 text-green-700">
                    <li>• Personal AI avatar training on family content</li>
                    <li>• SWAG algorithmic lead scoring methodology</li>
                    <li>• Legacy vault with generational access controls</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold mb-2 text-yellow-800">Pending Review</h4>
                  <ul className="text-sm space-y-1 text-yellow-700">
                    <li>• Voice AI assistant integration methods</li>
                    <li>• VIP customer identification algorithms</li>
                    <li>• Professional marketplace matching systems</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagrams" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  UI Wireframes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="text-sm">Legacy Avatar Interface</span>
                    <Badge variant="secondary">Ready</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="text-sm">SWAG Score Dashboard</span>
                    <Badge variant="secondary">Ready</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="text-sm">Vault Security Interface</span>
                    <Badge variant="secondary">Ready</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Technical Workflows
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="text-sm">AI Training Pipeline</span>
                    <Badge variant="secondary">Complete</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="text-sm">Access Control Flow</span>
                    <Badge variant="secondary">Complete</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="text-sm">Matching Algorithm</span>
                    <Badge variant="outline">Draft</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Filing Schedule & Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Q1 2024 - Provisional Filings</h4>
                    <p className="text-sm text-muted-foreground">Legacy Vault, SWAG Score, AI Avatars</p>
                    <p className="text-xs text-green-600 mt-1">Target: January 31, 2024</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Q2 2024 - Full Applications</h4>
                    <p className="text-sm text-muted-foreground">Convert provisionals to full patents</p>
                    <p className="text-xs text-yellow-600 mt-1">Target: April 30, 2024</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4">
                  <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Q3 2024 - International Filing</h4>
                    <p className="text-sm text-muted-foreground">PCT applications for key markets</p>
                    <p className="text-xs text-gray-600 mt-1">Target: July 31, 2024</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
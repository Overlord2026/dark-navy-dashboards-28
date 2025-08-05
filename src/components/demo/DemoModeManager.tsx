import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  PlayCircle, 
  Users, 
  Video, 
  FileText, 
  Star, 
  Zap, 
  Shield,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PersonaDemo {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  demoVideo: string;
  keyFeatures: string[];
  walkthrough: string[];
  status: "ready" | "recording" | "draft";
}

export function DemoModeManager() {
  const { toast } = useToast();
  const [demoMode, setDemoMode] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<string>("advisor");
  const [playingDemo, setPlayingDemo] = useState<string | null>(null);

  const personas: PersonaDemo[] = [
    {
      id: "advisor",
      name: "Financial Advisor",
      icon: TrendingUp,
      color: "bg-blue-500",
      description: "Complete wealth management platform for advisors",
      demoVideo: "/videos/advisor-demo.mp4",
      keyFeatures: ["Client Portfolio Dashboard", "SWAG Lead Scoring", "Meeting Scheduler", "Proposal Generator"],
      walkthrough: [
        "Login & Dashboard Overview",
        "Client Management System", 
        "Lead Scoring with SWAG™",
        "Automated Proposals",
        "Performance Analytics"
      ],
      status: "ready"
    },
    {
      id: "accountant",
      name: "CPA/Accountant", 
      icon: FileText,
      color: "bg-green-500",
      description: "Tax planning and compliance management tools",
      demoVideo: "/videos/accountant-demo.mp4",
      keyFeatures: ["CE Tracking", "License Management", "Client Onboarding", "Document Vault"],
      walkthrough: [
        "CE Requirements Dashboard",
        "Client Onboarding Flow",
        "Document Management",
        "Compliance Tracking",
        "Audit Trail"
      ],
      status: "ready"
    },
    {
      id: "attorney",
      name: "Estate Attorney",
      icon: Shield,
      color: "bg-purple-500", 
      description: "Estate planning and legal document management",
      demoVideo: "/videos/attorney-demo.mp4",
      keyFeatures: ["CLE Tracking", "Client Portal", "Document Security", "Case Management"],
      walkthrough: [
        "Bar Status Dashboard",
        "Client Invitation System",
        "Secure Document Vault",
        "Legacy Planning Tools",
        "Compliance Monitoring"
      ],
      status: "ready"
    },
    {
      id: "insurance",
      name: "Insurance Agent",
      icon: Shield,
      color: "bg-orange-500",
      description: "Insurance portfolio and risk management platform",
      demoVideo: "/videos/insurance-demo.mp4", 
      keyFeatures: ["Policy Management", "Risk Assessment", "Claims Tracking", "Client Communication"],
      walkthrough: [
        "Policy Dashboard",
        "Risk Assessment Tools",
        "Claims Management",
        "Renewal Automation",
        "Performance Metrics"
      ],
      status: "draft"
    },
    {
      id: "client",
      name: "Family Office Client",
      icon: Users,
      color: "bg-yellow-500",
      description: "Personal wealth and family legacy management",
      demoVideo: "/videos/client-demo.mp4",
      keyFeatures: ["Legacy Vault", "AI Avatar", "Family Timeline", "Professional Network"],
      walkthrough: [
        "Family Dashboard",
        "Legacy Vault Setup",
        "AI Avatar Creation", 
        "Professional Matching",
        "Generational Planning"
      ],
      status: "ready"
    }
  ];

  const handleDemoToggle = (enabled: boolean) => {
    setDemoMode(enabled);
    localStorage.setItem('demoMode', enabled.toString());
    
    toast({
      title: enabled ? "Demo Mode Activated" : "Demo Mode Deactivated",
      description: enabled 
        ? "Interactive demonstrations are now available" 
        : "Switched back to normal operation",
    });
  };

  const playPersonaDemo = (personaId: string) => {
    setPlayingDemo(personaId);
    const persona = personas.find(p => p.id === personaId);
    
    toast({
      title: `Playing ${persona?.name} Demo`,
      description: "Interactive walkthrough starting...",
    });

    // Simulate demo playback
    setTimeout(() => {
      setPlayingDemo(null);
      toast({
        title: "Demo Complete",
        description: `${persona?.name} demonstration finished successfully.`,
      });
    }, 5000);
  };

  useEffect(() => {
    const savedDemoMode = localStorage.getItem('demoMode');
    if (savedDemoMode) {
      setDemoMode(savedDemoMode === 'true');
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready": return "bg-green-500";
      case "recording": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Demo Mode Manager</h1>
          <p className="text-muted-foreground mt-2">
            Interactive demonstrations for all persona types
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Demo Mode</span>
            <Switch 
              checked={demoMode}
              onCheckedChange={handleDemoToggle}
            />
          </div>
          {demoMode && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <PlayCircle className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </div>
      </div>

      {demoMode && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <PlayCircle className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Demo Mode Active</h3>
                <p className="text-sm text-green-700">
                  All interfaces now show interactive walkthroughs and sample data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={selectedPersona} onValueChange={setSelectedPersona} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {personas.map((persona) => (
            <TabsTrigger 
              key={persona.id} 
              value={persona.id}
              className="flex items-center gap-2"
            >
              <persona.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{persona.name.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {personas.map((persona) => (
          <TabsContent key={persona.id} value={persona.id} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${persona.color}`}>
                      <persona.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{persona.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {persona.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(persona.status)}`} />
                    <span className="text-sm font-medium capitalize">{persona.status}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <Button 
                    onClick={() => playPersonaDemo(persona.id)}
                    disabled={playingDemo === persona.id}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                  >
                    {playingDemo === persona.id ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Playing Demo...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Start Interactive Demo
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline">
                    <Video className="h-4 w-4 mr-2" />
                    Watch Video
                  </Button>
                </div>

                {playingDemo === persona.id && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <PlayCircle className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">
                            Interactive Demo In Progress
                          </span>
                        </div>
                        <Progress value={60} className="h-2" />
                        <p className="text-xs text-blue-700">
                          Step 3 of 5: {persona.walkthrough[2]}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Key Features
                    </h4>
                    <div className="space-y-2">
                      {persona.keyFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      Demo Walkthrough
                    </h4>
                    <div className="space-y-2">
                      {persona.walkthrough.map((step, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">
                            {index + 1}
                          </div>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
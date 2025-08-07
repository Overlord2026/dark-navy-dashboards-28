import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  FileText, 
  Award,
  Brain,
  BarChart3,
  MessageSquare,
  Crown,
  Lock,
  Target,
  DollarSign,
  Settings,
  Plus,
  Filter,
  Scan,
  FileSearch
} from 'lucide-react';
import { PersonaType } from '@/types/personas';

interface LeadStage {
  id: string;
  name: string;
  color: string;
  icon: string;
  customizable: boolean;
}

interface PersonaStages {
  [key: string]: LeadStage[];
}

const DEFAULT_STAGES: PersonaStages = {
  advisor: [
    { id: 'inquiry', name: 'Initial Inquiry', color: 'bg-blue-100 border-blue-300', icon: '📧', customizable: false },
    { id: 'discovery', name: 'Discovery Call', color: 'bg-yellow-100 border-yellow-300', icon: '📞', customizable: false },
    { id: 'analysis', name: 'Portfolio Analysis', color: 'bg-purple-100 border-purple-300', icon: '📊', customizable: true },
    { id: 'proposal', name: 'Proposal Sent', color: 'bg-orange-100 border-orange-300', icon: '📋', customizable: true },
    { id: 'negotiation', name: 'Negotiating', color: 'bg-pink-100 border-pink-300', icon: '🤝', customizable: true },
    { id: 'onboarding', name: 'Client Onboarding', color: 'bg-green-100 border-green-300', icon: '✅', customizable: false },
    { id: 'closed_lost', name: 'Closed Lost', color: 'bg-red-100 border-red-300', icon: '❌', customizable: false }
  ],
  cpa: [
    { id: 'inquiry', name: 'Tax Inquiry', color: 'bg-blue-100 border-blue-300', icon: '📧', customizable: false },
    { id: 'consultation', name: 'Initial Consultation', color: 'bg-yellow-100 border-yellow-300', icon: '💬', customizable: false },
    { id: 'document_review', name: 'Document Review', color: 'bg-purple-100 border-purple-300', icon: '📄', customizable: true },
    { id: 'tax_planning', name: 'Tax Planning', color: 'bg-orange-100 border-orange-300', icon: '🧮', customizable: true },
    { id: 'engagement', name: 'Engagement Letter', color: 'bg-pink-100 border-pink-300', icon: '📝', customizable: true },
    { id: 'active_client', name: 'Active Client', color: 'bg-green-100 border-green-300', icon: '✅', customizable: false },
    { id: 'closed_lost', name: 'Not Engaged', color: 'bg-red-100 border-red-300', icon: '❌', customizable: false }
  ],
  attorney: [
    { id: 'inquiry', name: 'Legal Inquiry', color: 'bg-blue-100 border-blue-300', icon: '⚖️', customizable: false },
    { id: 'consultation', name: 'Consultation', color: 'bg-yellow-100 border-yellow-300', icon: '💼', customizable: false },
    { id: 'case_review', name: 'Case Review', color: 'bg-purple-100 border-purple-300', icon: '🔍', customizable: true },
    { id: 'retainer', name: 'Retainer Agreement', color: 'bg-orange-100 border-orange-300', icon: '📋', customizable: true },
    { id: 'active_case', name: 'Active Case', color: 'bg-green-100 border-green-300', icon: '⚡', customizable: false },
    { id: 'case_closed', name: 'Case Closed', color: 'bg-green-200 border-green-400', icon: '🏁', customizable: false },
    { id: 'declined', name: 'Declined', color: 'bg-red-100 border-red-300', icon: '❌', customizable: false }
  ],
  realtor: [
    { id: 'inquiry', name: 'Property Inquiry', color: 'bg-blue-100 border-blue-300', icon: '🏠', customizable: false },
    { id: 'showing', name: 'Property Showing', color: 'bg-yellow-100 border-yellow-300', icon: '🔑', customizable: false },
    { id: 'preapproval', name: 'Pre-approval', color: 'bg-purple-100 border-purple-300', icon: '💳', customizable: true },
    { id: 'offer', name: 'Offer Submitted', color: 'bg-orange-100 border-orange-300', icon: '📄', customizable: true },
    { id: 'contract', name: 'Under Contract', color: 'bg-pink-100 border-pink-300', icon: '📝', customizable: true },
    { id: 'closing', name: 'Closing', color: 'bg-green-100 border-green-300', icon: '🔐', customizable: false },
    { id: 'closed', name: 'Deal Closed', color: 'bg-green-200 border-green-400', icon: '🎉', customizable: false }
  ],
  consultant: [
    { id: 'inquiry', name: 'Project Inquiry', color: 'bg-blue-100 border-blue-300', icon: '💡', customizable: false },
    { id: 'discovery', name: 'Discovery Session', color: 'bg-yellow-100 border-yellow-300', icon: '🔍', customizable: false },
    { id: 'scoping', name: 'Project Scoping', color: 'bg-purple-100 border-purple-300', icon: '📐', customizable: true },
    { id: 'proposal', name: 'Proposal Review', color: 'bg-orange-100 border-orange-300', icon: '📊', customizable: true },
    { id: 'contract', name: 'Contract Negotiation', color: 'bg-pink-100 border-pink-300', icon: '🤝', customizable: true },
    { id: 'project_start', name: 'Project Started', color: 'bg-green-100 border-green-300', icon: '🚀', customizable: false },
    { id: 'completed', name: 'Project Completed', color: 'bg-green-200 border-green-400', icon: '✅', customizable: false }
  ]
};

interface UniversalLeadPipelineProps {
  persona: PersonaType;
  isPremium?: boolean;
}

export function UniversalLeadPipeline({ persona, isPremium = false }: UniversalLeadPipelineProps) {
  const [stages, setStages] = useState<LeadStage[]>(DEFAULT_STAGES[persona] || DEFAULT_STAGES.advisor);
  const [selectedStage, setSelectedStage] = useState(stages[0]?.id);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showTaxScanModal, setShowTaxScanModal] = useState(false);
  const [showEstatePlanModal, setShowEstatePlanModal] = useState(false);

  const handleStageCustomization = (stageId: string, newName: string) => {
    setStages(stages.map(stage => 
      stage.id === stageId ? { ...stage, name: newName } : stage
    ));
  };

  const addCustomStage = () => {
    const newStage: LeadStage = {
      id: `custom_${Date.now()}`,
      name: 'Custom Stage',
      color: 'bg-gray-100 border-gray-300',
      icon: '⭐',
      customizable: true
    };
    setStages([...stages.slice(0, -1), newStage, stages[stages.length - 1]]);
  };

  const getPersonaSpecificActions = () => {
    switch (persona) {
      case 'cpa':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button 
              onClick={() => setShowTaxScanModal(true)}
              className="h-16 flex flex-col gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <Scan className="h-6 w-6" />
              Instant Tax Scan
            </Button>
            <Button 
              variant="outline"
              className="h-16 flex flex-col gap-2"
            >
              <FileText className="h-6 w-6" />
              Tax Planning Wizard
            </Button>
          </div>
        );
      case 'attorney':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button 
              onClick={() => setShowEstatePlanModal(true)}
              className="h-16 flex flex-col gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              <FileSearch className="h-6 w-6" />
              Estate Plan Generator
            </Button>
            <Button 
              variant="outline"
              className="h-16 flex flex-col gap-2"
            >
              <Award className="h-6 w-6" />
              Contract Builder
            </Button>
          </div>
        );
      case 'realtor':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button 
              className="h-16 flex flex-col gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <Target className="h-6 w-6" />
              Property Matcher
            </Button>
            <Button 
              variant="outline"
              className="h-16 flex flex-col gap-2"
            >
              <Calendar className="h-6 w-6" />
              Showing Scheduler
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const getLeadEngineFeatures = () => {
    if (!isPremium) {
      return (
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <Lock className="h-12 w-12 mx-auto mb-4 text-warning" />
              <h3 className="font-semibold mb-2">Premium Lead Engine</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Unlock advanced lead scoring, ROI analytics, and campaign automation
              </p>
              <Button className="gap-2">
                <Crown className="h-4 w-4" />
                Upgrade to Premium
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Brain className="h-4 w-4" />
              AI Lead Scoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">87%</div>
            <p className="text-sm text-muted-foreground">Average lead quality</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              ROI Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">245%</div>
            <p className="text-sm text-muted-foreground">Campaign ROI</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4" />
              Auto Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">12</div>
            <p className="text-sm text-muted-foreground">Active sequences</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Lead Pipeline & Performance</h2>
          <p className="text-muted-foreground">
            Manage your {persona} pipeline with customizable stages
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowCustomizeModal(true)}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Customize Stages
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Persona-specific Quick Actions */}
      {getPersonaSpecificActions()}

      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="lead-engine">
            Lead Engine
            {!isPremium && <Lock className="h-3 w-3 ml-1" />}
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-6">
          {/* Mobile: Stage Selector */}
          <div className="block md:hidden">
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {stages.map(stage => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.icon} {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop: Kanban Board */}
          <div className="hidden md:block">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
              {stages.map(stage => (
                <Card key={stage.id} className={`${stage.color} min-h-[300px]`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <span>{stage.icon}</span>
                      {stage.name}
                      <Badge variant="secondary" className="ml-auto">
                        {Math.floor(Math.random() * 10)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Mock leads for demonstration */}
                    {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, i) => (
                      <Card key={i} className="bg-white/80 p-3 hover:bg-white/90 transition-colors">
                        <div className="space-y-2">
                          <div className="font-medium text-sm">Client {i + 1}</div>
                          <div className="text-xs text-muted-foreground">
                            ${(Math.random() * 100000).toLocaleString()}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {Math.floor(Math.random() * 30)} days
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mobile: Selected Stage Content */}
          <div className="block md:hidden">
            {stages.filter(stage => stage.id === selectedStage).map(stage => (
              <Card key={stage.id} className={stage.color}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {stage.icon} {stage.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="bg-white/80 p-3">
                      <div className="space-y-2">
                        <div className="font-medium">Client {i + 1}</div>
                        <div className="text-sm text-muted-foreground">
                          ${(Math.random() * 100000).toLocaleString()}
                        </div>
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lead-engine" className="space-y-6">
          {getLeadEngineFeatures()}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Pipeline</p>
                    <p className="text-2xl font-bold">${(Math.random() * 500000).toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                    <p className="text-2xl font-bold">{(Math.random() * 30 + 10).toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Deal Size</p>
                    <p className="text-2xl font-bold">${(Math.random() * 50000).toLocaleString()}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Leads</p>
                    <p className="text-2xl font-bold">{Math.floor(Math.random() * 50 + 20)}</p>
                  </div>
                  <Users className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Customize Stages Modal */}
      <Dialog open={showCustomizeModal} onOpenChange={setShowCustomizeModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customize Pipeline Stages</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <span className="text-lg">{stage.icon}</span>
                <Input 
                  value={stage.name}
                  onChange={(e) => handleStageCustomization(stage.id, e.target.value)}
                  disabled={!stage.customizable}
                  className={!stage.customizable ? 'bg-muted' : ''}
                />
                {!stage.customizable && (
                  <Badge variant="secondary">System</Badge>
                )}
              </div>
            ))}
            <Button onClick={addCustomStage} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Stage
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tax Scan Modal */}
      <Dialog open={showTaxScanModal} onOpenChange={setShowTaxScanModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              Instant Tax Scan
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Upload tax documents for instant analysis and opportunity identification
            </p>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drop tax documents here or click to upload
              </p>
              <Button variant="outline">Choose Files</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Estate Plan Modal */}
      <Dialog open={showEstatePlanModal} onOpenChange={setShowEstatePlanModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSearch className="h-5 w-5" />
              Estate Plan Generator
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Generate comprehensive estate planning documents based on client information
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Client Name</Label>
                <Input placeholder="Enter client name" />
              </div>
              <div>
                <Label>Estate Value</Label>
                <Input placeholder="Enter estate value" />
              </div>
            </div>
            <Button className="w-full">
              Generate Estate Plan Documents
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
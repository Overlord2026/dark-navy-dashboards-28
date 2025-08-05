import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GitBranch, Plus, Edit, Copy, Trash2, ArrowRight, Users } from 'lucide-react';
import { toast } from 'sonner';

interface OnboardingFlowsPanelProps {
  organizationId: string;
}

export const OnboardingFlowsPanel: React.FC<OnboardingFlowsPanelProps> = ({
  organizationId
}) => {
  const [isFlowDialogOpen, setIsFlowDialogOpen] = useState(false);
  const [flowName, setFlowName] = useState('');
  const [inviteSource, setInviteSource] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Mock onboarding flows data
  const onboardingFlows = [
    {
      id: '1',
      name: 'Advisor Referral Flow',
      inviteSource: 'advisor',
      status: 'Active',
      totalSteps: 6,
      autoAssignments: ['advisor_link', 'compliance_check'],
      usageCount: 89,
      completionRate: '92%',
      avgTimeToComplete: '2.3 days'
    },
    {
      id: '2',
      name: 'Broker-Dealer Direct',
      inviteSource: 'broker_dealer',
      status: 'Active',
      totalSteps: 8,
      autoAssignments: ['bd_compliance', 'seat_assignment'],
      usageCount: 156,
      completionRate: '87%',
      avgTimeToComplete: '3.1 days'
    },
    {
      id: '3',
      name: 'RIA Partnership Flow',
      inviteSource: 'ria',
      status: 'Draft',
      totalSteps: 7,
      autoAssignments: ['ria_verification', 'module_access'],
      usageCount: 0,
      completionRate: '-',
      avgTimeToComplete: '-'
    },
    {
      id: '4',
      name: 'Insurance Agency Flow',
      inviteSource: 'insurance_agency',
      status: 'Active',
      totalSteps: 5,
      autoAssignments: ['insurance_verification'],
      usageCount: 34,
      completionRate: '94%',
      avgTimeToComplete: '1.8 days'
    }
  ];

  const flowStats = {
    totalFlows: onboardingFlows.length,
    activeFlows: onboardingFlows.filter(f => f.status === 'Active').length,
    totalUsers: onboardingFlows.reduce((sum, f) => sum + f.usageCount, 0),
    avgCompletionRate: '91%'
  };

  const sampleFlowSteps = [
    { id: '1', name: 'Welcome Email', type: 'email', required: true },
    { id: '2', name: 'Profile Creation', type: 'form', required: true },
    { id: '3', name: 'Agreement Signing', type: 'agreement', required: true },
    { id: '4', name: 'Compliance Verification', type: 'verification', required: true },
    { id: '5', name: 'Module Assignment', type: 'assignment', required: false },
    { id: '6', name: 'Training Resources', type: 'resources', required: false }
  ];

  const handleCreateFlow = () => {
    if (!flowName || !inviteSource) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Onboarding flow created successfully');
    setIsFlowDialogOpen(false);
    setFlowName('');
    setInviteSource('');
  };

  const handleEditFlow = (flowId: string) => {
    toast.success('Flow editor opened');
  };

  const handleDuplicateFlow = (flowId: string) => {
    toast.success('Flow duplicated successfully');
  };

  const handleDeleteFlow = (flowId: string) => {
    toast.success('Flow deleted successfully');
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'advisor': return 'Advisor Referral';
      case 'broker_dealer': return 'Broker-Dealer';
      case 'ria': return 'RIA';
      case 'insurance_agency': return 'Insurance Agency';
      case 'law_firm': return 'Law Firm';
      case 'accounting_firm': return 'Accounting Firm';
      case 'direct': return 'Direct Signup';
      case 'referral': return 'Referral';
      default: return source;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Draft': return 'secondary';
      case 'Archived': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Flow Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Flows</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flowStats.totalFlows}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Flows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{flowStats.activeFlows}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Users Onboarded</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flowStats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{flowStats.avgCompletionRate}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sample Flow Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Flow Step Templates</CardTitle>
          <CardDescription>Common onboarding steps you can customize</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {sampleFlowSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2">
                  <Badge variant={step.required ? 'default' : 'outline'}>
                    {step.name}
                  </Badge>
                  {index < sampleFlowSteps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Drag and drop to reorder steps, or customize each step's content and requirements.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Flows */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Onboarding Flows</CardTitle>
              <CardDescription>Manage dynamic onboarding flows by invite source</CardDescription>
            </div>
            <Dialog open={isFlowDialogOpen} onOpenChange={setIsFlowDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Flow
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Create Onboarding Flow</DialogTitle>
                  <DialogDescription>
                    Create a customized onboarding flow for specific invite sources
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="flow-name">Flow Name</Label>
                      <Input 
                        id="flow-name"
                        value={flowName}
                        onChange={(e) => setFlowName(e.target.value)}
                        placeholder="e.g., Advisor Referral Flow"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invite-source">Invite Source</Label>
                      <Select value={inviteSource} onValueChange={setInviteSource}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="advisor">Advisor Referral</SelectItem>
                          <SelectItem value="broker_dealer">Broker-Dealer</SelectItem>
                          <SelectItem value="ria">RIA</SelectItem>
                          <SelectItem value="insurance_agency">Insurance Agency</SelectItem>
                          <SelectItem value="law_firm">Law Firm</SelectItem>
                          <SelectItem value="accounting_firm">Accounting Firm</SelectItem>
                          <SelectItem value="direct">Direct Signup</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flow-template">Base Template</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a starting template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Client Flow</SelectItem>
                        <SelectItem value="advisor">Advisor Partnership Flow</SelectItem>
                        <SelectItem value="compliance">Compliance-Heavy Flow</SelectItem>
                        <SelectItem value="minimal">Minimal Quick Start</SelectItem>
                        <SelectItem value="custom">Build from Scratch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>Auto-Assignments</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="advisor-link" />
                        <Label htmlFor="advisor-link">Auto-link to advisor</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="compliance-check" />
                        <Label htmlFor="compliance-check">Compliance verification</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="seat-assignment" />
                        <Label htmlFor="seat-assignment">Seat assignment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="module-access" />
                        <Label htmlFor="module-access">Module access setup</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branding-notes">Branding Customization</Label>
                    <Textarea 
                      id="branding-notes"
                      placeholder="Specify custom branding, welcome messages, or organization-specific content..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button onClick={handleCreateFlow} className="w-full">
                    Create Flow
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flow Name</TableHead>
                <TableHead>Invite Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Steps</TableHead>
                <TableHead>Usage Count</TableHead>
                <TableHead>Completion Rate</TableHead>
                <TableHead>Avg Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {onboardingFlows.map((flow) => (
                <TableRow key={flow.id}>
                  <TableCell className="font-medium">{flow.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getSourceLabel(flow.inviteSource)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(flow.status)}>
                      {flow.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{flow.totalSteps} steps</TableCell>
                  <TableCell>{flow.usageCount}</TableCell>
                  <TableCell>{flow.completionRate}</TableCell>
                  <TableCell>{flow.avgTimeToComplete}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditFlow(flow.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDuplicateFlow(flow.id)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteFlow(flow.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
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
import { FileText, Plus, Edit, Copy, Trash2, Send, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface AgreementTemplatesPanelProps {
  organizationId: string;
}

export const AgreementTemplatesPanel: React.FC<AgreementTemplatesPanelProps> = ({
  organizationId
}) => {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [agreementType, setAgreementType] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [requiresSignature, setRequiresSignature] = useState(true);

  // Mock agreement templates data
  const agreementTemplates = [
    {
      id: '1',
      name: 'Standard NDA Template',
      type: 'nda',
      version: '2.1',
      status: 'Active',
      lastModified: '2024-07-15',
      usageCount: 45,
      requiresSignature: true
    },
    {
      id: '2',
      name: 'Client Service Agreement',
      type: 'client_agreement',
      version: '1.3',
      status: 'Active',
      lastModified: '2024-06-20',
      usageCount: 128,
      requiresSignature: true
    },
    {
      id: '3',
      name: 'Privacy Policy v2024',
      type: 'privacy_policy',
      version: '3.0',
      status: 'Draft',
      lastModified: '2024-08-01',
      usageCount: 0,
      requiresSignature: false
    },
    {
      id: '4',
      name: 'Advisor Partnership Agreement',
      type: 'advisor_agreement',
      version: '1.0',
      status: 'Active',
      lastModified: '2024-05-10',
      usageCount: 23,
      requiresSignature: true
    }
  ];

  const agreementStats = {
    totalTemplates: agreementTemplates.length,
    activeTemplates: agreementTemplates.filter(t => t.status === 'Active').length,
    pendingSignatures: 15,
    totalSignatures: 287
  };

  const sampleAgreementWorkflows = [
    {
      name: 'Advisor NDA & Data Agreement',
      description: 'Standard NDA for new advisor onboarding with data handling provisions',
      triggers: ['advisor_invitation', 'onboarding_start'],
      steps: ['send_agreement', 'reminder_7_days', 'escalate_14_days']
    },
    {
      name: 'Client Consent & EULA',
      description: 'Firm-branded client agreement with terms of service',
      triggers: ['client_signup', 'service_enrollment'],
      steps: ['present_agreement', 'require_signature', 'store_signed_copy']
    },
    {
      name: 'Seat Assignment Form',
      description: 'Acknowledgment of seat assignment and transfer rules',
      triggers: ['seat_assignment', 'seat_transfer'],
      steps: ['send_notification', 'collect_acknowledgment']
    },
    {
      name: 'Renewal Agreement',
      description: 'Annual renewal notices and updated terms',
      triggers: ['renewal_period', 'contract_expiration'],
      steps: ['auto_email', 'dashboard_prompt', 'follow_up_sequence']
    }
  ];

  const handleCreateTemplate = () => {
    if (!templateName || !agreementType || !templateContent) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Agreement template created successfully');
    setIsTemplateDialogOpen(false);
    setTemplateName('');
    setTemplateContent('');
    setAgreementType('');
  };

  const handleEditTemplate = (templateId: string) => {
    toast.success('Template editor opened');
  };

  const handleDuplicateTemplate = (templateId: string) => {
    toast.success('Template duplicated successfully');
  };

  const handleDeleteTemplate = (templateId: string) => {
    toast.success('Template deleted successfully');
  };

  const handleSendAgreement = (templateId: string) => {
    toast.success('Agreement sent to recipients');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Draft': return 'secondary';
      case 'Archived': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'nda': return 'NDA';
      case 'client_agreement': return 'Client Agreement';
      case 'privacy_policy': return 'Privacy Policy';
      case 'advisor_agreement': return 'Advisor Agreement';
      case 'terms_of_service': return 'Terms of Service';
      case 'compliance_disclosure': return 'Compliance Disclosure';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Agreement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agreementStats.totalTemplates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{agreementStats.activeTemplates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Signatures</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{agreementStats.pendingSignatures}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Signatures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agreementStats.totalSignatures}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sample Agreement Workflows */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Agreement Workflows</CardTitle>
          <CardDescription>Pre-configured workflows for common agreement scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleAgreementWorkflows.map((workflow, index) => (
              <Card key={index} className="border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  <CardDescription className="text-sm">{workflow.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Triggers:</p>
                      <div className="flex gap-1 flex-wrap">
                        {workflow.triggers.map((trigger, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Steps:</p>
                      <div className="flex gap-1 flex-wrap">
                        {workflow.steps.map((step, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {step}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Use This Workflow
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agreement Templates */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Agreement Templates</CardTitle>
              <CardDescription>Manage organization-wide agreement templates</CardDescription>
            </div>
            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Agreement Template</DialogTitle>
                  <DialogDescription>
                    Create a new agreement template for your organization
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="template-name">Template Name</Label>
                      <Input 
                        id="template-name"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="e.g., Standard NDA Template"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreement-type">Agreement Type</Label>
                      <Select value={agreementType} onValueChange={setAgreementType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nda">NDA</SelectItem>
                          <SelectItem value="client_agreement">Client Agreement</SelectItem>
                          <SelectItem value="privacy_policy">Privacy Policy</SelectItem>
                          <SelectItem value="terms_of_service">Terms of Service</SelectItem>
                          <SelectItem value="advisor_agreement">Advisor Agreement</SelectItem>
                          <SelectItem value="compliance_disclosure">Compliance Disclosure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-content">Template Content</Label>
                    <Textarea 
                      id="template-content"
                      value={templateContent}
                      onChange={(e) => setTemplateContent(e.target.value)}
                      placeholder="Enter your agreement template content here..."
                      className="min-h-[300px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Use placeholder syntax for dynamic content (e.g., client_name, organization_name)
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="requires-signature"
                        checked={requiresSignature}
                        onCheckedChange={setRequiresSignature}
                      />
                      <Label htmlFor="requires-signature">Requires e-signature</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-renewal" />
                      <Label htmlFor="auto-renewal">Auto-renewal enabled</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="validity-days">Validity Period (days)</Label>
                    <Input id="validity-days" placeholder="365" />
                  </div>

                  <Button onClick={handleCreateTemplate} className="w-full">
                    Create Template
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
                <TableHead>Template Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage Count</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agreementTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getTypeLabel(template.type)}</Badge>
                  </TableCell>
                  <TableCell>{template.version}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(template.status)}>
                      {template.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{template.usageCount}</TableCell>
                  <TableCell>{template.lastModified}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditTemplate(template.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDuplicateTemplate(template.id)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSendAgreement(template.id)}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
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
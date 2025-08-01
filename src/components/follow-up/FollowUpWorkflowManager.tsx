import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Mail, Settings, BarChart3, Edit, Trash2, Shield, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface EmailTemplate {
  id: string;
  template_name: string;
  subject_template: string;
  body_template: string;
  is_active: boolean;
  compliance_approved: boolean;
  brand_settings: any;
  created_at: string;
}

interface Workflow {
  id: string;
  workflow_name: string;
  delay_hours: number;
  is_active: boolean;
  include_recording: boolean;
  include_summary: boolean;
  include_action_items: boolean;
  requires_approval: boolean;
  include_meeting_links: boolean;
  email_template_id: string;
  email_template?: EmailTemplate;
}

interface EmailHistory {
  id: string;
  client_email: string;
  subject: string;
  status: 'pending_approval' | 'approved' | 'sent' | 'failed';
  sent_at: string;
  opened_at?: string;
  clicked_at?: string;
  approved_by?: string;
  approved_at?: string;
}

interface PendingApproval {
  id: string;
  client_email: string;
  subject: string;
  body: string;
  meeting_summary: string;
  action_items: string[];
  next_meeting_info?: {
    type: 'zoom' | 'google_meet' | 'in_person';
    link?: string;
    location?: string;
    suggested_times: string[];
  };
  created_at: string;
  workflow_name: string;
}

export function FollowUpWorkflowManager() {
  const [activeTab, setActiveTab] = useState('workflows');
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [isCreateWorkflowOpen, setIsCreateWorkflowOpen] = useState(false);

  // Mock data - replace with real Supabase queries once tables are created
  const [templates] = useState<EmailTemplate[]>([
    {
      id: '1',
      template_name: 'Professional Follow-up',
      subject_template: 'Thank you for our meeting - {{meeting_title}}',
      body_template: 'Dear {{client_name}}, Thank you for taking the time to meet with me today...',
      is_active: true,
      compliance_approved: true,
      brand_settings: {},
      created_at: new Date().toISOString()
    }
  ]);

  const [workflows] = useState<Workflow[]>([
    {
      id: '1',
      workflow_name: 'Standard Follow-up with Approval',
      delay_hours: 2,
      is_active: true,
      include_recording: true,
      include_summary: true,
      include_action_items: true,
      requires_approval: true,
      include_meeting_links: true,
      email_template_id: '1',
      email_template: templates[0]
    }
  ]);

  const [emailHistory] = useState<EmailHistory[]>([
    {
      id: '1',
      client_email: 'client@example.com',
      subject: 'Thank you for our meeting - Portfolio Review',
      status: 'sent',
      sent_at: new Date().toISOString(),
      approved_by: 'advisor@example.com',
      approved_at: new Date().toISOString()
    }
  ]);

  const [pendingApprovals] = useState<PendingApproval[]>([
    {
      id: '1',
      client_email: 'newclient@example.com',
      subject: 'Follow-up from our investment planning discussion',
      body: 'Dear John, Thank you for taking the time to discuss your investment goals...',
      meeting_summary: 'Discussed retirement planning goals and risk tolerance.',
      action_items: ['Review portfolio allocation', 'Research ESG options', 'Schedule quarterly review'],
      next_meeting_info: {
        type: 'zoom',
        link: 'https://zoom.us/j/123456789',
        suggested_times: ['Next Tuesday 2:00 PM', 'Wednesday 10:00 AM', 'Friday 3:00 PM']
      },
      created_at: new Date().toISOString(),
      workflow_name: 'Standard Follow-up with Approval'
    }
  ]);

  const [newTemplate, setNewTemplate] = useState({
    template_name: '',
    subject_template: '',
    body_template: '',
    brand_settings: { primary_color: '#2563eb', logo_url: '', signature: '' }
  });

  const [newWorkflow, setNewWorkflow] = useState({
    workflow_name: '',
    delay_hours: 2,
    include_recording: true,
    include_summary: true,
    include_action_items: true,
    requires_approval: false,
    include_meeting_links: false,
    email_template_id: ''
  });

  const createTemplate = async () => {
    // TODO: Implement with Supabase
    toast.success('Email template created successfully');
    setIsCreateTemplateOpen(false);
    setNewTemplate({
      template_name: '',
      subject_template: '',
      body_template: '',
      brand_settings: { primary_color: '#2563eb', logo_url: '', signature: '' }
    });
  };

  const createWorkflow = async () => {
    // TODO: Implement with Supabase
    toast.success('Workflow created successfully');
    setIsCreateWorkflowOpen(false);
    setNewWorkflow({
      workflow_name: '',
      delay_hours: 2,
      include_recording: true,
      include_summary: true,
      include_action_items: true,
      requires_approval: false,
      include_meeting_links: false,
      email_template_id: ''
    });
  };

  const approveEmail = (approvalId: string) => {
    // TODO: Implement approval logic
    toast.success('Email approved and sent');
  };

  const rejectEmail = (approvalId: string) => {
    // TODO: Implement rejection logic
    toast.success('Email rejected');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending Approval</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'sent':
        return <Badge variant="default"><Mail className="h-3 w-3 mr-1" />Sent</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Follow-Up Email Workflows</h1>
          <p className="text-muted-foreground">Automate post-meeting communications with approval workflows and compliance controls</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600">
            <Shield className="h-3 w-3 mr-1" />
            Compliance Ready
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="history">Email History</TabsTrigger>
        </TabsList>

        <TabsContent value="approvals" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Pending Email Approvals</h2>
            <Badge variant="outline">{pendingApprovals.length} pending</Badge>
          </div>

          <div className="grid gap-4">
            {pendingApprovals.map((approval) => (
              <Card key={approval.id} className="border-yellow-200 bg-yellow-50/50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {approval.subject}
                        <Badge variant="outline" className="text-yellow-600">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending Approval
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        To: {approval.client_email} • Workflow: {approval.workflow_name}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => rejectEmail(approval.id)}>
                        Reject
                      </Button>
                      <Button size="sm" onClick={() => approveEmail(approval.id)}>
                        Approve & Send
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Meeting Summary:</h4>
                    <p className="text-sm text-muted-foreground">{approval.meeting_summary}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Action Items:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {approval.action_items.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {approval.next_meeting_info && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Next Meeting Options:
                      </h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Type:</strong> {approval.next_meeting_info.type}</p>
                        {approval.next_meeting_info.link && (
                          <p><strong>Link:</strong> {approval.next_meeting_info.link}</p>
                        )}
                        <p><strong>Suggested Times:</strong></p>
                        <ul className="ml-4 space-y-1">
                          {approval.next_meeting_info.suggested_times.map((time, index) => (
                            <li key={index}>• {time}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="border rounded-lg p-3 bg-background">
                    <h4 className="font-medium mb-2">Email Preview:</h4>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {approval.body.substring(0, 200)}...
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Active Workflows</h2>
            <Dialog open={isCreateWorkflowOpen} onOpenChange={setIsCreateWorkflowOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workflow
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Workflow</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="workflow-name">Workflow Name</Label>
                    <Input
                      id="workflow-name"
                      value={newWorkflow.workflow_name}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, workflow_name: e.target.value })}
                      placeholder="e.g., Standard Meeting Follow-up"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email-template">Email Template</Label>
                    <Select 
                      value={newWorkflow.email_template_id} 
                      onValueChange={(value) => setNewWorkflow({ ...newWorkflow, email_template_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select email template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.template_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="delay-hours">Delay (hours after meeting)</Label>
                    <Input
                      id="delay-hours"
                      type="number"
                      min="0"
                      max="168"
                      value={newWorkflow.delay_hours}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, delay_hours: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="requires-approval"
                        checked={newWorkflow.requires_approval}
                        onCheckedChange={(checked) => setNewWorkflow({ ...newWorkflow, requires_approval: checked })}
                      />
                      <Label htmlFor="requires-approval">Require advisor approval before sending</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="include-meeting-links"
                        checked={newWorkflow.include_meeting_links}
                        onCheckedChange={(checked) => setNewWorkflow({ ...newWorkflow, include_meeting_links: checked })}
                      />
                      <Label htmlFor="include-meeting-links">Include next meeting booking options</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="include-summary"
                        checked={newWorkflow.include_summary}
                        onCheckedChange={(checked) => setNewWorkflow({ ...newWorkflow, include_summary: checked })}
                      />
                      <Label htmlFor="include-summary">Include meeting summary</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="include-action-items"
                        checked={newWorkflow.include_action_items}
                        onCheckedChange={(checked) => setNewWorkflow({ ...newWorkflow, include_action_items: checked })}
                      />
                      <Label htmlFor="include-action-items">Include action items</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="include-recording"
                        checked={newWorkflow.include_recording}
                        onCheckedChange={(checked) => setNewWorkflow({ ...newWorkflow, include_recording: checked })}
                      />
                      <Label htmlFor="include-recording">Include recording link</Label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateWorkflowOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createWorkflow}>Create Workflow</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {workflow.workflow_name}
                        <Badge variant={workflow.is_active ? "default" : "secondary"}>
                          {workflow.is_active ? "Active" : "Inactive"}
                        </Badge>
                        {workflow.requires_approval && (
                          <Badge variant="outline" className="text-blue-600">
                            <Shield className="h-3 w-3 mr-1" />
                            Approval Required
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Sends {workflow.delay_hours} hours after meeting completion
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={workflow.is_active} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Template:</strong> {workflow.email_template?.template_name || 'Default'}
                    </div>
                    <div>
                      <strong>Features:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {workflow.requires_approval && (
                          <Badge variant="outline" className="text-xs">Approval Required</Badge>
                        )}
                        {workflow.include_meeting_links && (
                          <Badge variant="outline" className="text-xs">Meeting Links</Badge>
                        )}
                        {workflow.include_summary && (
                          <Badge variant="outline" className="text-xs">Summary</Badge>
                        )}
                        {workflow.include_action_items && (
                          <Badge variant="outline" className="text-xs">Action Items</Badge>
                        )}
                        {workflow.include_recording && (
                          <Badge variant="outline" className="text-xs">Recording</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Email Templates</h2>
            <Dialog open={isCreateTemplateOpen} onOpenChange={setIsCreateTemplateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Email Template</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      value={newTemplate.template_name}
                      onChange={(e) => setNewTemplate({ ...newTemplate, template_name: e.target.value })}
                      placeholder="e.g., Professional Follow-up"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject-template">Subject Template</Label>
                    <Input
                      id="subject-template"
                      value={newTemplate.subject_template}
                      onChange={(e) => setNewTemplate({ ...newTemplate, subject_template: e.target.value })}
                      placeholder="e.g., Thank you for our meeting - {{meeting_title}}"
                    />
                  </div>

                  <div>
                    <Label htmlFor="body-template">Email Body Template</Label>
                    <Textarea
                      id="body-template"
                      rows={15}
                      value={newTemplate.body_template}
                      onChange={(e) => setNewTemplate({ ...newTemplate, body_template: e.target.value })}
                      placeholder="HTML email template with variables like {{client_name}}, {{summary}}, etc."
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Use variables: {`{{client_name}}, {{advisor_name}}, {{meeting_title}}, {{summary}}, {{action_items}}, {{next_steps}}, {{recording_link}}, {{meeting_booking_links}}`}
                    </p>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateTemplateOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createTemplate}>Create Template</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {template.template_name}
                        <Badge variant={template.is_active ? "default" : "secondary"}>
                          {template.is_active ? "Active" : "Inactive"}
                        </Badge>
                        {template.compliance_approved && (
                          <Badge variant="outline" className="text-green-600">
                            <Shield className="h-3 w-3 mr-1" />
                            Compliance Approved
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Subject: {template.subject_template}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Email History & Audit Log</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <Shield className="h-3 w-3 mr-1" />
                Audit Compliant
              </Badge>
            </div>
          </div>

          <div className="grid gap-4">
            {emailHistory.map((email) => (
              <Card key={email.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {email.subject}
                        {getStatusBadge(email.status)}
                      </CardTitle>
                      <CardDescription>
                        To: {email.client_email} • Sent: {new Date(email.sent_at).toLocaleString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Approval:</strong> {email.approved_by || 'Auto-approved'}
                    </div>
                    <div>
                      <strong>Opened:</strong> {email.opened_at ? 'Yes' : 'No'}
                    </div>
                    <div>
                      <strong>Clicked:</strong> {email.clicked_at ? 'Yes' : 'No'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
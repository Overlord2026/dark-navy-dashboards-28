import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
import { Plus, Mail, Settings, BarChart3, Edit, Trash2 } from 'lucide-react';

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
  email_template_id: string;
  email_template?: EmailTemplate;
}

interface EmailHistory {
  id: string;
  client_email: string;
  subject: string;
  status: string;
  sent_at: string;
  opened_at?: string;
  clicked_at?: string;
}

export function FollowUpWorkflowManager() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [emailHistory, setEmailHistory] = useState<EmailHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [isCreateWorkflowOpen, setIsCreateWorkflowOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('workflows');

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
    email_template_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch email templates
      const { data: templatesData, error: templatesError } = await supabase
        .from('advisor_email_templates')
        .select('*')
        .eq('advisor_id', user.id)
        .order('created_at', { ascending: false });

      if (templatesError) throw templatesError;
      setTemplates(templatesData || []);

      // Fetch workflows
      const { data: workflowsData, error: workflowsError } = await supabase
        .from('follow_up_workflows')
        .select(`
          *,
          advisor_email_templates (*)
        `)
        .eq('advisor_id', user.id)
        .order('created_at', { ascending: false });

      if (workflowsError) throw workflowsError;
      setWorkflows(workflowsData || []);

      // Fetch email history
      const { data: historyData, error: historyError } = await supabase
        .from('follow_up_email_history')
        .select('*')
        .eq('advisor_id', user.id)
        .order('sent_at', { ascending: false })
        .limit(50);

      if (historyError) throw historyError;
      setEmailHistory(historyData || []);

    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('advisor_email_templates')
        .insert({
          advisor_id: user.id,
          ...newTemplate
        });

      if (error) throw error;

      toast.success('Email template created successfully');
      setIsCreateTemplateOpen(false);
      setNewTemplate({
        template_name: '',
        subject_template: '',
        body_template: '',
        brand_settings: { primary_color: '#2563eb', logo_url: '', signature: '' }
      });
      fetchData();
    } catch (error: any) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
    }
  };

  const createWorkflow = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('follow_up_workflows')
        .insert({
          advisor_id: user.id,
          ...newWorkflow
        });

      if (error) throw error;

      toast.success('Workflow created successfully');
      setIsCreateWorkflowOpen(false);
      setNewWorkflow({
        workflow_name: '',
        delay_hours: 2,
        include_recording: true,
        include_summary: true,
        include_action_items: true,
        email_template_id: ''
      });
      fetchData();
    } catch (error: any) {
      console.error('Error creating workflow:', error);
      toast.error('Failed to create workflow');
    }
  };

  const toggleWorkflow = async (workflowId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('follow_up_workflows')
        .update({ is_active: !isActive })
        .eq('id', workflowId);

      if (error) throw error;

      toast.success(`Workflow ${!isActive ? 'activated' : 'deactivated'}`);
      fetchData();
    } catch (error: any) {
      console.error('Error toggling workflow:', error);
      toast.error('Failed to update workflow');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Follow-Up Email Workflows</h1>
          <p className="text-muted-foreground">Automate post-meeting communications with customizable templates</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="history">Email History</TabsTrigger>
        </TabsList>

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
                      </CardTitle>
                      <CardDescription>
                        Sends {workflow.delay_hours} hours after meeting completion
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={workflow.is_active}
                        onCheckedChange={() => toggleWorkflow(workflow.id, workflow.is_active)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Template:</strong> {workflow.email_template?.template_name || 'Default'}
                    </div>
                    <div>
                      <strong>Includes:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
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
                      Use variables: {{client_name}}, {{advisor_name}}, {{meeting_title}}, {{summary}}, {{action_items}}, {{next_steps}}, {{recording_link}}
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
          <h2 className="text-2xl font-semibold">Email History</h2>
          
          <div className="grid gap-4">
            {emailHistory.map((email) => (
              <Card key={email.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-medium">{email.subject}</p>
                      <p className="text-sm text-muted-foreground">To: {email.client_email}</p>
                      <p className="text-xs text-muted-foreground">
                        Sent: {new Date(email.sent_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={email.status === 'sent' ? 'default' : 'destructive'}>
                        {email.status}
                      </Badge>
                      {email.opened_at && (
                        <Badge variant="outline" className="text-green-600">
                          Opened
                        </Badge>
                      )}
                      {email.clicked_at && (
                        <Badge variant="outline" className="text-blue-600">
                          Clicked
                        </Badge>
                      )}
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
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Save, 
  FileText, 
  Palette, 
  Eye, 
  Edit,
  Download,
  Upload,
  Trash2,
  Copy,
  Settings
} from 'lucide-react';

interface DocumentTemplate {
  id: string;
  template_name: string;
  template_type: string;
  template_content: string;
  variables: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TemplateVariable {
  [key: string]: any;
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[];
  default_value?: string;
}

const defaultTemplateTypes = [
  { value: 'engagement_letter', label: 'Engagement Letter' },
  { value: 'tax_organizer', label: 'Tax Organizer' },
  { value: 'invoice', label: 'Invoice Template' },
  { value: 'proposal', label: 'Service Proposal' },
  { value: 'contract', label: 'Service Contract' },
  { value: 'welcome_letter', label: 'Welcome Letter' },
  { value: 'checklist', label: 'Client Checklist' },
  { value: 'notice', label: 'Important Notice' }
];

const commonVariables: TemplateVariable[] = [
  { key: 'client_name', label: 'Client Name', type: 'text' },
  { key: 'client_address', label: 'Client Address', type: 'text' },
  { key: 'client_email', label: 'Client Email', type: 'text' },
  { key: 'client_phone', label: 'Client Phone', type: 'text' },
  { key: 'firm_name', label: 'Firm Name', type: 'text' },
  { key: 'firm_address', label: 'Firm Address', type: 'text' },
  { key: 'firm_phone', label: 'Firm Phone', type: 'text' },
  { key: 'service_type', label: 'Service Type', type: 'select', options: ['Tax Preparation', 'Bookkeeping', 'Financial Planning', 'Business Advisory'] },
  { key: 'engagement_date', label: 'Engagement Date', type: 'date' },
  { key: 'fee_amount', label: 'Fee Amount', type: 'number' },
  { key: 'due_date', label: 'Due Date', type: 'date' }
];

const defaultEngagementLetterTemplate = `
Dear {{client_name}},

Thank you for choosing {{firm_name}} for your {{service_type}} needs. This letter confirms our understanding of the terms and objectives of our engagement and the nature and limitations of the services we will provide.

**Scope of Services:**
We will prepare your {{service_type}} for the period ending [DATE]. Our work will be performed in accordance with professional standards.

**Client Responsibilities:**
You are responsible for providing us with all the information required for our engagement. You have the final responsibility for the [tax return/financial statements].

**Fees:**
Our fee for these services will be {{fee_amount}}. Payment is due upon completion of services.

**Timeline:**
We will complete your {{service_type}} by {{due_date}}.

Please sign and return one copy of this letter to indicate your acknowledgment and agreement with the terms set forth.

Sincerely,

{{firm_name}}
{{firm_address}}
{{firm_phone}}

---
Client Acknowledgment:

I acknowledge that I have read and understand the terms of this engagement letter.

Client Signature: _________________________ Date: _________

{{client_name}}
`;

export function WhiteLabelTemplateEditor() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    template_name: '',
    template_type: 'engagement_letter',
    template_content: '',
    variables: [] as TemplateVariable[]
  });
  const [brandingSettings, setBrandingSettings] = useState({
    primary_color: '#0066CC',
    secondary_color: '#333333',
    logo_url: '',
    firm_name: '',
    firm_address: '',
    firm_phone: '',
    firm_email: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
    loadBrandingSettings();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data: cpaPartner, error: partnerError } = await supabase
        .from('cpa_partners')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (partnerError || !cpaPartner) {
        toast({
          title: "Error",
          description: "Could not find CPA partner profile",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('cpa_partner_id', cpaPartner.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTemplates((data as DocumentTemplate[]) || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to load document templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBrandingSettings = async () => {
    try {
      const { data: cpaPartner, error } = await supabase
        .from('cpa_partners')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (error || !cpaPartner) return;

      setBrandingSettings({
        primary_color: '#0066CC',
        secondary_color: '#333333',
        logo_url: '',
        firm_name: cpaPartner.firm_name || '',
        firm_address: (cpaPartner.office_address as any)?.street || '',
        firm_phone: cpaPartner.phone || '',
        firm_email: ''
      });
    } catch (error) {
      console.error('Error loading branding settings:', error);
    }
  };

  const createTemplate = async () => {
    try {
      const { data: cpaPartner, error: partnerError } = await supabase
        .from('cpa_partners')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (partnerError || !cpaPartner) throw partnerError;

      const { error } = await supabase
        .from('document_templates')
        .insert({
          cpa_partner_id: cpaPartner.id,
          template_name: newTemplate.template_name,
          template_type: newTemplate.template_type,
          template_content: newTemplate.template_content || defaultEngagementLetterTemplate,
          variables: newTemplate.variables as any
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Template created successfully",
      });

      setShowCreateDialog(false);
      setNewTemplate({
        template_name: '',
        template_type: 'engagement_letter',
        template_content: '',
        variables: []
      });
      
      fetchTemplates();
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      });
    }
  };

  const duplicateTemplate = async (template: DocumentTemplate) => {
    try {
      const { data: cpaPartner, error: partnerError } = await supabase
        .from('cpa_partners')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (partnerError || !cpaPartner) throw partnerError;

      const { error } = await supabase
        .from('document_templates')
        .insert({
          cpa_partner_id: cpaPartner.id,
          template_name: `${template.template_name} (Copy)`,
          template_type: template.template_type,
          template_content: template.template_content,
          variables: template.variables
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Template duplicated successfully",
      });
      
      fetchTemplates();
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate template",
        variant: "destructive",
      });
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      const { error } = await supabase
        .from('document_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
      
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    }
  };

  const renderTemplatePreview = (content: string) => {
    let previewContent = content;
    
    // Replace common variables with sample data
    previewContent = previewContent.replace(/{{client_name}}/g, 'John Smith');
    previewContent = previewContent.replace(/{{firm_name}}/g, brandingSettings.firm_name || 'Your Firm Name');
    previewContent = previewContent.replace(/{{service_type}}/g, 'Tax Preparation');
    previewContent = previewContent.replace(/{{fee_amount}}/g, '$2,500');
    previewContent = previewContent.replace(/{{due_date}}/g, new Date().toLocaleDateString());
    previewContent = previewContent.replace(/{{engagement_date}}/g, new Date().toLocaleDateString());
    previewContent = previewContent.replace(/{{firm_address}}/g, brandingSettings.firm_address || 'Your Firm Address');
    previewContent = previewContent.replace(/{{firm_phone}}/g, brandingSettings.firm_phone || 'Your Firm Phone');
    
    return previewContent;
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <DashboardHeader 
          heading="White-Label Template Editor"
          text="Create and customize professional document templates with your firm's branding"
        />
        
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Branding
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Firm Branding Settings
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="primary_color">Primary Color</Label>
                    <Input
                      id="primary_color"
                      type="color"
                      value={brandingSettings.primary_color}
                      onChange={(e) => setBrandingSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondary_color">Secondary Color</Label>
                    <Input
                      id="secondary_color"
                      type="color"
                      value={brandingSettings.secondary_color}
                      onChange={(e) => setBrandingSettings(prev => ({ ...prev, secondary_color: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="firm_name">Firm Name</Label>
                  <Input
                    id="firm_name"
                    value={brandingSettings.firm_name}
                    onChange={(e) => setBrandingSettings(prev => ({ ...prev, firm_name: e.target.value }))}
                    placeholder="Your CPA Firm Name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="firm_address">Firm Address</Label>
                  <Textarea
                    id="firm_address"
                    value={brandingSettings.firm_address}
                    onChange={(e) => setBrandingSettings(prev => ({ ...prev, firm_address: e.target.value }))}
                    placeholder="123 Main St, City, State 12345"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="firm_phone">Firm Phone</Label>
                  <Input
                    id="firm_phone"
                    value={brandingSettings.firm_phone}
                    onChange={(e) => setBrandingSettings(prev => ({ ...prev, firm_phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Branding Settings
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Document Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="template_name">Template Name</Label>
                    <Input
                      id="template_name"
                      value={newTemplate.template_name}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, template_name: e.target.value }))}
                      placeholder="Standard Engagement Letter"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="template_type">Template Type</Label>
                    <Select 
                      value={newTemplate.template_type} 
                      onValueChange={(value) => setNewTemplate(prev => ({ ...prev, template_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {defaultTemplateTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="template_content">Template Content</Label>
                  <Textarea
                    id="template_content"
                    value={newTemplate.template_content || defaultEngagementLetterTemplate}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, template_content: e.target.value }))}
                    placeholder="Enter your template content here..."
                    rows={15}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Use variables like: {`{{client_name}} {{firm_name}} {{service_type}} {{fee_amount}}`}, etc.
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={createTemplate} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">My Templates</TabsTrigger>
          <TabsTrigger value="editor">Template Editor</TabsTrigger>
          <TabsTrigger value="preview">Live Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          {templates.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">No Templates Yet</h3>
                    <p className="text-muted-foreground">
                      Create your first white-label document template to maintain consistent branding across all client communications.
                    </p>
                  </div>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{template.template_name}</CardTitle>
                      <Badge variant={template.is_active ? "default" : "secondary"}>
                        {template.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {template.template_type.replace('_', ' ')}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="font-medium">Created:</span>{' '}
                        {new Date(template.created_at).toLocaleDateString()}
                      </div>
                      
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => duplicateTemplate(template)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteTemplate(template.id)}
                        >
                          <Trash2 className="h-3 w-3 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <Label htmlFor="editor_content">Template Content</Label>
                  <Textarea
                    id="editor_content"
                    value={selectedTemplate?.template_content || defaultEngagementLetterTemplate}
                    onChange={(e) => {
                      if (selectedTemplate) {
                        setSelectedTemplate({
                          ...selectedTemplate,
                          template_content: e.target.value
                        });
                      }
                    }}
                    rows={20}
                    className="font-mono text-sm"
                  />
                </div>
                <div>
                  <Label>Available Variables</Label>
                  <div className="mt-2 space-y-2 max-h-96 overflow-y-auto border rounded-lg p-4">
                    {commonVariables.map((variable) => (
                      <div key={variable.key} className="flex items-center justify-between p-2 rounded border">
                        <div>
                          <div className="font-medium">{variable.label}</div>
                          <div className="text-sm text-muted-foreground">{`{{${variable.key}}}`}</div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(`{{${variable.key}}}`);
                            toast({ title: "Copied", description: "Variable copied to clipboard" });
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="p-6 border rounded-lg bg-white text-black min-h-96"
                style={{ 
                  borderColor: brandingSettings.primary_color,
                  fontFamily: 'Times New Roman, serif'
                }}
              >
                <div 
                  className="text-center mb-6 pb-4 border-b-2"
                  style={{ borderColor: brandingSettings.primary_color }}
                >
                  <h1 
                    className="text-2xl font-bold mb-2"
                    style={{ color: brandingSettings.primary_color }}
                  >
                    {brandingSettings.firm_name || 'Your Firm Name'}
                  </h1>
                  <p className="text-sm" style={{ color: brandingSettings.secondary_color }}>
                    {brandingSettings.firm_address || 'Your Firm Address'} | {brandingSettings.firm_phone || 'Your Firm Phone'}
                  </p>
                </div>
                
                <div className="whitespace-pre-wrap">
                  {renderTemplatePreview(selectedTemplate?.template_content || defaultEngagementLetterTemplate)}
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Full Screen Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
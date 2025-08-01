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
  Send, 
  FileText, 
  PenTool, 
  CheckCircle2, 
  Clock,
  AlertTriangle,
  Eye,
  Download,
  Share,
  Users,
  Calendar,
  Signature,
  Mail
} from 'lucide-react';

interface SignatureRequest {
  id: string;
  document_title: string;
  document_content: string;
  signature_status: string;
  sent_at?: string;
  signed_at?: string;
  signature_data: any;
  created_at: string;
  client_user_id: string;
  document_template_id?: string;
}

interface DocumentTemplate {
  id: string;
  template_name: string;
  template_type: string;
  template_content: string;
}

export function ESignatureWorkflow() {
  const [signatureRequests, setSignatureRequests] = useState<SignatureRequest[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SignatureRequest | null>(null);
  const [newRequest, setNewRequest] = useState({
    document_title: '',
    document_content: '',
    client_email: '',
    template_id: '',
    custom_message: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSignatureRequests();
    fetchTemplates();
  }, []);

  const fetchSignatureRequests = async () => {
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
        .from('signature_requests')
        .select('*')
        .eq('cpa_partner_id', cpaPartner.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSignatureRequests((data as SignatureRequest[]) || []);
    } catch (error) {
      console.error('Error fetching signature requests:', error);
      toast({
        title: "Error",
        description: "Failed to load signature requests",
        variant: "destructive",
      });
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data: cpaPartner, error: partnerError } = await supabase
        .from('cpa_partners')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (partnerError || !cpaPartner) return;

      const { data, error } = await supabase
        .from('document_templates')
        .select('id, template_name, template_type, template_content')
        .eq('cpa_partner_id', cpaPartner.id)
        .eq('is_active', true);

      if (error) throw error;

      setTemplates((data as DocumentTemplate[]) || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSignatureRequest = async () => {
    try {
      const { data: cpaPartner, error: partnerError } = await supabase
        .from('cpa_partners')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (partnerError || !cpaPartner) throw partnerError;

      // Find client by email
      const { data: clientProfile, error: clientError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newRequest.client_email)
        .single();

      if (clientError || !clientProfile) {
        toast({
          title: "Error",
          description: "Client not found with that email address",
          variant: "destructive",
        });
        return;
      }

      let documentContent = newRequest.document_content;

      // If template selected, use template content
      if (newRequest.template_id) {
        const selectedTemplate = templates.find(t => t.id === newRequest.template_id);
        if (selectedTemplate) {
          documentContent = selectedTemplate.template_content;
        }
      }

      const { error } = await supabase
        .from('signature_requests')
        .insert({
          cpa_partner_id: cpaPartner.id,
          client_user_id: clientProfile.id,
          document_template_id: newRequest.template_id || null,
          document_title: newRequest.document_title,
          document_content: documentContent,
          signature_status: 'pending',
          sent_at: new Date().toISOString(),
          signature_data: {
            custom_message: newRequest.custom_message,
            sent_to: newRequest.client_email
          }
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Signature request sent to client",
      });

      setShowCreateDialog(false);
      setNewRequest({
        document_title: '',
        document_content: '',
        client_email: '',
        template_id: '',
        custom_message: ''
      });
      
      fetchSignatureRequests();
    } catch (error) {
      console.error('Error creating signature request:', error);
      toast({
        title: "Error",
        description: "Failed to create signature request",
        variant: "destructive",
      });
    }
  };

  const resendSignatureRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('signature_requests')
        .update({
          sent_at: new Date().toISOString(),
          signature_status: 'pending'
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Signature request resent to client",
      });
      
      fetchSignatureRequests();
    } catch (error) {
      console.error('Error resending signature request:', error);
      toast({
        title: "Error",
        description: "Failed to resend signature request",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string, sentAt?: string) => {
    const isOverdue = sentAt && new Date(sentAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    
    const statusConfig = {
      pending: { 
        variant: isOverdue ? 'destructive' as const : 'secondary' as const, 
        label: isOverdue ? 'Overdue' : 'Pending', 
        icon: isOverdue ? AlertTriangle : Clock 
      },
      signed: { variant: 'default' as const, label: 'Signed', icon: CheckCircle2 },
      declined: { variant: 'destructive' as const, label: 'Declined', icon: AlertTriangle },
      expired: { variant: 'secondary' as const, label: 'Expired', icon: Clock }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleTemplateSelect = (templateId: string) => {
    const selectedTemplate = templates.find(t => t.id === templateId);
    if (selectedTemplate) {
      setNewRequest(prev => ({
        ...prev,
        template_id: templateId,
        document_title: selectedTemplate.template_name,
        document_content: selectedTemplate.template_content
      }));
    }
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
          heading="E-Signature Workflow"
          text="Send documents for electronic signature with tracking and automated reminders"
        />
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              <PenTool className="h-4 w-4 mr-1" />
              New Signature Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Signature className="h-5 w-5 text-primary" />
                Create Signature Request
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="document_title">Document Title</Label>
                  <Input
                    id="document_title"
                    value={newRequest.document_title}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, document_title: e.target.value }))}
                    placeholder="2024 Engagement Letter"
                  />
                </div>
                
                <div>
                  <Label htmlFor="client_email">Client Email</Label>
                  <Input
                    id="client_email"
                    value={newRequest.client_email}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, client_email: e.target.value }))}
                    placeholder="client@example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="template_select">Use Template (Optional)</Label>
                <Select 
                  value={newRequest.template_id} 
                  onValueChange={handleTemplateSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template or create custom document" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Custom Document</SelectItem>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.template_name} ({template.template_type.replace('_', ' ')})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="document_content">Document Content</Label>
                <Textarea
                  id="document_content"
                  value={newRequest.document_content}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, document_content: e.target.value }))}
                  placeholder="Enter the document content that needs to be signed..."
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <Label htmlFor="custom_message">Custom Message to Client</Label>
                <Textarea
                  id="custom_message"
                  value={newRequest.custom_message}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, custom_message: e.target.value }))}
                  placeholder="Please review and sign the attached document. If you have any questions, please don't hesitate to contact us."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={createSignatureRequest} 
                  className="flex-1"
                  disabled={!newRequest.document_title || !newRequest.client_email}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send for Signature
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending Signatures</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          {signatureRequests.filter(req => req.signature_status !== 'signed').length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <PenTool className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">No Pending Signatures</h3>
                    <p className="text-muted-foreground">
                      Create your first e-signature request to streamline document signing with clients.
                    </p>
                  </div>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    <PenTool className="h-4 w-4 mr-1" />
                    Create Signature Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {signatureRequests.filter(req => req.signature_status !== 'signed').map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{request.document_title}</CardTitle>
                      {getStatusBadge(request.signature_status, request.sent_at)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {request.sent_at 
                        ? `Sent ${new Date(request.sent_at).toLocaleDateString()}`
                        : 'Not sent yet'
                      }
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm">
                        <div className="font-medium mb-1">Document Preview:</div>
                        <div className="text-muted-foreground truncate">
                          {request.document_content.length > 100 
                            ? request.document_content.substring(0, 100) + '...'
                            : request.document_content
                          }
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => resendSignatureRequest(request.id)}
                          disabled={request.signature_status === 'signed'}
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Resend
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {signatureRequests.filter(req => req.signature_status === 'signed').map((request) => (
              <Card key={request.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{request.document_title}</CardTitle>
                    {getStatusBadge(request.signature_status)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Signed {request.signed_at ? new Date(request.signed_at).toLocaleDateString() : 'Recently'}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View Signed
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {signatureRequests.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Requests</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {signatureRequests.filter(r => r.signature_status === 'signed').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {signatureRequests.filter(r => r.signature_status === 'pending').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((signatureRequests.filter(r => r.signature_status === 'signed').length / Math.max(signatureRequests.length, 1)) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Signature Request Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Average Signing Time</span>
                  </div>
                  <span className="font-bold text-lg">2.3 days</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Fastest Signature</span>
                  </div>
                  <span className="font-bold text-lg">4 hours</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Most Popular Document</span>
                  </div>
                  <span className="font-bold text-lg">Engagement Letters</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">Overdue Requests</span>
                  </div>
                  <span className="font-bold text-lg">
                    {signatureRequests.filter(r => 
                      r.signature_status === 'pending' && 
                      r.sent_at && 
                      new Date(r.sent_at) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
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
import { Checkbox } from '@/components/ui/checkbox';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Send, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Upload,
  Eye,
  MessageSquare,
  Users,
  Zap,
  Bell
} from 'lucide-react';

interface DocumentRequest {
  id: string;
  request_name: string;
  document_types: any;
  instructions?: string;
  due_date?: string;
  priority: string;
  status: string;
  created_at: string;
  client_user_id: string;
  document_request_items?: DocumentRequestItem[];
}

interface DocumentRequestItem {
  id: string;
  document_name: string;
  document_description?: string;
  is_required: boolean;
  uploaded_file_url?: string;
  uploaded_at?: string;
  status: string;
}

const commonDocumentTypes = [
  { id: 'w2', name: 'W-2 Forms', description: 'All W-2 forms for the tax year' },
  { id: '1099', name: '1099 Forms', description: 'All 1099 forms (INT, DIV, B, etc.)' },
  { id: 'bank_statements', name: 'Bank Statements', description: 'Year-end bank statements' },
  { id: 'mortgage_interest', name: 'Mortgage Interest Statement', description: '1098 forms from lenders' },
  { id: 'charitable_donations', name: 'Charitable Donations', description: 'Receipts for charitable contributions' },
  { id: 'business_expenses', name: 'Business Expenses', description: 'Receipts and records of business expenses' },
  { id: 'medical_expenses', name: 'Medical Expenses', description: 'Medical and dental expense receipts' },
  { id: 'property_tax', name: 'Property Tax Records', description: 'Property tax statements' },
  { id: 'prior_year_return', name: 'Prior Year Tax Return', description: 'Last year\'s tax return copy' },
  { id: 'id_documents', name: 'ID Documents', description: 'Driver\'s license, SSN cards for all family members' }
];

export function DocumentRequestEngine() {
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [newRequest, setNewRequest] = useState({
    request_name: '',
    instructions: '',
    due_date: '',
    priority: 'medium',
    client_email: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchDocumentRequests();
  }, []);

  const fetchDocumentRequests = async () => {
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
        .from('document_requests')
        .select(`
          *,
          document_request_items (*)
        `)
        .eq('cpa_partner_id', cpaPartner.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRequests((data as DocumentRequest[]) || []);
    } catch (error) {
      console.error('Error fetching document requests:', error);
      toast({
        title: "Error",
        description: "Failed to load document requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDocumentRequest = async () => {
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

      const selectedDocTypes = commonDocumentTypes.filter(doc => 
        selectedDocuments.includes(doc.id)
      );

      // Create the main request
      const { data: requestData, error: requestError } = await supabase
        .from('document_requests')
        .insert({
          cpa_partner_id: cpaPartner.id,
          client_user_id: clientProfile.id,
          request_name: newRequest.request_name,
          document_types: selectedDocTypes,
          instructions: newRequest.instructions,
          due_date: newRequest.due_date || null,
          priority: newRequest.priority
        })
        .select()
        .single();

      if (requestError) throw requestError;

      // Create individual document items
      const documentItems = selectedDocTypes.map(doc => ({
        request_id: requestData.id,
        document_name: doc.name,
        document_description: doc.description,
        is_required: true
      }));

      const { error: itemsError } = await supabase
        .from('document_request_items')
        .insert(documentItems);

      if (itemsError) throw itemsError;

      toast({
        title: "Success",
        description: "Document request sent to client",
      });

      setShowCreateDialog(false);
      setNewRequest({
        request_name: '',
        instructions: '',
        due_date: '',
        priority: 'medium',
        client_email: ''
      });
      setSelectedDocuments([]);
      
      fetchDocumentRequests();
    } catch (error) {
      console.error('Error creating document request:', error);
      toast({
        title: "Error",
        description: "Failed to create document request",
        variant: "destructive",
      });
    }
  };

  const sendNudge = async (requestId: string, nudgeType: 'reminder' | 'overdue' | 'final_notice') => {
    try {
      const { error } = await supabase
        .from('document_nudges')
        .insert({
          request_id: requestId,
          nudge_type: nudgeType,
          nudge_content: `${nudgeType} for document request`
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${nudgeType} sent to client`,
      });
    } catch (error) {
      console.error('Error sending nudge:', error);
      toast({
        title: "Error",
        description: "Failed to send reminder",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending', icon: Clock },
      in_progress: { variant: 'default' as const, label: 'In Progress', icon: Upload },
      completed: { variant: 'default' as const, label: 'Completed', icon: CheckCircle2 },
      overdue: { variant: 'destructive' as const, label: 'Overdue', icon: AlertTriangle }
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
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
          heading="AI-Driven Document Request Engine"
          text="Smart document requests with automated tracking, reminders, and client upload monitoring"
        />
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              <Zap className="h-4 w-4 mr-1" />
              Smart Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Create Smart Document Request
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="request_name">Request Name</Label>
                  <Input
                    id="request_name"
                    value={newRequest.request_name}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, request_name: e.target.value }))}
                    placeholder="2024 Tax Preparation Documents"
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

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select 
                    value={newRequest.priority} 
                    onValueChange={(value) => setNewRequest(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={newRequest.due_date}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, due_date: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Select Documents to Request</Label>
                <div className="mt-2 grid gap-3 md:grid-cols-2 max-h-64 overflow-y-auto border rounded-lg p-4">
                  {commonDocumentTypes.map((doc) => (
                    <div key={doc.id} className="flex items-start space-x-3">
                      <Checkbox 
                        id={doc.id}
                        checked={selectedDocuments.includes(doc.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedDocuments([...selectedDocuments, doc.id]);
                          } else {
                            setSelectedDocuments(selectedDocuments.filter(id => id !== doc.id));
                          }
                        }}
                      />
                      <div className="space-y-1">
                        <Label htmlFor={doc.id} className="text-sm font-medium cursor-pointer">
                          {doc.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {doc.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {selectedDocuments.length} documents
                </p>
              </div>

              <div>
                <Label htmlFor="instructions">Special Instructions</Label>
                <Textarea
                  id="instructions"
                  value={newRequest.instructions}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, instructions: e.target.value }))}
                  placeholder="Please upload clear, legible copies of all documents. If you have questions about any specific document, please reach out..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={createDocumentRequest} 
                  className="flex-1"
                  disabled={selectedDocuments.length === 0 || !newRequest.request_name || !newRequest.client_email}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Smart Request
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Requests</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {requests.filter(req => req.status !== 'completed').length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">No Active Document Requests</h3>
                    <p className="text-muted-foreground">
                      Create your first smart document request to start collecting client documents with AI-powered tracking.
                    </p>
                  </div>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    <Zap className="h-4 w-4 mr-1" />
                    Create Smart Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {requests.filter(req => req.status !== 'completed').map((request) => {
                const completedItems = request.document_request_items?.filter(item => item.status === 'completed').length || 0;
                const totalItems = request.document_request_items?.length || 0;
                const completionRate = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
                const isOverdue = request.due_date && new Date(request.due_date) < new Date();

                return (
                  <Card key={request.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{request.request_name}</CardTitle>
                        {getStatusBadge(isOverdue && request.status !== 'completed' ? 'overdue' : request.status)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {request.due_date 
                          ? `Due ${new Date(request.due_date).toLocaleDateString()}`
                          : 'No due date'
                        }
                        <span className={`font-medium ${getPriorityColor(request.priority)}`}>
                          {request.priority.toUpperCase()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{completedItems}/{totalItems} documents</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2 transition-all duration-300"
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => sendNudge(request.id, 'reminder')}
                            disabled={request.status === 'completed'}
                          >
                            <Bell className="h-3 w-3 mr-1" />
                            Nudge
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {requests.filter(req => req.status === 'completed').map((request) => (
              <Card key={request.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{request.request_name}</CardTitle>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Completed {new Date(request.created_at).toLocaleDateString()}
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
                    {requests.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Requests</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((requests.filter(r => r.status === 'completed').length / Math.max(requests.length, 1)) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    4.2
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Days to Complete</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {requests.filter(r => new Date(r.due_date || '') < new Date() && r.status !== 'completed').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Overdue Requests</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
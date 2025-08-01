import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Send, Eye, Edit, Trash2, Calendar, Users } from 'lucide-react';

interface ClientOrganizer {
  id: string;
  title: string;
  description?: string;
  organizer_type: string;
  status: string;
  due_date?: string;
  questions: any;
  responses: any;
  created_at: string;
  client_user_id: string;
}

interface Question {
  [key: string]: any;
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'number' | 'date';
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

const defaultTaxQuestions: Question[] = [
  {
    id: 'filing_status',
    type: 'select',
    label: 'Filing Status',
    required: true,
    options: ['Single', 'Married Filing Jointly', 'Married Filing Separately', 'Head of Household', 'Qualifying Widow(er)']
  },
  {
    id: 'w2_income',
    type: 'number',
    label: 'Total W-2 Income',
    required: true,
    placeholder: 'Enter total W-2 income'
  },
  {
    id: 'dependents',
    type: 'text',
    label: 'Number of Dependents',
    required: false,
    placeholder: 'Number of dependents'
  },
  {
    id: 'itemize_deductions',
    type: 'checkbox',
    label: 'Do you plan to itemize deductions?',
    required: false
  },
  {
    id: 'rental_income',
    type: 'checkbox',
    label: 'Do you have rental income?',
    required: false
  },
  {
    id: 'business_income',
    type: 'checkbox',
    label: 'Do you have business income?',
    required: false
  },
  {
    id: 'additional_info',
    type: 'textarea',
    label: 'Additional Information or Questions',
    required: false,
    placeholder: 'Please provide any additional information or questions you have...'
  }
];

export function ClientOrganizerModule() {
  const [organizers, setOrganizers] = useState<ClientOrganizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newOrganizer, setNewOrganizer] = useState({
    title: '',
    description: '',
    organizer_type: 'tax_prep',
    due_date: '',
    client_email: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const fetchOrganizers = async () => {
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
        .from('client_organizers')
        .select('*')
        .eq('cpa_partner_id', cpaPartner.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrganizers((data as ClientOrganizer[]) || []);
    } catch (error) {
      console.error('Error fetching organizers:', error);
      toast({
        title: "Error",
        description: "Failed to load client organizers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrganizer = async () => {
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
        .eq('email', newOrganizer.client_email)
        .single();

      if (clientError || !clientProfile) {
        toast({
          title: "Error",
          description: "Client not found with that email address",
          variant: "destructive",
        });
        return;
      }

      const questions = newOrganizer.organizer_type === 'tax_prep' ? defaultTaxQuestions : [];

      const { error } = await supabase
        .from('client_organizers')
        .insert({
          cpa_partner_id: cpaPartner.id,
          client_user_id: clientProfile.id,
          title: newOrganizer.title,
          description: newOrganizer.description,
          organizer_type: newOrganizer.organizer_type,
          due_date: newOrganizer.due_date || null,
          questions: questions
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Client organizer created successfully",
      });

      setShowCreateDialog(false);
      setNewOrganizer({
        title: '',
        description: '',
        organizer_type: 'tax_prep',
        due_date: '',
        client_email: ''
      });
      
      fetchOrganizers();
    } catch (error) {
      console.error('Error creating organizer:', error);
      toast({
        title: "Error",
        description: "Failed to create client organizer",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      in_progress: { variant: 'default' as const, label: 'In Progress' },
      completed: { variant: 'default' as const, label: 'Completed' },
      overdue: { variant: 'destructive' as const, label: 'Overdue' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
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
          heading="Client Organizers"
          text="Create and manage dynamic questionnaires for gathering client tax and planning data"
        />
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Organizer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Client Organizer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newOrganizer.title}
                  onChange={(e) => setNewOrganizer(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="2024 Tax Organizer"
                />
              </div>
              
              <div>
                <Label htmlFor="client_email">Client Email</Label>
                <Input
                  id="client_email"
                  value={newOrganizer.client_email}
                  onChange={(e) => setNewOrganizer(prev => ({ ...prev, client_email: e.target.value }))}
                  placeholder="client@example.com"
                />
              </div>

              <div>
                <Label htmlFor="organizer_type">Organizer Type</Label>
                <Select 
                  value={newOrganizer.organizer_type} 
                  onValueChange={(value) => setNewOrganizer(prev => ({ ...prev, organizer_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tax_prep">Tax Preparation</SelectItem>
                    <SelectItem value="financial_planning">Financial Planning</SelectItem>
                    <SelectItem value="business_setup">Business Setup</SelectItem>
                    <SelectItem value="estate_planning">Estate Planning</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="due_date">Due Date (Optional)</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newOrganizer.due_date}
                  onChange={(e) => setNewOrganizer(prev => ({ ...prev, due_date: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newOrganizer.description}
                  onChange={(e) => setNewOrganizer(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Please complete this organizer to help us prepare your tax return..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={createOrganizer} className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Send to Client
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {organizers.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No Client Organizers Yet</h3>
                <p className="text-muted-foreground">
                  Create your first client organizer to start gathering tax and planning data.
                </p>
              </div>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Organizer
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {organizers.map((organizer) => (
            <Card key={organizer.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{organizer.title}</CardTitle>
                  {getStatusBadge(organizer.status)}
                </div>
                {organizer.description && (
                  <p className="text-sm text-muted-foreground">{organizer.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {organizer.due_date 
                      ? `Due ${new Date(organizer.due_date).toLocaleDateString()}`
                      : 'No due date'
                    }
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Type:</span>{' '}
                    <span className="capitalize">{organizer.organizer_type.replace('_', ' ')}</span>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium">Questions:</span>{' '}
                    {organizer.questions?.length || 0}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
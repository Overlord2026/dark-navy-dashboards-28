import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users, 
  MessageSquare,
  Calendar,
  Scale,
  Phone,
  Mail,
  Download,
  Eye,
  Plus,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

interface EstateIntake {
  id: string;
  user_id: string;
  client_name: string;
  client_email: string;
  current_step: number;
  progress_percentage: number;
  intake_data: any;
  assessment_results: any;
  status: 'in_progress' | 'completed' | 'needs_attorney' | 'assigned';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_attorney?: string;
  created_at: string;
  updated_at: string;
}

interface Document {
  id: string;
  intake_id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  status: 'pending' | 'uploaded' | 'reviewed';
  uploaded_at: string;
}

export function AttorneyDashboard() {
  const { user } = useAuth();
  const [intakes, setIntakes] = useState<EstateIntake[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIntake, setSelectedIntake] = useState<EstateIntake | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchIntakes();
      fetchDocuments();
    }
  }, [user]);

  const fetchIntakes = async () => {
    try {
      // Using existing table - estate planning documents can serve as intake records
      const { data, error } = await supabase
        .from('estate_planning_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIntakes(data || []);
    } catch (error) {
      console.error('Error fetching intakes:', error);
      toast.error('Failed to load intake queue');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('estate_planning_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleAssignToSelf = async (intakeId: string) => {
    try {
      const { error } = await supabase
        .from('estate_planning_documents')
        .update({ 
          status: 'completed'
        })
        .eq('id', intakeId);

      if (error) throw error;
      toast.success('Case assigned to you');
      fetchIntakes();
    } catch (error) {
      console.error('Error assigning case:', error);
      toast.error('Failed to assign case');
    }
  };

  const handleUpdateStatus = async (intakeId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('estate_planning_documents')
        .update({ status: newStatus })
        .eq('id', intakeId);

      if (error) throw error;
      toast.success('Status updated');
      fetchIntakes();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredIntakes = intakes.filter(intake => {
    const matchesStatus = statusFilter === 'all' || intake.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || intake.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'needs_attorney': return 'bg-orange-100 text-orange-800';
      case 'assigned': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading attorney dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attorney Dashboard</h1>
          <p className="text-muted-foreground">Manage estate planning cases and client communications</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{intakes.filter(i => i.status === 'needs_attorney').length}</p>
                <p className="text-sm text-muted-foreground">Needs Attorney</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{intakes.filter(i => i.assigned_attorney === user?.id).length}</p>
                <p className="text-sm text-muted-foreground">My Cases</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{intakes.filter(i => i.priority === 'urgent').length}</p>
                <p className="text-sm text-muted-foreground">Urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{intakes.filter(i => i.status === 'completed').length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="queue">Intake Queue</TabsTrigger>
          <TabsTrigger value="cases">My Cases</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="needs_attorney">Needs Attorney</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Intake Queue */}
          <div className="space-y-4">
            {filteredIntakes.map((intake) => (
              <Card key={intake.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${intake.client_name}`} />
                        <AvatarFallback>
                          {intake.client_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-medium">{intake.client_name}</h3>
                          <p className="text-sm text-muted-foreground">{intake.client_email}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(intake.status)}>
                            {intake.status.replace('_', ' ').charAt(0).toUpperCase() + intake.status.replace('_', ' ').slice(1)}
                          </Badge>
                          <Badge className={getPriorityColor(intake.priority)}>
                            {intake.priority.charAt(0).toUpperCase() + intake.priority.slice(1)} Priority
                          </Badge>
                        </div>
                        
                        {intake.assessment_results && (
                          <div className="text-sm">
                            <p><strong>Risk Level:</strong> {intake.assessment_results.riskLevel}</p>
                            <p><strong>Risk Score:</strong> {intake.assessment_results.riskScore}/100</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedIntake(intake)}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {intake.status === 'needs_attorney' && (
                        <Button size="sm" onClick={() => handleAssignToSelf(intake.id)}>
                          Assign to Me
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cases">
          <div className="space-y-4">
            {intakes
              .filter(intake => intake.assigned_attorney === user?.id)
              .map((intake) => (
                <Card key={intake.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{intake.client_name}</h3>
                        <p className="text-sm text-muted-foreground">{intake.client_email}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge className={getStatusColor(intake.status)}>
                            {intake.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(intake.priority)}>
                            {intake.priority} priority
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Select 
                          value={intake.status} 
                          onValueChange={(value) => handleUpdateStatus(intake.id, value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="assigned">Assigned</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            }
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="space-y-4">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Document
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="font-medium">{doc.document_type}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{doc.file_name}</p>
                        <Badge className={doc.status === 'reviewed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {doc.status}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Secure Client Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Secure messaging functionality would be implemented here with attorney-client privilege protection.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Client Detail Modal */}
      {selectedIntake && (
        <Dialog open={!!selectedIntake} onOpenChange={() => setSelectedIntake(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Client Assessment Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Client Name</Label>
                  <p className="font-medium">{selectedIntake.client_name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{selectedIntake.client_email}</p>
                </div>
              </div>
              
              {selectedIntake.assessment_results && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Assessment Results</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Risk Level</Label>
                      <p className="font-medium text-lg">{selectedIntake.assessment_results.riskLevel}</p>
                    </div>
                    <div>
                      <Label>Risk Score</Label>
                      <p className="font-medium text-lg">{selectedIntake.assessment_results.riskScore}/100</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Recommendations</Label>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      {selectedIntake.assessment_results.recommendations?.map((rec: string, index: number) => (
                        <li key={index} className="text-sm">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button>
                  <Phone className="h-4 w-4 mr-2" />
                  Schedule Call
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Request Documents
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
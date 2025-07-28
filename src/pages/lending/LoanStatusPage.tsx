import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  FileText, 
  Users, 
  DollarSign,
  Calendar,
  Bell
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface LoanStatus {
  id: string;
  loan_type: string;
  requested_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  application_data: any;
  eligibility_result: any;
  assigned_advisor?: string;
  matched_partners: any[];
  messages_count: number;
  documents_count: number;
  compliance_status: string;
}

interface StatusUpdate {
  id: string;
  status: string;
  message: string;
  created_at: string;
  created_by: string;
}

const STATUS_CONFIG = {
  'pending_review': { label: 'Under Review', color: 'bg-yellow-500', icon: Clock },
  'documents_required': { label: 'Documents Required', color: 'bg-orange-500', icon: FileText },
  'compliance_review': { label: 'Compliance Review', color: 'bg-blue-500', icon: AlertCircle },
  'partner_matching': { label: 'Partner Matching', color: 'bg-purple-500', icon: Users },
  'offers_available': { label: 'Offers Available', color: 'bg-green-500', icon: CheckCircle },
  'approved': { label: 'Approved', color: 'bg-green-600', icon: CheckCircle },
  'rejected': { label: 'Rejected', color: 'bg-red-500', icon: AlertCircle },
  'on_hold': { label: 'On Hold', color: 'bg-gray-500', icon: Clock }
};

export const LoanStatusPage: React.FC = () => {
  const { loanId } = useParams<{ loanId: string }>();
  const [loanStatus, setLoanStatus] = useState<LoanStatus | null>(null);
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);

  useEffect(() => {
    if (loanId) {
      fetchLoanStatus();
      fetchStatusUpdates();
      setupRealTimeUpdates();
    }
  }, [loanId]);

  const fetchLoanStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('loan_requests')
        .select('*')
        .eq('id', loanId)
        .single();

      if (error) throw error;
      
      // Transform data to match interface
      const transformedData: LoanStatus = {
        ...data,
        created_at: data.created_at || data.submitted_at || new Date().toISOString(),
        matched_partners: [],
        messages_count: 0,
        documents_count: 0,
        compliance_status: data.compliance_status || 'pending'
      };
      
      setLoanStatus(transformedData);
    } catch (error) {
      console.error('Error fetching loan status:', error);
      toast.error('Failed to load loan status');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('loan_status_updates')
        .select('*')
        .eq('loan_id', loanId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStatusUpdates(data || []);
    } catch (error) {
      console.error('Error fetching status updates:', error);
    }
  };

  const setupRealTimeUpdates = () => {
    const channel = supabase
      .channel('loan-status-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'loan_requests',
          filter: `id=eq.${loanId}`
        },
        (payload) => {
          console.log('Real-time loan update:', payload);
          setLoanStatus(payload.new as LoanStatus);
          toast.info('Loan status updated');
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'loan_status_updates',
          filter: `loan_id=eq.${loanId}`
        },
        (payload) => {
          console.log('New status update:', payload);
          setStatusUpdates(prev => [payload.new as StatusUpdate, ...prev]);
          toast.info('New status update received');
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealTimeEnabled(true);
          console.log('Real-time updates enabled');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getStatusProgress = (status: string): number => {
    const progressMap = {
      'pending_review': 20,
      'documents_required': 30,
      'compliance_review': 50,
      'partner_matching': 70,
      'offers_available': 85,
      'approved': 100,
      'rejected': 0,
      'on_hold': 40
    };
    return progressMap[status as keyof typeof progressMap] || 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!loanStatus) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Loan Application Not Found</h2>
            <p className="text-muted-foreground">
              The loan application you're looking for doesn't exist or you don't have access to it.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[loanStatus.status as keyof typeof STATUS_CONFIG];
  const StatusIcon = statusConfig?.icon || Clock;

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Loan Application Status</h1>
            <p className="text-muted-foreground">
              Track your {loanStatus.loan_type} application
            </p>
          </div>
          <div className="flex items-center gap-2">
            {realTimeEnabled && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live Updates
              </Badge>
            )}
            <Badge variant="outline">
              Application #{loanStatus.id.slice(-8)}
            </Badge>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-full ${statusConfig?.color || 'bg-gray-500'}`}>
                <StatusIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {statusConfig?.label || loanStatus.status}
                </h2>
                <p className="text-muted-foreground">
                  Last updated {format(new Date(loanStatus.updated_at), 'PPp')}
                </p>
              </div>
            </div>
            <Progress value={getStatusProgress(loanStatus.status)} className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <DollarSign className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loan Amount</p>
                <p className="font-semibold">${loanStatus.requested_amount.toLocaleString()}</p>
              </div>
              <div>
                <FileText className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Documents</p>
                <p className="font-semibold">{loanStatus.documents_count || 0} uploaded</p>
              </div>
              <div>
                <MessageSquare className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Messages</p>
                <p className="font-semibold">{loanStatus.messages_count || 0} messages</p>
              </div>
              <div>
                <Calendar className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Applied</p>
                <p className="font-semibold">{format(new Date(loanStatus.created_at), 'MMM d')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
              <CardDescription>
                Track the progress of your loan application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusUpdates.map((update, index) => (
                  <div key={update.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`p-2 rounded-full ${index === 0 ? 'bg-primary' : 'bg-muted'}`}>
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      {index < statusUpdates.length - 1 && (
                        <div className="w-px h-8 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">
                          {STATUS_CONFIG[update.status as keyof typeof STATUS_CONFIG]?.label || update.status}
                        </h4>
                        <time className="text-sm text-muted-foreground">
                          {format(new Date(update.created_at), 'MMM d, h:mm a')}
                        </time>
                      </div>
                      <p className="text-sm text-muted-foreground">{update.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Items */}
          <Card>
            <CardHeader>
              <CardTitle>Action Items</CardTitle>
              <CardDescription>
                Things you can do to move your application forward
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loanStatus.status === 'documents_required' && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium">Upload Missing Documents</p>
                        <p className="text-sm text-muted-foreground">
                          Complete your application by uploading required documents
                        </p>
                      </div>
                    </div>
                    <Button size="sm">Upload</Button>
                  </div>
                )}
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Message Your Advisor</p>
                      <p className="text-sm text-muted-foreground">
                        Ask questions or get updates on your application
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Message</Button>
                </div>

                {loanStatus.status === 'offers_available' && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Review Loan Offers</p>
                        <p className="text-sm text-muted-foreground">
                          Compare offers from matched lenders
                        </p>
                      </div>
                    </div>
                    <Button size="sm">View Offers</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Application Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Application Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Loan Type</p>
                <p className="font-medium">{loanStatus.loan_type}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Requested Amount</p>
                <p className="font-medium">${loanStatus.requested_amount.toLocaleString()}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Purpose</p>
                <p className="font-medium">{loanStatus.application_data?.purpose || 'Not specified'}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Compliance Status</p>
                <Badge variant={loanStatus.compliance_status === 'approved' ? 'default' : 'secondary'}>
                  {loanStatus.compliance_status || 'Pending'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <p><strong>Application Support:</strong></p>
                <p>Phone: (555) 123-4567</p>
                <p>Email: loans@mybfocfo.com</p>
                <p>Hours: Mon-Fri 9AM-6PM EST</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Start Live Chat
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <p className="font-medium">Email notifications enabled</p>
                    <p className="text-muted-foreground">
                      You'll receive updates via email
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <p className="font-medium">SMS notifications enabled</p>
                    <p className="text-muted-foreground">
                      Important updates via text message
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
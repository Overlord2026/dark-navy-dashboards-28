import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Users, 
  FileCheck, 
  TrendingUp, 
  Search, 
  Filter,
  Eye,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ClientLoan {
  id: string;
  client_name: string;
  loan_type: string;
  requested_amount: number;
  status: string;
  compliance_status: string;
  created_at: string;
  updated_at: string;
  priority: 'high' | 'medium' | 'low';
  documents_count: number;
  messages_count: number;
}

interface DashboardStats {
  total_applications: number;
  pending_review: number;
  approved_this_month: number;
  total_loan_volume: number;
  compliance_pending: number;
  documents_pending: number;
}

export const AdvisorLendingDashboard: React.FC = () => {
  const [loans, setLoans] = useState<ClientLoan[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_applications: 0,
    pending_review: 0,
    approved_this_month: 0,
    total_loan_volume: 0,
    compliance_pending: 0,
    documents_pending: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    fetchDashboardData();
    setupRealTimeUpdates();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data - replace with real API calls
      const mockLoans: ClientLoan[] = [
        {
          id: '1',
          client_name: 'John Smith',
          loan_type: 'Home Mortgage',
          requested_amount: 350000,
          status: 'pending_review',
          compliance_status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          priority: 'high',
          documents_count: 8,
          messages_count: 3
        },
        {
          id: '2',
          client_name: 'Sarah Johnson',
          loan_type: 'Personal Loan',
          requested_amount: 25000,
          status: 'documents_required',
          compliance_status: 'approved',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date().toISOString(),
          priority: 'medium',
          documents_count: 5,
          messages_count: 1
        },
        {
          id: '3',
          client_name: 'Mike Chen',
          loan_type: 'Business Loan',
          requested_amount: 150000,
          status: 'compliance_review',
          compliance_status: 'under_review',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date().toISOString(),
          priority: 'high',
          documents_count: 12,
          messages_count: 7
        }
      ];

      const mockStats: DashboardStats = {
        total_applications: 23,
        pending_review: 8,
        approved_this_month: 12,
        total_loan_volume: 2850000,
        compliance_pending: 5,
        documents_pending: 3
      };

      setLoans(mockLoans);
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    const channel = supabase
      .channel('advisor-lending-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'loan_requests'
        },
        (payload) => {
          console.log('Real-time loan update:', payload);
          fetchDashboardData(); // Refresh data
          toast.info('Loan applications updated');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.loan_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || loan.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    const colorMap = {
      'pending_review': 'bg-yellow-100 text-yellow-800',
      'documents_required': 'bg-orange-100 text-orange-800',
      'compliance_review': 'bg-blue-100 text-blue-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colorMap = {
      'high': 'border-l-red-500 bg-red-50',
      'medium': 'border-l-yellow-500 bg-yellow-50',
      'low': 'border-l-green-500 bg-green-50'
    };
    return colorMap[priority as keyof typeof colorMap] || 'border-l-gray-500 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Lending Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your clients' loan applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">{stats.total_applications}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{stats.pending_review}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Approved This Month</p>
                <p className="text-2xl font-bold">{stats.approved_this_month}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold">${(stats.total_loan_volume / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications">Loan Applications</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Review</TabsTrigger>
          <TabsTrigger value="documents">Document Review</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Client Loan Applications</CardTitle>
                  <CardDescription>
                    Review and manage your clients' loan applications
                  </CardDescription>
                </div>
                <Button>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by client name or loan type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending_review">Pending Review</SelectItem>
                    <SelectItem value="documents_required">Documents Required</SelectItem>
                    <SelectItem value="compliance_review">Compliance Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Loans List */}
              <div className="space-y-4">
                {filteredLoans.map((loan) => (
                  <Card key={loan.id} className={`border-l-4 ${getPriorityColor(loan.priority)}`}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold">{loan.client_name}</h3>
                            <p className="text-sm text-muted-foreground">{loan.loan_type}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(loan.status)}>
                              {loan.status.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {loan.priority} Priority
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="text-center">
                            <p className="font-semibold">${loan.requested_amount.toLocaleString()}</p>
                            <p className="text-muted-foreground">Amount</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">{loan.documents_count}</p>
                            <p className="text-muted-foreground">Documents</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">{loan.messages_count}</p>
                            <p className="text-muted-foreground">Messages</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">{format(new Date(loan.created_at), 'MMM d')}</p>
                            <p className="text-muted-foreground">Applied</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredLoans.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No applications found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Review Queue</CardTitle>
              <CardDescription>
                Review applications that require compliance approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loans.filter(loan => loan.compliance_status === 'pending' || loan.compliance_status === 'under_review').map((loan) => (
                  <Card key={loan.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{loan.client_name}</h3>
                          <p className="text-sm text-muted-foreground">{loan.loan_type} - ${loan.requested_amount.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {loan.compliance_status}
                          </Badge>
                          <Button size="sm">Review</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Document Review Queue</CardTitle>
              <CardDescription>
                Review and verify client documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loans.filter(loan => loan.status === 'documents_required').map((loan) => (
                  <Card key={loan.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{loan.client_name}</h3>
                          <p className="text-sm text-muted-foreground">{loan.loan_type} - {loan.documents_count} documents</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Review Documents
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Analytics charts coming soon</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Average Approval Time</span>
                    <span className="font-semibold">3.2 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approval Rate</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Client Satisfaction</span>
                    <span className="font-semibold">4.6/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { OnboardingAnalytics } from './OnboardingAnalytics';
import { 
  Users, 
  UserPlus, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Mail,
  Search,
  Filter,
  Download,
  Settings
} from 'lucide-react';

interface OnboardingStats {
  totalInvites: number;
  activeOnboarding: number;
  completedOnboarding: number;
  averageCompletionTime: number;
  conversionRate: number;
}

interface ClientInvitation {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  created_at: string;
  expires_at: string;
  last_activity?: string;
  completion_percentage: number;
  current_step?: string;
}

export function OnboardingDashboard() {
  const [stats, setStats] = useState<OnboardingStats>({
    totalInvites: 0,
    activeOnboarding: 0,
    completedOnboarding: 0,
    averageCompletionTime: 0,
    conversionRate: 0
  });
  
  const [invitations, setInvitations] = useState<ClientInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { toast } = useToast();
  const { userProfile } = useUser();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load invitations - temporarily disabled until types refresh
      // const { data: invitationsData, error: invitationsError } = await supabase
      //   .from('client_invitations')
      //   .select(`
      //     *,
      //     onboarding_sessions (
      //       id,
      //       current_step,
      //       progress_percentage,
      //       last_activity_at
      //     )
      //   `)
      //   .eq('advisor_id', userProfile?.id)
      //   .order('created_at', { ascending: false });

      // if (invitationsError) throw invitationsError;

      // Mock data for demo
      const processedInvitations = [
        {
          id: '1',
          email: 'client@example.com',
          first_name: 'John',
          last_name: 'Doe',
          status: 'pending',
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          last_activity: new Date().toISOString(),
          completion_percentage: 45,
          current_step: 'documents'
        }
      ];

      setInvitations(processedInvitations);

      // Calculate stats
      const totalInvites = processedInvitations.length;
      const activeOnboarding = processedInvitations.filter(inv => 
        inv.status === 'in_progress'
      ).length;
      const completedOnboarding = processedInvitations.filter(inv => 
        inv.status === 'completed'
      ).length;
      const conversionRate = totalInvites > 0 ? (completedOnboarding / totalInvites) * 100 : 0;

      setStats({
        totalInvites,
        activeOnboarding,
        completedOnboarding,
        averageCompletionTime: 3.5, // Mock data - would calculate from actual completion times
        conversionRate
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Completed</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const resendInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase.functions.invoke('resend-client-invitation', {
        body: { invitationId }
      });

      if (error) throw error;

      toast({
        title: "Invitation Resent",
        description: "The invitation has been resent successfully.",
      });
    } catch (error) {
      console.error('Error resending invitation:', error);
      toast({
        title: "Error",
        description: "Failed to resend invitation.",
        variant: "destructive"
      });
    }
  };

  const filteredInvitations = invitations.filter(inv => {
    const matchesSearch = inv.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Client Onboarding Dashboard</h1>
          <p className="text-muted-foreground">
            Manage client invitations and track onboarding progress
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          New Client Invitation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invitations</p>
                <p className="text-2xl font-bold">{stats.totalInvites}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Onboarding</p>
                <p className="text-2xl font-bold">{stats.activeOnboarding}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completedOnboarding}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Completion</p>
                <p className="text-2xl font-bold">{stats.averageCompletionTime}d</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invitations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invitations">Client Invitations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="invitations" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
            </select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Invitations Table */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredInvitations.map(invitation => (
                  <div key={invitation.id} className="p-4 hover:bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">
                            {invitation.first_name} {invitation.last_name}
                          </h3>
                          {getStatusBadge(invitation.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{invitation.email}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Created: {new Date(invitation.created_at).toLocaleDateString()}</span>
                          <span>Expires: {new Date(invitation.expires_at).toLocaleDateString()}</span>
                          {invitation.last_activity && (
                            <span>Last Activity: {new Date(invitation.last_activity).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {invitation.status === 'in_progress' && (
                          <div className="text-right space-y-1">
                            <div className="text-sm font-medium">
                              {invitation.completion_percentage}% Complete
                            </div>
                            <Progress 
                              value={invitation.completion_percentage} 
                              className="w-24 h-2" 
                            />
                            {invitation.current_step && (
                              <div className="text-xs text-muted-foreground">
                                Current: {invitation.current_step}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2">
                          {invitation.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => resendInvitation(invitation.id)}
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              Resend
                            </Button>
                          )}
                          <Button size="sm" variant="ghost">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredInvitations.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No invitations found matching your criteria.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <OnboardingAnalytics />
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Onboarding Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Configuration settings will be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
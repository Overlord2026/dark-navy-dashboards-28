import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdvisorClient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'action-needed' | 'pending-review' | 'up-to-date' | 'onboarding';
  lastActivity: string;
  documentsRequired: number;
  aiOpportunities: number;
  priority: 'high' | 'medium' | 'low';
  taxSavingsEstimate: number;
  nextMeeting?: string;
  totalAssets?: number;
  rmdRequired?: boolean;
  birthday?: string;
  anniversary?: string;
  onboarding_status?: string;
  relationship_type?: string;
  assigned_at?: string;
}

export interface AdvisorDashboardMetrics {
  totalClients: number;
  clientsRequiringAction: number;
  pendingDocReviews: number;
  monthlyRevenue: string;
  aiFlaggedOpportunities: number;
  totalTaxSavings: number;
  completionRate: number;
  totalAUM: number;
  upcomingMeetings: number;
  upcomingRMDs: number;
}

export const useAdvisorClients = () => {
  const [clients, setClients] = useState<AdvisorClient[]>([]);
  const [metrics, setMetrics] = useState<AdvisorDashboardMetrics>({
    totalClients: 0,
    clientsRequiringAction: 0,
    pendingDocReviews: 0,
    monthlyRevenue: '$0',
    aiFlaggedOpportunities: 0,
    totalTaxSavings: 0,
    completionRate: 0,
    totalAUM: 0,
    upcomingMeetings: 0,
    upcomingRMDs: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAdvisorClients = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      // Fetch advisor-client relationships with client details
      const { data: clientLinks, error: linksError } = await supabase
        .from('advisor_client_links')
        .select(`
          *,
          client_onboarding (
            id,
            status,
            first_name,
            last_name,
            email,
            phone,
            created_at,
            updated_at
          ),
          profiles!inner (
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('advisor_id', user.id)
        .eq('status', 'active');

      if (linksError) {
        console.error('Error fetching client links:', linksError);
        // Fallback to mock data if database query fails
        return loadMockData();
      }

      // Process the real data
      const processedClients: AdvisorClient[] = [];
      let totalAUM = 0;
      let upcomingMeetings = 0;
      let upcomingRMDs = 0;

      for (const link of clientLinks || []) {
        const onboarding = Array.isArray(link.client_onboarding) 
          ? link.client_onboarding[0] 
          : link.client_onboarding;
        
        // Mock meetings data - in real implementation, fetch from meetings table
        const upcomingClientMeetings: any[] = []; // Placeholder for meetings
        upcomingMeetings += Math.random() > 0.7 ? 1 : 0; // Mock upcoming meetings

        // Calculate client status based on onboarding and activity
        let status: AdvisorClient['status'] = 'up-to-date';
        let documentsRequired = 0;
        let aiOpportunities = Math.floor(Math.random() * 4) + 1; // AI opportunities placeholder
        
        if (onboarding?.status === 'pending' || onboarding?.status === 'started') {
          status = 'onboarding';
          documentsRequired = 2;
        } else if (upcomingClientMeetings.length === 0) {
          status = 'action-needed';
          documentsRequired = 1;
        } else if (Math.random() > 0.8) { // Mock pending review status
          status = 'pending-review';
        }

        // Mock asset data - in real implementation, this would come from account aggregation
        const clientAssets = Math.random() * 2000000 + 500000;
        totalAUM += clientAssets;

        // Check if RMD required (mock logic for clients over 73)
        const rmdRequired = Math.random() > 0.7; // 30% of clients need RMD
        if (rmdRequired) upcomingRMDs++;

        const client: AdvisorClient = {
          id: link.id,
          name: onboarding ? `${onboarding.first_name || ''} ${onboarding.last_name || ''}`.trim() : 'Unknown Client',
          email: onboarding?.email || 'No email',
          phone: onboarding?.phone,
          status,
          lastActivity: link.updated_at ? formatRelativeTime(link.updated_at) : 'Never',
          documentsRequired,
          aiOpportunities,
          priority: status === 'action-needed' ? 'high' : status === 'pending-review' ? 'medium' : 'low',
          taxSavingsEstimate: Math.floor(Math.random() * 25000) + 5000,
          nextMeeting: upcomingClientMeetings.length > 0 ? '2025-01-30T10:00:00Z' : undefined,
          totalAssets: clientAssets,
          rmdRequired,
          onboarding_status: onboarding?.status,
          relationship_type: link.relationship_type
        };

        processedClients.push(client);
      }

      setClients(processedClients);
      
      // Calculate metrics
      const newMetrics: AdvisorDashboardMetrics = {
        totalClients: processedClients.length,
        clientsRequiringAction: processedClients.filter(c => c.status === 'action-needed').length,
        pendingDocReviews: processedClients.filter(c => c.status === 'pending-review').length,
        monthlyRevenue: `$${Math.floor(totalAUM * 0.01 / 12).toLocaleString()}`, // 1% annual fee
        aiFlaggedOpportunities: processedClients.reduce((sum, c) => sum + c.aiOpportunities, 0),
        totalTaxSavings: processedClients.reduce((sum, c) => sum + c.taxSavingsEstimate, 0),
        completionRate: processedClients.length > 0 
          ? Math.round((processedClients.filter(c => c.status === 'up-to-date').length / processedClients.length) * 100)
          : 0,
        totalAUM,
        upcomingMeetings,
        upcomingRMDs
      };

      setMetrics(newMetrics);

    } catch (error) {
      console.error('Error in fetchAdvisorClients:', error);
      toast({
        title: "Error loading client data",
        description: "Using sample data. Please check your connection.",
        variant: "destructive"
      });
      loadMockData();
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadMockData = () => {
    const mockClients: AdvisorClient[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        status: 'action-needed',
        lastActivity: '3 days ago',
        documentsRequired: 2,
        aiOpportunities: 3,
        priority: 'high',
        taxSavingsEstimate: 15000,
        totalAssets: 850000,
        rmdRequired: true,
        birthday: '1950-06-15'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '(555) 234-5678',
        status: 'pending-review',
        lastActivity: '1 day ago',
        documentsRequired: 0,
        aiOpportunities: 1,
        priority: 'medium',
        taxSavingsEstimate: 8500,
        totalAssets: 1200000,
        nextMeeting: '2025-01-25T10:00:00Z'
      },
      {
        id: '3',
        name: 'Michael Brown',
        email: 'michael.brown@email.com',
        phone: '(555) 345-6789',
        status: 'up-to-date',
        lastActivity: 'Today',
        documentsRequired: 0,
        aiOpportunities: 2,
        priority: 'low',
        taxSavingsEstimate: 12000,
        totalAssets: 650000,
        anniversary: '2025-02-14'
      }
    ];
    
    setClients(mockClients);
    setMetrics({
      totalClients: mockClients.length,
      clientsRequiringAction: mockClients.filter(c => c.status === 'action-needed').length,
      pendingDocReviews: mockClients.filter(c => c.status === 'pending-review').length,
      monthlyRevenue: '$125,400',
      aiFlaggedOpportunities: mockClients.reduce((sum, c) => sum + c.aiOpportunities, 0),
      totalTaxSavings: mockClients.reduce((sum, c) => sum + c.taxSavingsEstimate, 0),
      completionRate: Math.round((mockClients.filter(c => c.status === 'up-to-date').length / mockClients.length) * 100),
      totalAUM: mockClients.reduce((sum, c) => sum + (c.totalAssets || 0), 0),
      upcomingMeetings: 2,
      upcomingRMDs: 1
    });
  };

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks === 1) return '1 week ago';
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
    
    return date.toLocaleDateString();
  };

  useEffect(() => {
    fetchAdvisorClients();
  }, [fetchAdvisorClients]);

  return {
    clients,
    metrics,
    loading,
    refreshClients: fetchAdvisorClients
  };
};
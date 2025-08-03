import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface BusinessClient {
  id: string;
  client_name: string;
  client_email: string;
  company_name?: string;
  industry?: string;
  relationship_type: string;
  status: string;
  created_at: string;
}

export interface BusinessMatter {
  id: string;
  matter_name: string;
  client_name: string;
  matter_type: string;
  status: string;
  priority: string;
  deadline?: string;
  billing_rate?: string;
  estimated_hours?: number;
  created_at: string;
}

export const useBusinessLawDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [businessClients, setBusinessClients] = useState<BusinessClient[]>([]);
  const [businessMatters, setBusinessMatters] = useState<BusinessMatter[]>([]);
  const [stats, setStats] = useState({
    activeMatters: 0,
    newMattersThisMonth: 0,
    totalRevenue: 0,
    averageRate: 0
  });

  const fetchBusinessClients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, we'll use the attorney_client_links table
      // In a real implementation, you might have a separate business_clients table
      const { data, error } = await supabase
        .from('attorney_client_links')
        .select(`
          id,
          relationship_type,
          status,
          created_at,
          client_id,
          profiles!attorney_client_links_client_id_fkey (
            id,
            first_name,
            last_name,
            email,
            phone,
            company_name
          )
        `)
        .eq('attorney_id', user.id)
        .eq('relationship_type', 'business_client');

      if (error) {
        console.error('Error fetching business clients:', error);
        return;
      }

      const clients = (data || []).map(link => ({
        id: link.client_id,
        client_name: `${(link.profiles as any)?.first_name || 'Unknown'} ${(link.profiles as any)?.last_name || 'Client'}`,
        client_email: (link.profiles as any)?.email || '',
        company_name: (link.profiles as any)?.company_name,
        industry: 'Technology', // Would come from additional profile data
        relationship_type: link.relationship_type,
        status: link.status,
        created_at: link.created_at
      }));

      setBusinessClients(clients);
    } catch (error) {
      console.error('Error fetching business clients:', error);
    }
  };

  const fetchBusinessMatters = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For demonstration, we'll create some sample business matters
      // In a real implementation, you'd have a business_matters table
      const mockMatters: BusinessMatter[] = [
        {
          id: '1',
          matter_name: 'Corporate Formation - TechStart Inc.',
          client_name: 'John Smith',
          matter_type: 'Corporate Formation',
          status: 'in_progress',
          priority: 'high',
          deadline: '2024-02-15',
          billing_rate: '$450/hr',
          estimated_hours: 20,
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          matter_name: 'Partnership Agreement - GreenEnergy LLC',
          client_name: 'Sarah Johnson',
          matter_type: 'Contract Negotiation',
          status: 'review',
          priority: 'medium',
          deadline: '2024-02-20',
          billing_rate: '$425/hr',
          estimated_hours: 15,
          created_at: '2024-01-18T14:30:00Z'
        },
        {
          id: '3',
          matter_name: 'Employment Compliance - RetailMax Corp',
          client_name: 'Mike Davis',
          matter_type: 'Compliance Review',
          status: 'pending',
          priority: 'low',
          deadline: '2024-02-28',
          billing_rate: '$400/hr',
          estimated_hours: 8,
          created_at: '2024-01-20T09:15:00Z'
        }
      ];

      setBusinessMatters(mockMatters);

      // Calculate stats
      const activeMatters = mockMatters.filter(m => m.status === 'in_progress').length;
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const newMattersThisMonth = mockMatters.filter(m => new Date(m.created_at) >= thisMonth).length;
      
      const totalEstimatedRevenue = mockMatters.reduce((sum, matter) => {
        const rate = parseInt(matter.billing_rate?.replace(/[^0-9]/g, '') || '0');
        const hours = matter.estimated_hours || 0;
        return sum + (rate * hours);
      }, 0);

      const averageRate = mockMatters.length > 0 
        ? mockMatters.reduce((sum, matter) => sum + parseInt(matter.billing_rate?.replace(/[^0-9]/g, '') || '0'), 0) / mockMatters.length
        : 0;

      setStats({
        activeMatters: mockMatters.length,
        newMattersThisMonth,
        totalRevenue: totalEstimatedRevenue,
        averageRate
      });

    } catch (error) {
      console.error('Error fetching business matters:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchBusinessClients(),
        fetchBusinessMatters()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    loading,
    businessClients,
    businessMatters,
    stats,
    refreshData: () => {
      fetchBusinessClients();
      fetchBusinessMatters();
    }
  };
};
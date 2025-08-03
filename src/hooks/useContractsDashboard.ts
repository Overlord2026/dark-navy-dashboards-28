import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Contract {
  id: string;
  title: string;
  client_name: string;
  contract_type: string;
  status: string;
  start_date: string;
  end_date?: string;
  value: string;
  last_modified: string;
  attorney_id: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  category: string;
  downloads: number;
  last_updated: string;
  is_active: boolean;
}

export interface ContractAnalytics {
  total_contracts: number;
  active_contracts: number;
  drafts: number;
  under_review: number;
  expiring_soon: number;
  avg_review_time_days: number;
  monthly_volume: number;
}

export const useContractsDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [analytics, setAnalytics] = useState<ContractAnalytics>({
    total_contracts: 0,
    active_contracts: 0,
    drafts: 0,
    under_review: 0,
    expiring_soon: 0,
    avg_review_time_days: 0,
    monthly_volume: 0
  });

  const fetchContracts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For demonstration, we'll use some sample contracts
      // In a real implementation, you'd have a contracts table
      const mockContracts: Contract[] = [
        {
          id: '1',
          title: 'Software Development Agreement',
          client_name: 'TechStart Inc.',
          contract_type: 'Service Agreement',
          status: 'active',
          start_date: '2024-01-15',
          end_date: '2024-12-15',
          value: '$125,000',
          last_modified: '2024-01-20',
          attorney_id: user.id
        },
        {
          id: '2',
          title: 'Employment Contract - CEO',
          client_name: 'GreenEnergy LLC',
          contract_type: 'Employment',
          status: 'draft',
          start_date: '2024-02-01',
          end_date: '2026-02-01',
          value: '$200,000/year',
          last_modified: '2024-01-18',
          attorney_id: user.id
        },
        {
          id: '3',
          title: 'Lease Agreement - Office Space',
          client_name: 'RetailMax Corp',
          contract_type: 'Real Estate',
          status: 'under_review',
          start_date: '2024-03-01',
          end_date: '2029-02-28',
          value: '$8,500/month',
          last_modified: '2024-01-15',
          attorney_id: user.id
        }
      ];

      setContracts(mockContracts);

      // Calculate analytics
      const analytics: ContractAnalytics = {
        total_contracts: mockContracts.length,
        active_contracts: mockContracts.filter(c => c.status === 'active').length,
        drafts: mockContracts.filter(c => c.status === 'draft').length,
        under_review: mockContracts.filter(c => c.status === 'under_review').length,
        expiring_soon: mockContracts.filter(c => {
          if (!c.end_date) return false;
          const endDate = new Date(c.end_date);
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
          return endDate <= thirtyDaysFromNow;
        }).length,
        avg_review_time_days: 3.2,
        monthly_volume: mockContracts.filter(c => {
          const contractDate = new Date(c.start_date);
          const thisMonth = new Date();
          return contractDate.getMonth() === thisMonth.getMonth() && 
                 contractDate.getFullYear() === thisMonth.getFullYear();
        }).length
      };

      setAnalytics(analytics);

    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      // Sample contract templates
      const mockTemplates: ContractTemplate[] = [
        {
          id: '1',
          name: 'Non-Disclosure Agreement',
          category: 'Confidentiality',
          downloads: 45,
          last_updated: '2024-01-20',
          is_active: true
        },
        {
          id: '2',
          name: 'Service Agreement Template',
          category: 'Service Contracts',
          downloads: 32,
          last_updated: '2024-01-18',
          is_active: true
        },
        {
          id: '3',
          name: 'Employment Contract',
          category: 'HR',
          downloads: 28,
          last_updated: '2024-01-15',
          is_active: true
        },
        {
          id: '4',
          name: 'Partnership Agreement',
          category: 'Business',
          downloads: 21,
          last_updated: '2024-01-12',
          is_active: true
        },
        {
          id: '5',
          name: 'Software License Agreement',
          category: 'Technology',
          downloads: 19,
          last_updated: '2024-01-10',
          is_active: true
        }
      ];

      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const createContract = async (contractData: Partial<Contract>) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // In a real implementation, this would insert into a contracts table
      console.log('Creating contract:', contractData);
      
      // For now, just refresh the data
      await fetchContracts();
    } catch (error) {
      console.error('Error creating contract:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContract = async (contractId: string, updates: Partial<Contract>) => {
    setLoading(true);
    try {
      // In a real implementation, this would update the contracts table
      console.log('Updating contract:', contractId, updates);
      
      // For now, just refresh the data
      await fetchContracts();
    } catch (error) {
      console.error('Error updating contract:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchContracts(),
        fetchTemplates()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    loading,
    contracts,
    templates,
    analytics,
    createContract,
    updateContract,
    refreshData: () => {
      fetchContracts();
      fetchTemplates();
    }
  };
};
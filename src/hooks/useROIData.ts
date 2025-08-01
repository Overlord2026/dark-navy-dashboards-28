import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Campaign {
  id: string;
  advisor_id: string;
  source: string;
  name: string;
  spend: number;
  start_date: string;
  end_date: string;
  created_at: string;
}

interface Lead {
  id: string;
  advisor_id: string;
  campaign_id?: string;
  stage: string;
  closed: boolean;
  revenue?: number;
  profit?: number;
  ltv?: number;
  days_to_close?: number;
  created_at: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  source?: string;
}

// Mock data storage (in a real app, this would be in a global state or database)
let mockCampaigns: Campaign[] = [
  {
    id: '1',
    advisor_id: 'mock-user',
    name: 'Facebook Q4',
    source: 'facebook',
    spend: 4000,
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    advisor_id: 'mock-user',
    name: 'Google Search',
    source: 'google',
    spend: 1800,
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    created_at: new Date().toISOString(),
  },
];

let mockLeads: Lead[] = [
  {
    id: '1',
    advisor_id: 'mock-user',
    campaign_id: '1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: '555-123-4567',
    stage: 'lead',
    source: 'facebook',
    closed: false,
    created_at: new Date().toISOString(),
  },
];

export function useROIData() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Campaign operations
  const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'advisor_id' | 'created_at'>) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newCampaign: Campaign = {
        ...campaignData,
        id: Math.random().toString(36).substr(2, 9),
        advisor_id: 'mock-user',
        created_at: new Date().toISOString(),
      };

      mockCampaigns.unshift(newCampaign);

      toast({
        title: 'Campaign Created',
        description: 'Your campaign has been created successfully.',
      });

      return newCampaign;
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: 'Error',
        description: 'Failed to create campaign. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCampaigns = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockCampaigns];
  };

  // Lead operations
  const createLead = async (leadData: Omit<Lead, 'id' | 'advisor_id' | 'created_at'>) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newLead: Lead = {
        ...leadData,
        id: Math.random().toString(36).substr(2, 9),
        advisor_id: 'mock-user',
        closed: leadData.stage === 'closed',
        created_at: new Date().toISOString(),
      };

      mockLeads.unshift(newLead);

      toast({
        title: 'Lead Created',
        description: 'Your lead has been created successfully.',
      });

      return newLead;
    } catch (error) {
      console.error('Error creating lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to create lead. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, updates: Partial<Lead>) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const leadIndex = mockLeads.findIndex(l => l.id === leadId);
      if (leadIndex === -1) throw new Error('Lead not found');

      const updatedLead = {
        ...mockLeads[leadIndex],
        ...updates,
        closed: updates.stage === 'closed',
      };

      mockLeads[leadIndex] = updatedLead;

      toast({
        title: 'Lead Updated',
        description: 'Lead status has been updated successfully.',
      });

      return updatedLead;
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to update lead. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getLeads = async (filters?: { campaign_id?: string; stage?: string }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredLeads = [...mockLeads];

    if (filters?.campaign_id) {
      filteredLeads = filteredLeads.filter(l => l.campaign_id === filters.campaign_id);
    }

    if (filters?.stage) {
      filteredLeads = filteredLeads.filter(l => l.stage === filters.stage);
    }

    return filteredLeads;
  };

  // Analytics operations
  const getROIMetrics = async (dateRange?: { from?: Date; to?: Date }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const leads = [...mockLeads];
    const campaigns = [...mockCampaigns];

    // Calculate metrics
    const totalLeads = leads.length;
    const totalSpend = campaigns.reduce((sum, c) => sum + (c.spend || 0), 0);
    const closedLeads = leads.filter(l => l.closed);
    const totalRevenue = closedLeads.reduce((sum, l) => sum + (l.revenue || 8000), 0);
    const totalLTV = closedLeads.reduce((sum, l) => sum + (l.ltv || 12000), 0);
    
    const roi = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;

    return {
      totalLeads,
      totalSpend,
      totalRevenue,
      totalLTV,
      roi,
      closedLeads: closedLeads.length,
      conversionRate: totalLeads > 0 ? (closedLeads.length / totalLeads) * 100 : 0,
      campaigns,
      leads,
    };
  };

  return {
    loading,
    createCampaign,
    getCampaigns,
    createLead,
    updateLeadStatus,
    getLeads,
    getROIMetrics,
  };
}
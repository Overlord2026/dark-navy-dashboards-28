import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface LeadWithScore {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  lead_status: string | null;
  lead_source: string;
  lead_value: number | null;
  lead_score: number;
  engagement_score: number;
  budget_score: number;
  timeline_score: number;
  fit_score: number;
  timeline_to_purchase: string;
  fit_assessment: string;
  next_follow_up_due: string | null;
  follow_up_count: number;
  created_at: string;
  updated_at: string;
}

export interface EngagementEvent {
  id: string;
  lead_id: string;
  engagement_type: string;
  engagement_date: string;
  engagement_data: any;
}

export interface PipelineStageConfig {
  id: string;
  stage_name: string;
  follow_up_delay_hours: number;
  email_template: string | null;
  sms_template: string | null;
  is_active: boolean;
}

export interface AutomatedFollowUp {
  id: string;
  lead_id: string;
  follow_up_type: string;
  stage: string;
  scheduled_for: string;
  sent_at: string | null;
  status: string;
  content: string | null;
  response_received: boolean;
  created_at: string;
}

export function useLeadScoring() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Get all leads with scores, sorted by score
  const getLeadsWithScores = async (): Promise<LeadWithScore[]> => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('lead_score', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Update lead score factors
  const updateLeadScoring = async (leadId: string, updates: {
    timeline_to_purchase?: string;
    fit_assessment?: string;
    lead_value?: number;
  }) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', leadId);

      if (error) throw error;

      // Recalculate score
      const { error: scoreError } = await supabase.rpc('calculate_lead_score', { 
        p_lead_id: leadId 
      });

      if (scoreError) throw scoreError;

      toast({
        title: 'Lead Updated',
        description: 'Lead scoring factors updated and score recalculated.',
      });
    } catch (error) {
      console.error('Error updating lead scoring:', error);
      toast({
        title: 'Error',
        description: 'Failed to update lead scoring.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Track engagement event
  const trackEngagement = async (leadId: string, engagementType: string, data?: any) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('lead_engagement_tracking')
        .insert({
          lead_id: leadId,
          engagement_type: engagementType,
          engagement_data: data || {}
        });

      if (error) throw error;

      toast({
        title: 'Engagement Tracked',
        description: `${engagementType.replace('_', ' ')} has been recorded.`,
      });
    } catch (error) {
      console.error('Error tracking engagement:', error);
      toast({
        title: 'Error',
        description: 'Failed to track engagement.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get engagement history for a lead
  const getEngagementHistory = async (leadId: string): Promise<EngagementEvent[]> => {
    const { data, error } = await supabase
      .from('lead_engagement_tracking')
      .select('*')
      .eq('lead_id', leadId)
      .order('engagement_date', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Get pipeline stage configurations
  const getPipelineConfigs = async (): Promise<PipelineStageConfig[]> => {
    const { data, error } = await supabase
      .from('pipeline_stage_config')
      .select('*')
      .order('stage_name');

    if (error) throw error;
    return data || [];
  };

  // Update pipeline stage configuration
  const updatePipelineConfig = async (stageId: string, config: Partial<PipelineStageConfig>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('pipeline_stage_config')
        .update(config)
        .eq('id', stageId);

      if (error) throw error;

      toast({
        title: 'Configuration Updated',
        description: 'Pipeline stage configuration has been updated.',
      });
    } catch (error) {
      console.error('Error updating pipeline config:', error);
      toast({
        title: 'Error',
        description: 'Failed to update pipeline configuration.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create new pipeline stage configuration
  const createPipelineConfig = async (config: Omit<PipelineStageConfig, 'id'>) => {
    setLoading(true);
    try {
      const currentUser = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('pipeline_stage_config')
        .insert({
          ...config,
          advisor_id: currentUser.data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Configuration Created',
        description: 'New pipeline stage configuration created.',
      });

      return data;
    } catch (error) {
      console.error('Error creating pipeline config:', error);
      toast({
        title: 'Error',
        description: 'Failed to create pipeline configuration.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get pending follow-ups
  const getPendingFollowUps = async (): Promise<AutomatedFollowUp[]> => {
    const { data, error } = await supabase
      .from('automated_follow_ups')
      .select(`
        *,
        leads (first_name, last_name, email)
      `)
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .order('scheduled_for');

    if (error) throw error;
    return data || [];
  };

  // Mark follow-up as sent
  const markFollowUpSent = async (followUpId: string) => {
    const { error } = await supabase
      .from('automated_follow_ups')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', followUpId);

    if (error) throw error;
  };

  // Get top scoring leads for prioritization
  const getTopScoringLeads = async (limit: number = 10): Promise<LeadWithScore[]> => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('lead_score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  };

  // Bulk update lead status and trigger follow-ups
  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          lead_status: newStatus,
          follow_up_count: 0 // Reset follow-up count when status changes
        })
        .eq('id', leadId);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: 'Lead status updated and follow-ups scheduled.',
      });
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update lead status.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getLeadsWithScores,
    updateLeadScoring,
    trackEngagement,
    getEngagementHistory,
    getPipelineConfigs,
    updatePipelineConfig,
    createPipelineConfig,
    getPendingFollowUps,
    markFollowUpSent,
    getTopScoringLeads,
    updateLeadStatus
  };
}
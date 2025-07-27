import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ComplianceAuditEntry {
  id: string;
  entity_type: string;
  entity_id: string;
  action_type: string;
  performed_by: string;
  ip_address?: string;
  user_agent?: string;
  details: Record<string, any>;
  timestamp: string;
}

export interface InvestmentCompliance {
  id: string;
  offering_id: string;
  compliance_status: 'pending' | 'approved' | 'under_review' | 'rejected';
  due_diligence_status: 'not_started' | 'in_progress' | 'completed' | 'expired';
  sec_status: 'pending' | 'compliant' | 'non_compliant';
  finra_status: 'pending' | 'compliant' | 'non_compliant';
  last_reviewed_at?: string;
  reviewed_by?: string;
  documents_verified: boolean;
  risk_assessment: Record<string, any>;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useComplianceAudit = () => {
  const [auditEntries, setAuditEntries] = useState<ComplianceAuditEntry[]>([]);
  const [investmentCompliance, setInvestmentCompliance] = useState<InvestmentCompliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchAuditEntries = async (filters?: { entityType?: string; actionType?: string; limit?: number }) => {
    try {
      let query = supabase
        .from('compliance_audit_trail')
        .select('*')
        .order('timestamp', { ascending: false });

      if (filters?.entityType) {
        query = query.eq('entity_type', filters.entityType);
      }

      if (filters?.actionType) {
        query = query.eq('action_type', filters.actionType);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAuditEntries(data || []);
    } catch (error) {
      console.error('Error fetching audit entries:', error);
      toast({
        title: "Error",
        description: "Failed to load audit trail",
        variant: "destructive"
      });
    }
  };

  const fetchInvestmentCompliance = async () => {
    try {
      const { data, error } = await supabase
        .from('investment_compliance')
        .select(`
          *,
          investment_offerings (
            name,
            type
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setInvestmentCompliance(data || []);
    } catch (error) {
      console.error('Error fetching investment compliance:', error);
      toast({
        title: "Error",
        description: "Failed to load investment compliance data",
        variant: "destructive"
      });
    }
  };

  const logAuditEntry = async (entryData: Omit<ComplianceAuditEntry, 'id' | 'performed_by' | 'timestamp'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('compliance_audit_trail')
        .insert({
          ...entryData,
          performed_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging audit entry:', error);
      throw error;
    }
  };

  const updateInvestmentCompliance = async (
    offeringId: string, 
    updates: Partial<Omit<InvestmentCompliance, 'id' | 'offering_id' | 'created_at' | 'updated_at'>>
  ) => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('investment_compliance')
        .update({
          ...updates,
          reviewed_by: user.id,
          last_reviewed_at: new Date().toISOString()
        })
        .eq('offering_id', offeringId)
        .select()
        .single();

      if (error) throw error;

      // Log the compliance update
      await logAuditEntry({
        entity_type: 'investment_compliance',
        entity_id: offeringId,
        action_type: 'compliance_update',
        details: { updates, previous_status: data.compliance_status }
      });

      await fetchInvestmentCompliance();
      toast({
        title: "Success",
        description: "Investment compliance updated successfully"
      });

      return data;
    } catch (error) {
      console.error('Error updating investment compliance:', error);
      toast({
        title: "Error",
        description: "Failed to update compliance status",
        variant: "destructive"
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    Promise.all([fetchAuditEntries({ limit: 100 }), fetchInvestmentCompliance()])
      .finally(() => setLoading(false));
  }, []);

  return {
    auditEntries,
    investmentCompliance,
    loading,
    saving,
    fetchAuditEntries,
    fetchInvestmentCompliance,
    logAuditEntry,
    updateInvestmentCompliance
  };
};
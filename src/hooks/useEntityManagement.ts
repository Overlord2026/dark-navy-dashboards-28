import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface BusinessEntity {
  id: string;
  user_id: string;
  tenant_id?: string;
  entity_name: string;
  entity_type: 'LLC' | 'Corporation' | 'S-Corporation' | 'Trust' | 'Nonprofit' | 'Partnership';
  jurisdiction: string;
  formation_date?: string;
  ein?: string;
  status: 'active' | 'inactive' | 'dissolved';
  description?: string;
  registered_address?: any;
  mailing_address?: any;
  created_at: string;
  updated_at: string;
}

export interface EntityOwnership {
  id: string;
  entity_id: string;
  owner_name: string;
  owner_email?: string;
  ownership_percentage?: number;
  ownership_type: 'member' | 'shareholder' | 'partner' | 'trustee' | 'beneficiary';
  capital_contribution?: number;
  voting_rights: boolean;
  management_rights: boolean;
}

export interface FilingSchedule {
  id: string;
  entity_id: string;
  filing_type: string;
  filing_name: string;
  due_date: string;
  frequency: 'monthly' | 'quarterly' | 'semi-annual' | 'annual' | 'biennial' | 'one-time';
  jurisdiction: string;
  estimated_hours?: number;
  estimated_cost?: number;
  assigned_professional_id?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  notes?: string;
}

export interface ComplianceAlert {
  id: string;
  entity_id?: string;
  professional_id?: string;
  alert_type: 'filing_deadline' | 'credential_expiry' | 'document_required' | 'compliance_review';
  title: string;
  description?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  due_date?: string;
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  escalation_level: number;
  notification_sent: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export const useEntityManagement = () => {
  const [entities, setEntities] = useState<BusinessEntity[]>([]);
  const [filings, setFilings] = useState<FilingSchedule[]>([]);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchEntities = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('business_entities')
        .select('*')
        .eq('user_id', user.id)
        .order('entity_name');

      if (error) throw error;
      setEntities(data || []);
    } catch (error) {
      console.error('Error fetching entities:', error);
      toast.error('Failed to load business entities');
    }
  };

  const fetchFilings = async (entityId?: string) => {
    if (!user) return;

    try {
      let query = supabase
        .from('filing_schedules')
        .select(`
          *,
          business_entities!inner(user_id)
        `)
        .eq('business_entities.user_id', user.id)
        .order('due_date');

      if (entityId) {
        query = query.eq('entity_id', entityId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setFilings(data || []);
    } catch (error) {
      console.error('Error fetching filings:', error);
      toast.error('Failed to load filing schedules');
    }
  };

  const fetchAlerts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('compliance_alerts')
        .select(`
          *,
          business_entities!compliance_alerts_entity_id_fkey(entity_name)
        `)
        .or(`professional_id.eq.${user.id},business_entities.user_id.eq.${user.id}`)
        .eq('status', 'active')
        .order('severity', { ascending: false })
        .order('due_date');

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Failed to load compliance alerts');
    }
  };

  const createEntity = async (entityData: Omit<BusinessEntity, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('business_entities')
        .insert([{
          ...entityData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setEntities(prev => [...prev, data]);
      toast.success('Business entity created successfully');
      return data;
    } catch (error) {
      console.error('Error creating entity:', error);
      toast.error('Failed to create business entity');
      return null;
    }
  };

  const updateEntity = async (id: string, updates: Partial<BusinessEntity>) => {
    try {
      const { data, error } = await supabase
        .from('business_entities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEntities(prev => prev.map(entity => 
        entity.id === id ? { ...entity, ...data } : entity
      ));
      toast.success('Entity updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating entity:', error);
      toast.error('Failed to update entity');
      return null;
    }
  };

  const deleteEntity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('business_entities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntities(prev => prev.filter(entity => entity.id !== id));
      toast.success('Entity deleted successfully');
    } catch (error) {
      console.error('Error deleting entity:', error);
      toast.error('Failed to delete entity');
    }
  };

  const createFiling = async (filingData: Omit<FilingSchedule, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('filing_schedules')
        .insert([filingData])
        .select()
        .single();

      if (error) throw error;

      setFilings(prev => [...prev, data]);
      toast.success('Filing schedule created successfully');
      return data;
    } catch (error) {
      console.error('Error creating filing:', error);
      toast.error('Failed to create filing schedule');
      return null;
    }
  };

  const updateFiling = async (id: string, updates: Partial<FilingSchedule>) => {
    try {
      const { data, error } = await supabase
        .from('filing_schedules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setFilings(prev => prev.map(filing => 
        filing.id === id ? { ...filing, ...data } : filing
      ));
      toast.success('Filing updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating filing:', error);
      toast.error('Failed to update filing');
      return null;
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('compliance_alerts')
        .update({ status: 'acknowledged' })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
      ));
      toast.success('Alert acknowledged');
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      toast.error('Failed to acknowledge alert');
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('compliance_alerts')
        .update({ status: 'resolved' })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast.success('Alert resolved');
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast.error('Failed to resolve alert');
    }
  };

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setIsLoading(true);
        await Promise.all([
          fetchEntities(),
          fetchFilings(),
          fetchAlerts()
        ]);
        setIsLoading(false);
      };
      loadData();
    }
  }, [user]);

  return {
    entities,
    filings,
    alerts,
    isLoading,
    createEntity,
    updateEntity,
    deleteEntity,
    createFiling,
    updateFiling,
    acknowledgeAlert,
    resolveAlert,
    refetch: () => Promise.all([fetchEntities(), fetchFilings(), fetchAlerts()])
  };
};
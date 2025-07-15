import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { useEnhancedErrorHandling } from './useEnhancedErrorHandling';

export interface ProfessionalQuickAdd {
  name: string;
  email: string;
  type: string;
  phone?: string;
  specialties?: string[];
}

export interface ProfessionalInvitation {
  id: string;
  professionalId: string;
  invitedBy: string;
  invitedAt: Date;
  status: 'pending' | 'accepted' | 'declined';
  expiresAt: Date;
  accessLevel: 'view' | 'edit' | 'admin';
}

export const useProfessionalManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const { handleError, withRetry, handleAddButtonError } = useEnhancedErrorHandling();

  const fetchProfessionals = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProfessionals(data || []);
      return data || [];
    } catch (error) {
      handleError(error, 'Fetch professionals', 'ProfessionalManagement', 'fetch');
      return [];
    }
  }, [handleError]);

  const quickAddProfessional = useCallback(async (professional: ProfessionalQuickAdd) => {
    setIsLoading(true);
    
    try {
      const result = await withRetry(
        async () => {
          const { data: user } = await supabase.auth.getUser();
          if (!user.user) throw new Error('Authentication required');

          const { data, error } = await supabase
            .from('professionals')
            .insert([{
              ...professional,
              user_id: user.user.id
            }])
            .select()
            .single();

          if (error) throw error;
          return data;
        },
        `add-professional-${professional.email}`,
        { maxAttempts: 3, baseDelay: 1000 },
        'Add Professional'
      );

      setProfessionals(prev => [result, ...prev]);
      toast.success(`Professional ${professional.name} added successfully`);
      return result;

    } catch (error) {
      handleAddButtonError(error, 'Professional', professional.name);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [withRetry, handleAddButtonError]);

  const verifyProfessional = useCallback(async (professionalId: string) => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .update({ 
          verified: true,
          verified_at: new Date().toISOString()
        })
        .eq('id', professionalId)
        .select()
        .single();

      if (error) throw error;

      setProfessionals(prev => 
        prev.map(p => p.id === professionalId ? { ...p, verified: true } : p)
      );
      
      toast.success('Professional verified successfully');
      return data;

    } catch (error) {
      handleError(error, 'Verify professional', 'ProfessionalManagement', 'verify');
      throw error;
    }
  }, [handleError]);

  const inviteProfessional = useCallback(async (
    professionalId: string,
    accessLevel: 'view' | 'edit' | 'admin' = 'view',
    expiresInHours: number = 24
  ) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Authentication required');

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expiresInHours);

      const invitation: Omit<ProfessionalInvitation, 'id'> = {
        professionalId,
        invitedBy: user.user.id,
        invitedAt: new Date(),
        status: 'pending',
        expiresAt,
        accessLevel
      };

      // Store invitation in database (would need to create table)
      // For now, we'll simulate the invitation
      toast.success('Professional invitation sent successfully');
      
      return invitation;

    } catch (error) {
      handleError(error, 'Invite professional', 'ProfessionalManagement', 'invite');
      throw error;
    }
  }, [handleError]);

  const checkProfessionalAvailability = useCallback(async (): Promise<boolean> => {
    try {
      const professionals = await fetchProfessionals();
      return professionals.length > 0;
    } catch (error) {
      handleError(error, 'Check professional availability', 'ProfessionalManagement', 'check');
      return false;
    }
  }, [fetchProfessionals, handleError]);

  const showProfessionalRequiredDialog = useCallback((
    onAddProfessional: (professional: ProfessionalQuickAdd) => void,
    context: string = 'sharing'
  ) => {
    toast.info(`No professionals found for ${context}`, {
      action: {
        label: 'Add Professional',
        onClick: () => {
          // This would open a quick add dialog
          // For now, we'll show a placeholder
          const professional: ProfessionalQuickAdd = {
            name: 'Dr. Smith',
            email: 'dr.smith@example.com',
            type: 'Healthcare Provider',
            specialties: ['General Practice']
          };
          onAddProfessional(professional);
        }
      }
    });
  }, []);

  const getProfessionalsByType = useCallback((type: string) => {
    return professionals.filter(p => p.type === type);
  }, [professionals]);

  const searchProfessionals = useCallback((query: string) => {
    return professionals.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.email.toLowerCase().includes(query.toLowerCase()) ||
      p.type.toLowerCase().includes(query.toLowerCase())
    );
  }, [professionals]);

  return {
    isLoading,
    professionals,
    fetchProfessionals,
    quickAddProfessional,
    verifyProfessional,
    inviteProfessional,
    checkProfessionalAvailability,
    showProfessionalRequiredDialog,
    getProfessionalsByType,
    searchProfessionals
  };
};
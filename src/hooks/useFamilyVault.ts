import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type FamilyVault = Database['public']['Tables']['family_vaults']['Row'];
type VaultMember = Database['public']['Tables']['vault_members']['Row'];
type LegacyItem = Database['public']['Tables']['legacy_items']['Row'];
type VaultAccessLog = Database['public']['Tables']['vault_access_logs']['Row'];

export interface UseFamilyVaultReturn {
  vaults: FamilyVault[];
  members: VaultMember[];
  legacyItems: LegacyItem[];
  auditLogs: VaultAccessLog[];
  loading: boolean;
  error: string | null;
  createVault: (vaultData: CreateVaultData) => Promise<FamilyVault | null>;
  inviteMember: (vaultId: string, memberData: InviteMemberData) => Promise<boolean>;
  uploadLegacyItem: (vaultId: string, itemData: UploadItemData) => Promise<boolean>;
  refetch: () => void;
  // Legacy aliases for backward compatibility
  items: LegacyItem[];
  isLoading: boolean;
}

export interface CreateVaultData {
  vault_name: string;
  description?: string | null;
  family_motto?: string | null;
  family_values?: string[] | null;
  vault_photo_url?: string | null;
  // Legacy alias
  name?: string;
}

export interface InviteMemberData {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  role: string;
  permissions: Record<string, any>; // Supabase Json type
}

export interface UploadItemData {
  title: string;
  description?: string | null;
  item_type: string;
  content_url?: string | null;
  content_type?: string | null;
  file_size?: number | null;
  duration_seconds?: number | null;
}

export function useFamilyVault(vaultId?: string): UseFamilyVaultReturn {
  const [vaults, setVaults] = useState<FamilyVault[]>([]);
  const [members, setMembers] = useState<VaultMember[]>([]);
  const [legacyItems, setLegacyItems] = useState<LegacyItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<VaultAccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchVaults = async () => {
    try {
      const { data, error } = await supabase
        .from('family_vaults')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVaults(data || []);
    } catch (err) {
      console.error('Error fetching vaults:', err);
      setError('Failed to load vaults');
    }
  };

  const fetchMembers = async (targetVaultId: string) => {
    try {
      const { data, error } = await supabase
        .from('vault_members')
        .select('*')
        .eq('vault_id', targetVaultId)
        .order('role', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load vault members');
    }
  };

  const fetchLegacyItems = async (targetVaultId: string) => {
    try {
      const { data, error } = await supabase
        .from('legacy_items')
        .select('*')
        .eq('vault_id', targetVaultId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLegacyItems(data || []);
    } catch (err) {
      console.error('Error fetching legacy items:', err);
      setError('Failed to load legacy items');
    }
  };

  const fetchAuditLogs = async (targetVaultId: string) => {
    try {
      const { data, error } = await supabase
        .from('vault_access_logs')
        .select('*')
        .eq('vault_id', targetVaultId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError('Failed to load audit logs');
    }
  };

  const createVault = async (vaultData: CreateVaultData): Promise<FamilyVault | null> => {
    try {
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('family_vaults')
        .insert({
          user_id: user.id,
          vault_name: vaultData.vault_name,
          description: vaultData.description || null,
          family_motto: vaultData.family_motto || null,
          family_values: vaultData.family_values || null,
          vault_photo_url: vaultData.vault_photo_url || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Add the creator as an admin member
      const memberData: InviteMemberData = {
        email: user.email!,
        first_name: user.user_metadata?.first_name || null,
        last_name: user.user_metadata?.last_name || null,
        role: 'admin',
        permissions: {
          view: true,
          add: true,
          share: true,
          admin: true
        }
      };

      await inviteMember(data.id, memberData);
      await fetchVaults();
      
      toast({
        title: "Vault created successfully",
        description: `${vaultData.vault_name} is ready to use.`,
      });

      return data;
    } catch (err) {
      console.error('Error creating vault:', err);
      setError('Failed to create vault');
      toast({
        title: "Error creating vault",
        description: "Please try again later.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const inviteMember = async (targetVaultId: string, memberData: InviteMemberData): Promise<boolean> => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('vault_members')
        .insert({
          vault_id: targetVaultId,
          email: memberData.email,
          first_name: memberData.first_name,
          last_name: memberData.last_name,
          role: memberData.role,
          permissions: memberData.permissions,
          status: 'pending',
          created_by: user.id,
        });

      if (error) throw error;

      if (vaultId === targetVaultId) {
        await fetchMembers(targetVaultId);
      }

      toast({
        title: "Member invited",
        description: `Invitation sent to ${memberData.email}`,
      });

      return true;
    } catch (err) {
      console.error('Error inviting member:', err);
      toast({
        title: "Error inviting member",
        description: "Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };

  const uploadLegacyItem = async (targetVaultId: string, itemData: UploadItemData): Promise<boolean> => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('legacy_items')
        .insert({
          vault_id: targetVaultId,
          created_by: user.id,
          title: itemData.title,
          description: itemData.description || null,
          item_type: itemData.item_type,
          content_url: itemData.content_url || null,
          content_type: itemData.content_type || null,
          file_size: itemData.file_size || null,
          duration_seconds: itemData.duration_seconds || null,
          status: 'active',
        });

      if (error) throw error;

      if (vaultId === targetVaultId) {
        await fetchLegacyItems(targetVaultId);
      }

      toast({
        title: "Item uploaded",
        description: `${itemData.title} has been added to the vault.`,
      });

      return true;
    } catch (err) {
      console.error('Error uploading item:', err);
      toast({
        title: "Error uploading item",
        description: "Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };

  const refetch = () => {
    setLoading(true);
    setError(null);
    
    fetchVaults();
    if (vaultId) {
      fetchMembers(vaultId);
      fetchLegacyItems(vaultId);
      fetchAuditLogs(vaultId);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      await fetchVaults();
      
      if (vaultId) {
        await Promise.all([
          fetchMembers(vaultId),
          fetchLegacyItems(vaultId),
          fetchAuditLogs(vaultId)
        ]);
      }
      
      setLoading(false);
    };

    loadData();
  }, [vaultId]);

  return {
    vaults,
    members,
    legacyItems,
    auditLogs,
    loading,
    error,
    createVault,
    inviteMember,
    uploadLegacyItem,
    refetch,
    // Legacy aliases for backward compatibility
    items: legacyItems,
    isLoading: loading,
  };
}
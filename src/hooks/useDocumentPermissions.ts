
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { DocumentPermission } from '@/types/document';
import { toast } from 'sonner';

export interface SupabaseDocumentPermission {
  id: string;
  document_id: string;
  user_id: string;
  granted_by_user_id: string;
  access_level: string;
  user_name: string | null;
  user_email: string | null;
  user_role: string | null;
  granted_at: string;
  created_at: string;
}

export const useDocumentPermissions = () => {
  const [permissions, setPermissions] = useState<DocumentPermission[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const convertToDocumentPermission = (perm: SupabaseDocumentPermission): DocumentPermission => ({
    userId: perm.user_id,
    userName: perm.user_name || '',
    userEmail: perm.user_email || '',
    userRole: perm.user_role || '',
    accessLevel: perm.access_level as any,
    grantedBy: perm.granted_by_user_id,
    grantedAt: perm.granted_at
  });

  const getDocumentPermissions = async (documentId: string): Promise<DocumentPermission[]> => {
    if (!user) return [];

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('document_permissions')
        .select('*')
        .eq('document_id', documentId);

      if (error) throw error;

      const convertedPermissions = data.map(convertToDocumentPermission);
      setPermissions(convertedPermissions);
      return convertedPermissions;
    } catch (err) {
      console.error('Error fetching document permissions:', err);
      toast.error('Failed to fetch document permissions');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const shareDocument = async (
    documentId: string,
    userEmail: string,
    userName: string,
    userRole: string,
    accessLevel: string
  ): Promise<boolean> => {
    if (!user) {
      toast.error('User not authenticated');
      return false;
    }

    try {
      const permissionData = {
        document_id: documentId,
        user_id: userEmail, // Using email as user_id for external users
        granted_by_user_id: user.id,
        access_level: accessLevel,
        user_name: userName,
        user_email: userEmail,
        user_role: userRole
      };

      const { error } = await supabase
        .from('document_permissions')
        .insert([permissionData]);

      if (error) throw error;

      // Update document to mark as shared
      const { error: updateError } = await supabase
        .from('documents')
        .update({ shared: true })
        .eq('id', documentId)
        .eq('user_id', user.id);

      if (updateError) console.warn('Failed to update document shared status:', updateError);

      toast.success(`Document shared with ${userName}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to share document';
      toast.error(errorMessage);
      return false;
    }
  };

  const updatePermission = async (
    documentId: string,
    userEmail: string,
    newAccessLevel: string
  ): Promise<boolean> => {
    if (!user) {
      toast.error('User not authenticated');
      return false;
    }

    try {
      const { error } = await supabase
        .from('document_permissions')
        .update({ access_level: newAccessLevel })
        .eq('document_id', documentId)
        .eq('user_email', userEmail);

      if (error) throw error;

      toast.success('Permission updated successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update permission';
      toast.error(errorMessage);
      return false;
    }
  };

  const removePermission = async (documentId: string, userEmail: string): Promise<boolean> => {
    if (!user) {
      toast.error('User not authenticated');
      return false;
    }

    try {
      const { error } = await supabase
        .from('document_permissions')
        .delete()
        .eq('document_id', documentId)
        .eq('user_email', userEmail);

      if (error) throw error;

      // Check if there are any remaining permissions
      const { data, error: checkError } = await supabase
        .from('document_permissions')
        .select('id')
        .eq('document_id', documentId)
        .limit(1);

      if (checkError) console.warn('Failed to check remaining permissions:', checkError);

      // If no permissions remain, mark document as not shared
      if (data && data.length === 0) {
        const { error: updateError } = await supabase
          .from('documents')
          .update({ shared: false })
          .eq('id', documentId)
          .eq('user_id', user.id);

        if (updateError) console.warn('Failed to update document shared status:', updateError);
      }

      toast.success('Permission removed successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove permission';
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    permissions,
    loading,
    getDocumentPermissions,
    shareDocument,
    updatePermission,
    removePermission
  };
};

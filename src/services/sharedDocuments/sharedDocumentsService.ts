
import { supabase } from '@/lib/supabase';
import { SharedDocument } from '@/hooks/useSupabaseSharedDocuments';

export const fetchSharedDocuments = async (userId: string): Promise<SharedDocument[]> => {
  console.log('Fetching shared documents for user:', userId);
  
  // First get shared documents with document details
  const { data: sharedDocsWithDocuments, error: sharedDocsError } = await supabase
    .from('shared_documents')
    .select(`
      *,
      documents!inner(name, type, size)
    `)
    .eq('user_id', userId)
    .order('shared_at', { ascending: false });

  if (sharedDocsError) {
    console.error('Error fetching shared documents:', sharedDocsError);
    throw new Error(sharedDocsError.message);
  }

  console.log('Raw shared documents data:', sharedDocsWithDocuments);

  // Then get professional details for non-placeholder professional IDs
  const professionalIds = sharedDocsWithDocuments
    ?.filter(item => item.professional_id !== "00000000-0000-0000-0000-000000000000")
    .map(item => item.professional_id) || [];

  let professionalsData: any[] = [];
  if (professionalIds.length > 0) {
    const { data: professionals, error: profError } = await supabase
      .from('professionals')
      .select('id, name, email')
      .in('id', professionalIds);

    if (profError) {
      console.error('Error fetching professionals:', profError);
    } else {
      professionalsData = professionals || [];
    }
  }

  console.log('Professionals data:', professionalsData);

  // Transform the data to flatten the joined fields
  const transformedData: SharedDocument[] = ((sharedDocsWithDocuments as any) || []).map((item: any) => {
    const professional = professionalsData.find(p => p.id === item.professional_id);
    
    return {
      id: item.id,
      user_id: item.user_id,
      professional_id: item.professional_id,
      document_id: item.document_id,
      permission_level: item.permission_level,
      shared_at: item.shared_at,
      expires_at: item.expires_at,
      created_at: item.created_at,
      updated_at: item.updated_at,
      professional_name: professional?.name,
      professional_email: professional?.email,
      document_name: item.documents?.name,
      document_type: item.documents?.type,
      document_size: item.documents?.size
    };
  });

  console.log('Transformed shared documents:', transformedData);
  return transformedData;
};

export const createSharedDocument = async (
  userId: string,
  professionalId: string,
  documentId: string,
  permissionLevel: 'view' | 'download' | 'edit' = 'view',
  expiresAt?: string
) => {
  console.log('Creating shared document:', {
    userId,
    professionalId,
    documentId,
    permissionLevel,
    expiresAt
  });

  const { data, error } = await supabase
    .from('shared_documents')
    .insert({
      user_id: userId,
      professional_id: professionalId,
      document_id: documentId,
      permission_level: permissionLevel,
      expires_at: expiresAt
    })
    .select()
    .single();

  if (error) {
    console.error('Error sharing document:', error);
    throw new Error(error.message);
  }

  console.log('Created shared document:', data);
  return data;
};

export const deleteSharedDocument = async (id: string, userId: string) => {
  console.log('Deleting shared document:', id, 'for user:', userId);
  
  const { error } = await supabase
    .from('shared_documents')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Error removing shared document:', error);
    throw new Error(error.message);
  }

  console.log('Successfully deleted shared document:', id);
};

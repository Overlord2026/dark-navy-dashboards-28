import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { EducationResource } from '@/types/education';
import { toast } from 'sonner';

export function useEducationResources() {
  const [resources, setResources] = useState<EducationResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('education_resources')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources((data || []).map(item => ({
        ...item,
        resource_type: item.resource_type as EducationResource['resource_type']
      })));
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching education resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('education-files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('education-files')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const addResource = async (
    resource: Omit<EducationResource, 'id' | 'created_at' | 'updated_at' | 'uploaded_by'>,
    file?: File
  ) => {
    try {
      let fileUrl = resource.file_url;
      let filePath = resource.file_path;
      let fileSize = resource.file_size;
      let mimeType = resource.mime_type;

      if (file) {
        fileUrl = await uploadFile(file);
        filePath = fileUrl.split('/').pop() || '';
        fileSize = file.size;
        mimeType = file.type;
      }

      const { error } = await supabase
        .from('education_resources')
        .insert({
          title: resource.title,
          description: resource.description,
          resource_type: resource.resource_type || 'pdf',
          category: resource.category || 'general',
          is_featured: resource.is_featured || false,
          is_active: true,
          file_url: fileUrl,
          file_path: filePath,
          file_size: fileSize,
          mime_type: mimeType,
        });

      if (error) throw error;
      
      await fetchResources();
      toast.success('Resource added successfully');
    } catch (err: any) {
      console.error('Error adding resource:', err);
      toast.error(`Failed to add resource: ${err.message}`);
      throw err;
    }
  };

  const updateResource = async (
    id: string,
    updates: Partial<EducationResource>
  ) => {
    try {
      const { error } = await supabase
        .from('education_resources')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchResources();
      toast.success('Resource updated successfully');
    } catch (err: any) {
      console.error('Error updating resource:', err);
      toast.error(`Failed to update resource: ${err.message}`);
      throw err;
    }
  };

  const deleteResource = async (id: string) => {
    try {
      const { error } = await supabase
        .from('education_resources')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      
      await fetchResources();
      toast.success('Resource deleted successfully');
    } catch (err: any) {
      console.error('Error deleting resource:', err);
      toast.error(`Failed to delete resource: ${err.message}`);
      throw err;
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return {
    resources,
    loading,
    error,
    addResource,
    updateResource,
    deleteResource,
    refetch: fetchResources,
  };
}
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface FileUploadOptions {
  bucket: string;
  folder?: string;
  allowedTypes?: string[];
  maxSizeInMB?: number;
}

export interface UploadResult {
  success: boolean;
  filePath?: string;
  url?: string;
  error?: string;
  contentType?: string;
  size?: number;
}

const DEFAULT_OPTIONS: Partial<FileUploadOptions> = {
  allowedTypes: ['image/*', 'application/pdf', '.doc', '.docx', '.txt'],
  maxSizeInMB: 10
};

export class FileUploadService {
  static async uploadFile(
    file: File, 
    options: FileUploadOptions
  ): Promise<UploadResult> {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return { success: false, error: 'Authentication required' };
      }

      // Validate file
      const validation = this.validateFile(file, options);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // Create file path with user folder structure
      const folder = options.folder || 'general';
      const fileName = this.sanitizeFileName(file.name);
      const timestamp = Date.now();
      const filePath = `${user.id}/${folder}/${timestamp}-${fileName}`;

      // Upload file to storage
      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        return { success: false, error: 'Failed to upload file' };
      }

      // Get public URL if needed (for public buckets)
      const { data: urlData } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(filePath);

      return {
        success: true,
        filePath: data.path,
        url: urlData.publicUrl,
        contentType: file.type,
        size: file.size
      };

    } catch (error) {
      console.error('File upload error:', error);
      return { success: false, error: 'Upload failed unexpectedly' };
    }
  }

  static async downloadFile(bucket: string, filePath: string): Promise<Blob | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(filePath);

      if (error) {
        console.error('File download error:', error);
        toast.error('Failed to download file');
        return null;
      }

      return data;
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed unexpectedly');
      return null;
    }
  }

  static async deleteFile(bucket: string, filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error('File deletion error:', error);
        toast.error('Failed to delete file');
        return false;
      }

      toast.success('File deleted successfully');
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Delete failed unexpectedly');
      return false;
    }
  }

  static async listUserFiles(bucket: string, folder?: string): Promise<any[]> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return [];
      }

      const path = folder ? `${user.id}/${folder}` : user.id;
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path, {
          limit: 100,
          offset: 0
        });

      if (error) {
        console.error('File listing error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('List files error:', error);
      return [];
    }
  }

  private static validateFile(file: File, options: FileUploadOptions): { isValid: boolean; error?: string } {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

    // Check file size
    if (mergedOptions.maxSizeInMB && file.size > mergedOptions.maxSizeInMB * 1024 * 1024) {
      return {
        isValid: false,
        error: `File size must be less than ${mergedOptions.maxSizeInMB}MB`
      };
    }

    // Check file type
    if (mergedOptions.allowedTypes && mergedOptions.allowedTypes.length > 0) {
      const isAllowedType = mergedOptions.allowedTypes.some(type => {
        if (type.includes('*')) {
          const baseType = type.split('/')[0];
          return file.type.startsWith(baseType);
        }
        return file.type === type || file.name.toLowerCase().endsWith(type);
      });

      if (!isAllowedType) {
        return {
          isValid: false,
          error: 'File type not allowed'
        };
      }
    }

    return { isValid: true };
  }

  private static sanitizeFileName(fileName: string): string {
    // Remove or replace invalid characters
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();
  }

  static getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'txt':
        return '📃';
      default:
        return '📎';
    }
  }
}
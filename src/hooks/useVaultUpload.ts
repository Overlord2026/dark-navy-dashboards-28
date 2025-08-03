import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadProgress {
  fileId?: string;
  progress: number;
  status: 'idle' | 'uploading' | 'completed' | 'failed';
  error?: string;
}

interface UseVaultUploadReturn {
  uploadFile: (vaultId: string, file: File) => Promise<string | null>;
  uploadProgress: UploadProgress;
  isUploading: boolean;
}

const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

export function useVaultUpload(): UseVaultUploadReturn {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle'
  });
  const { toast } = useToast();

  const uploadFile = useCallback(async (vaultId: string, file: File): Promise<string | null> => {
    try {
      setUploadProgress({ progress: 0, status: 'uploading' });

      // Calculate chunks
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

      // Step 1: Initiate upload
      const { data: initData, error: initError } = await supabase.functions.invoke('vault-upload', {
        body: {
          action: 'initiate_upload',
          vaultId,
          fileName: file.name,
          fileSize: file.size,
          contentType: file.type,
          totalChunks
        }
      });

      if (initError) throw initError;
      if (!initData?.fileId) throw new Error('Failed to initiate upload');

      const { fileId } = initData;
      setUploadProgress(prev => ({ ...prev, fileId, progress: 5 }));

      // Step 2: Upload chunks
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        // Convert chunk to base64
        const reader = new FileReader();
        const chunkData = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]); // Remove data URL prefix
          };
          reader.onerror = reject;
          reader.readAsDataURL(chunk);
        });

        // Upload chunk
        const { error: chunkError } = await supabase.functions.invoke('vault-upload', {
          body: {
            action: 'upload_chunk',
            fileId,
            chunkIndex,
            totalChunks,
            data: chunkData
          }
        });

        if (chunkError) throw chunkError;

        // Update progress
        const progress = 5 + ((chunkIndex + 1) / totalChunks) * 85; // 5-90%
        setUploadProgress(prev => ({ ...prev, progress }));
      }

      // Step 3: Complete upload
      const { error: completeError } = await supabase.functions.invoke('vault-upload', {
        body: {
          action: 'complete_upload',
          fileId
        }
      });

      if (completeError) throw completeError;

      setUploadProgress({ progress: 100, status: 'completed', fileId });
      
      toast({
        title: "Upload successful",
        description: `${file.name} has been securely uploaded to your vault.`,
      });

      return fileId;

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setUploadProgress({
        progress: 0,
        status: 'failed',
        error: errorMessage
      });

      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    }
  }, [toast]);

  return {
    uploadFile,
    uploadProgress,
    isUploading: uploadProgress.status === 'uploading'
  };
}
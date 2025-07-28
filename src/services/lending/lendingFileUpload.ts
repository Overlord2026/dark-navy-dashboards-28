import { supabase } from '@/integrations/supabase/client';

export interface LendingFileUploadOptions {
  documentType: string;
  loanId?: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export interface LendingUploadResult {
  success: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  documentId?: string;
  error?: string;
}

export class LendingFileUploadService {
  private static readonly DEFAULT_MAX_SIZE_MB = 10;
  private static readonly DEFAULT_ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  static async uploadLoanDocument(
    file: File, 
    options: LendingFileUploadOptions
  ): Promise<LendingUploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file, options);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Generate unique file path
      const fileExtension = file.name.split('.').pop();
      const fileName = `${options.documentType}_${Date.now()}.${fileExtension}`;
      const filePath = `${user.id}/${options.loanId || 'general'}/${fileName}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('lending-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return { success: false, error: 'Failed to upload file' };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('lending-documents')
        .getPublicUrl(filePath);

      // Create database record
      const { data: documentData, error: dbError } = await supabase
        .from('loan_documents')
        .insert({
          loan_id: options.loanId,
          user_id: user.id,
          doc_type: options.documentType,
          file_url: publicUrl,
          file_name: file.name,
          file_size: file.size,
          status: 'pending'
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        // Try to clean up uploaded file
        await supabase.storage
          .from('lending-documents')
          .remove([filePath]);
        return { success: false, error: 'Failed to save document record' };
      }

      return {
        success: true,
        fileUrl: publicUrl,
        fileName: file.name,
        fileSize: file.size,
        documentId: documentData.id
      };

    } catch (error) {
      console.error('Upload service error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown upload error' 
      };
    }
  }

  static async uploadPartnerDocument(
    file: File,
    applicationId: string,
    documentType: string
  ): Promise<LendingUploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file, { documentType });
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Generate unique file path for partner documents
      const fileExtension = file.name.split('.').pop();
      const fileName = `${documentType}_${Date.now()}.${fileExtension}`;
      const filePath = `partners/${applicationId}/${fileName}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('lending-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return { success: false, error: 'Failed to upload file' };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('lending-documents')
        .getPublicUrl(filePath);

      // Get current onboarding docs and append new one
      const { data: currentApp } = await supabase
        .from('partner_applications')
        .select('onboarding_docs')
        .eq('id', applicationId)
        .single();

      const currentDocs = currentApp?.onboarding_docs || [];
      const updatedDocs = [...currentDocs, publicUrl];

      // Update partner application with document
      const { error: updateError } = await supabase
        .from('partner_applications')
        .update({
          onboarding_docs: updatedDocs
        })
        .eq('id', applicationId);

      if (updateError) {
        console.error('Database update error:', updateError);
        // Try to clean up uploaded file
        await supabase.storage
          .from('lending-documents')
          .remove([filePath]);
        return { success: false, error: 'Failed to update application record' };
      }

      return {
        success: true,
        fileUrl: publicUrl,
        fileName: file.name,
        fileSize: file.size
      };

    } catch (error) {
      console.error('Partner upload error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown upload error' 
      };
    }
  }

  static async getLoanDocuments(loanId?: string): Promise<any[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      let query = supabase
        .from('loan_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (loanId) {
        query = query.eq('loan_id', loanId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching documents:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get documents error:', error);
      return [];
    }
  }

  static async deleteDocument(documentId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return false;
      }

      // Get document details first
      const { data: document, error: fetchError } = await supabase
        .from('loan_documents')
        .select('file_url, user_id')
        .eq('id', documentId)
        .eq('user_id', user.id)
        .single();

      if (fetchError || !document) {
        return false;
      }

      // Extract file path from URL
      const url = new URL(document.file_url);
      const filePath = url.pathname.split('/lending-documents/')[1];

      // Delete from storage
      await supabase.storage
        .from('lending-documents')
        .remove([filePath]);

      // Delete database record
      const { error: deleteError } = await supabase
        .from('loan_documents')
        .delete()
        .eq('id', documentId)
        .eq('user_id', user.id);

      return !deleteError;
    } catch (error) {
      console.error('Delete document error:', error);
      return false;
    }
  }

  private static validateFile(
    file: File, 
    options: LendingFileUploadOptions
  ): { valid: boolean; error?: string } {
    const maxSize = (options.maxSizeMB || this.DEFAULT_MAX_SIZE_MB) * 1024 * 1024;
    const allowedTypes = options.allowedTypes || this.DEFAULT_ALLOWED_TYPES;

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size must be less than ${options.maxSizeMB || this.DEFAULT_MAX_SIZE_MB}MB`
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not allowed. Please upload PDF, Word, or image files.'
      };
    }

    return { valid: true };
  }

  static getDocumentTypeIcon(docType: string): string {
    const iconMap: Record<string, string> = {
      'income_statement': 'FileText',
      'bank_statement': 'CreditCard',
      'tax_return': 'Receipt',
      'employment_verification': 'Briefcase',
      'id_document': 'IdCard',
      'credit_report': 'TrendingUp',
      'asset_verification': 'Building',
      'debt_verification': 'AlertCircle',
      'loan_application': 'FileCheck',
      'business_license': 'Award',
      'financial_statement': 'BarChart',
      'default': 'File'
    };

    return iconMap[docType] || iconMap.default;
  }
}
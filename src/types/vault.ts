
export type DocumentType = 'Will' | 'Trust' | 'Power of Attorney' | 'Insurance Policy' | 'Other';

export interface VaultDocument {
  id: string;
  documentType: DocumentType;
  description: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
}

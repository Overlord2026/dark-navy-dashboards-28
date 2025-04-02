
export type DocumentType = "pdf" | "image" | "spreadsheet" | "document" | "folder" | "legal" | "medical" | "financial" | "property";

export interface DocumentItem {
  id: string;
  name: string;
  created: string;
  type: DocumentType;
  size?: number | string;
  category: string;
  uploadedBy?: string;
  modified?: string;
  accessed?: string;
  description?: string;
  shared?: boolean;
  favorited?: boolean;
  shareLink?: string;
  sharedWith?: string[];
}

export interface DocumentCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}


export type DocumentType = "pdf" | "image" | "spreadsheet" | "document" | "folder";

export interface DocumentItem {
  id: string;
  name: string;
  created: string;
  type: DocumentType;
  size: string;
  category: string;
  description?: string;
  tags?: string[];
  sharedWith?: string[];
  lastModified?: string;
  owner?: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  icon?: React.ReactNode;
  description?: string;
}

export interface DocumentSearchFilters {
  category?: string;
  type?: DocumentType[];
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
  tags?: string[];
}

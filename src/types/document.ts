
export type DocumentType = "pdf" | "image" | "spreadsheet" | "document";

export interface DocumentItem {
  id: string;
  name: string;
  created: string;
  type: DocumentType;
  size: string;
  category: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
}

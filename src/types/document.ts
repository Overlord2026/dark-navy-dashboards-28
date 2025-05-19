
export type DocumentType = "document" | "pdf" | "spreadsheet" | "image" | "folder" | "external-link";

export interface DocumentPermission {
  userId: string;
  userName: string;
  userRole: string;
  accessLevel: "view" | "edit" | "admin";
  grantedBy: string;
  grantedAt: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: DocumentType;
  category?: string;
  size?: string | number;
  created?: string;
  modified?: string;
  uploadedBy?: string;
  description?: string;
  color?: string;
  sharedWith?: string[];
  permissions?: DocumentPermission[];
  url?: string; // Added to support external links
}

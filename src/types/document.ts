
export type DocumentType = "pdf" | "document" | "image" | "spreadsheet" | "folder";

export interface DocumentItem {
  id: string;
  name: string;
  type: DocumentType;
  created: string;
  modified?: string;
  category: string;
  size: string | number;
  uploadedBy?: string;
  sharedWith?: string[];
  tags?: string[];
  encrypted?: boolean;
  isPrivate?: boolean;
  permissions?: DocumentPermission[];
  shared?: boolean;
  isFolder?: boolean;
}

export interface DocumentPermission {
  userId: string;
  userName: string;
  userRole?: string;
  accessLevel: HealthcareAccessLevel;
  grantedBy?: string;
  grantedAt: string;
}

export type HealthcareAccessLevel = "view" | "edit" | "full";

export interface DocumentTag {
  id: string;
  name: string;
  color?: string;
  category?: string;
}

export const healthcareTags: DocumentTag[] = [
  { id: "medical-records", name: "Medical Records", color: "blue", category: "healthcare" },
  { id: "insurance", name: "Insurance", color: "green", category: "healthcare" },
  { id: "prescriptions", name: "Prescriptions", color: "purple", category: "healthcare" },
  { id: "lab-results", name: "Lab Results", color: "orange", category: "healthcare" },
  { id: "imaging", name: "Imaging", color: "red", category: "healthcare" },
  { id: "emergency", name: "Emergency", color: "red", category: "healthcare" },
  { id: "chronic-condition", name: "Chronic Condition", color: "yellow", category: "healthcare" },
  { id: "mental-health", name: "Mental Health", color: "indigo", category: "healthcare" },
  { id: "dental", name: "Dental", color: "teal", category: "dental" },
  { id: "vision", name: "Vision", color: "cyan", category: "vision" },
  { id: "preventive-care", name: "Preventive Care", color: "lime", category: "preventive-care" }
];

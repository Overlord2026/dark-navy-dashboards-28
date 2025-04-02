
export type DocumentType = "pdf" | "image" | "spreadsheet" | "document" | "folder" | "legal" | "medical" | "financial" | "property" | "healthcare" | "insurance" | "prescription";

// Access level types for healthcare documents
export type HealthcareAccessLevel = "none" | "view" | "edit" | "full";

export interface DocumentPermission {
  userId: string;
  userEmail?: string;
  userName?: string;
  userRole?: string;
  accessLevel: HealthcareAccessLevel;
  grantedBy?: string;
  grantedAt?: string;
}

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
  tags?: string[]; // Adding tags for categorization
  subcategory?: string; // For organizing within categories
  permissions?: DocumentPermission[]; // Per-document permissions
  encrypted?: boolean; // Flag to indicate if document is encrypted
  isPrivate?: boolean; // Flag to mark document as private/sensitive
  lastAccessedBy?: string; // Last person who accessed the document
  lastAccessedAt?: string; // When the document was last accessed
}

export interface DocumentCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface DocumentTag {
  id: string;
  name: string;
  category?: string;
}

// Common healthcare document tags
export const healthcareTags: DocumentTag[] = [
  { id: "medicare-a", name: "Medicare Part A", category: "insurance-coverage" },
  { id: "medicare-b", name: "Medicare Part B", category: "insurance-coverage" },
  { id: "medicare-advantage", name: "Medicare Advantage", category: "insurance-coverage" },
  { id: "medicare-supplement", name: "Medicare Supplement", category: "insurance-coverage" },
  { id: "private-insurance", name: "Private Insurance", category: "insurance-coverage" },
  { id: "primary-care", name: "Primary Care Doctor", category: "physicians" },
  { id: "specialist", name: "Specialist", category: "physicians" },
  { id: "chronic", name: "Chronic Medication", category: "prescriptions" },
  { id: "acute", name: "Acute Medication", category: "prescriptions" },
  { id: "lab-results", name: "Lab Results", category: "medical-records" },
  { id: "imaging", name: "Imaging Results", category: "medical-records" },
  { id: "surgical", name: "Surgical Records", category: "medical-records" },
  { id: "insurance-card", name: "Insurance Card", category: "insurance-coverage" },
];

// Healthcare professional role types
export const healthcareProfessionalRoles = [
  "Primary Care Physician",
  "Specialist",
  "Pharmacist",
  "Insurance Agent",
  "Family Member",
  "Financial Advisor",
  "Other"
];

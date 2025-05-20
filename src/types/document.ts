
export type DocumentType = "document" | "pdf" | "spreadsheet" | "image" | "folder" | "external-link";

export type HealthcareAccessLevel = "none" | "view" | "edit" | "full" | "restricted" | "admin";

export interface DocumentPermission {
  userId: string;
  userName: string;
  userRole: string;
  accessLevel: HealthcareAccessLevel;  // Updated to use HealthcareAccessLevel
  grantedBy: string;
  grantedAt: string;
  userEmail?: string;
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
  url?: string;
  shared?: boolean;
  lastAccessedBy?: string;
  encrypted?: boolean;
  isPrivate?: boolean;
}

// Add healthcare professional roles
export const healthcareProfessionalRoles = [
  "Primary Care Physician",
  "Specialist",
  "Nurse Practitioner",
  "Physician Assistant",
  "Pharmacist",
  "Physical Therapist",
  "Mental Health Professional",
  "Dentist",
  "Optometrist",
  "Chiropractor",
  "Other"
];

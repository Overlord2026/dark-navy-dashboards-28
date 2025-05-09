
// If the file already exists, add these properties to the DocumentItem interface
// If it doesn't exist, create it with the following content:

export type DocumentType = 'pdf' | 'document' | 'image' | 'spreadsheet' | 'folder';

export interface DocumentCategory {
  id: string;
  name: string;
  icon?: React.ReactNode;
  description?: string;
  path?: string;
}

export type DocumentTag = {
  id: string;
  name: string;
  category?: string;
}

export type DocumentAccessLevel = 'view' | 'edit' | 'full';
export type HealthcareAccessLevel = 'view' | 'edit' | 'full' | 'restricted';

export interface DocumentPermission {
  userId: string;
  userName: string;
  userRole?: string;
  accessLevel: DocumentAccessLevel | HealthcareAccessLevel;
  grantedAt: string;
  grantedBy?: string;
  expiresAt?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: DocumentType;
  category?: string;
  tags?: string[];
  created: string;
  modified?: string;
  size?: number | string;
  uploadedBy?: string;
  sharedWith?: string[];
  permissions?: DocumentPermission[];
  shared?: boolean;
  encrypted?: boolean;
  isPrivate?: boolean;
  description?: string;  // New field for folder descriptions
  color?: string;        // New field for folder color
  parentId?: string;     // New field for subfolder relationships
}

export interface HealthcareNotification {
  id: string;
  type: 'appointment' | 'medication' | 'test-results' | 'policy';
  title: string;
  description?: string;
  date: string;
  status: 'upcoming' | 'overdue' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export const healthcareTags: DocumentTag[] = [
  { id: 'medical-records', name: 'Medical Records', category: 'healthcare' },
  { id: 'insurance', name: 'Insurance', category: 'healthcare' },
  { id: 'prescriptions', name: 'Prescriptions', category: 'healthcare' },
  { id: 'lab-results', name: 'Lab Results', category: 'healthcare' },
  { id: 'imaging', name: 'Imaging', category: 'healthcare' },
  { id: 'advance-directives', name: 'Advance Directives', category: 'healthcare' },
  { id: 'covid-19', name: 'COVID-19', category: 'healthcare' }
];

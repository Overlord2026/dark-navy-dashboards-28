export interface EducationResource {
  id: string;
  title: string;
  description?: string;
  resource_type?: 'pdf' | 'docx' | 'flipbook' | 'external_link';
  file_path?: string;
  file_url?: string;
  file_size?: number;
  mime_type?: string;
  category?: string;
  is_featured?: boolean;
  is_active?: boolean;
  uploaded_by?: string;
  created_at?: string;
  updated_at?: string;
  // Extended properties for legacy compatibility
  author?: string;
  cover_image?: string;
  coverImage?: string; // alias for legacy code
  level?: string; // Allow any level value for flexibility
  is_paid?: boolean;
  isPaid?: boolean; // alias for legacy code
  ghl_url?: string;
  ghlUrl?: string; // alias for legacy code
  duration?: string;
  tags?: string[];
  rating?: number;
  difficulty?: string;
  persona?: string;
  image?: string;
  // Legacy structure compatibility
  guides?: EducationResource[];
  books?: EducationResource[];
  whitepapers?: EducationResource[];
  ebooks?: EducationResource[];
  resources?: EducationResource[];
  funnel?: EducationResource[];
}

// Database-specific interface for form submission
export interface EducationResourceData {
  id?: string;
  title: string;
  description?: string;
  resource_type: 'pdf' | 'docx' | 'flipbook' | 'external_link';
  file_path?: string;
  file_url?: string;
  file_size?: number;
  mime_type?: string;
  category: string;
  is_featured: boolean;
  is_active?: boolean;
  uploaded_by?: string;
  author?: string;
  cover_image?: string;
  level?: string;
  is_paid?: boolean;
  ghl_url?: string;
  duration?: string;
  tags?: string[];
  rating?: number;
  difficulty?: string;
  persona?: string;
  image?: string;
}

// Legacy compatibility aliases
export type EducationalResource = EducationResource;
export type EducationalResources = {
  guides?: EducationResource[];
  books?: EducationResource[];
  whitepapers?: EducationResource[];
  ebooks?: EducationResource[];
  resources?: EducationResource[];
  funnel?: EducationResource[];
};

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  category: string;
  // Extended properties for legacy compatibility
  image?: string;
  isPaid: boolean;
  ghlUrl?: string;
  categoryIds?: string[]; // for multi-category support
}

export interface CourseCategory {
  id: string;
  name: string;
  description?: string;
  active?: boolean; // for legacy compatibility
}

// Props interface for course components
export interface CourseProps {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  category: string;
  image?: string;
  isPaid: boolean;
  ghlUrl?: string;
}

export interface DetailedCourse extends Course {
  modules?: any[];
}

export interface EducationResourceFormData {
  title: string;
  description?: string;
  resource_type: 'pdf' | 'docx' | 'flipbook' | 'external_link';
  file_url?: string;
  category: string;
  is_featured: boolean;
  author?: string;
  level?: string;
  is_paid?: boolean;
  ghl_url?: string;
  duration?: string;
  persona?: string;
}
export interface EducationResource {
  id: string;
  title: string;
  description?: string;
  resource_type: 'pdf' | 'docx' | 'flipbook' | 'external_link';
  file_path?: string;
  file_url?: string;
  file_size?: number;
  mime_type?: string;
  category: string;
  is_featured: boolean;
  is_active: boolean;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

// Legacy compatibility aliases
export type EducationalResource = EducationResource;
export type EducationalResources = EducationResource;

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  category: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  description?: string;
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
}
export type CourseStatus = 'draft' | 'published' | 'archived';
export type CourseType = 'orientation' | 'compliance' | 'tools_training' | 'best_practices' | 'persona_specific';
export type MediaType = 'video' | 'pdf' | 'document' | 'image' | 'scorm';
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';

export interface Course {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  course_type: CourseType;
  persona: string;
  status: CourseStatus;
  thumbnail_url?: string;
  estimated_duration_minutes: number;
  ce_hours?: number;
  required_approval: boolean;
  is_required: boolean;
  prerequisites: string[];
  tags: string[];
  content: CourseContent[];
  quiz?: Quiz;
  certificate_template_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CourseContent {
  id: string;
  order: number;
  title: string;
  type: 'text' | 'video' | 'document' | 'quiz' | 'scorm';
  content: string; // HTML for text, URL for media
  duration_minutes?: number;
  required: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  passing_score: number;
  questions: QuizQuestion[];
  time_limit_minutes?: number;
  attempts_allowed: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  correct_answer: string;
  explanation?: string;
  points: number;
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  employee_id: string;
  enrolled_date: string;
  due_date?: string;
  started_date?: string;
  completed_date?: string;
  status: 'enrolled' | 'in_progress' | 'completed' | 'failed' | 'expired';
  progress_percentage: number;
  score?: number;
  ce_hours_earned?: number;
  certificate_url?: string;
  assigned_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingLibrary {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  type: MediaType;
  file_url: string;
  file_size: number;
  mime_type: string;
  tags: string[];
  persona: string;
  is_public: boolean;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: string;
  course_id: string;
  employee_id: string;
  certificate_url: string;
  issued_date: string;
  expiry_date?: string;
  ce_hours: number;
  is_valid: boolean;
  verification_code: string;
}

export interface CoursePack {
  id: string;
  persona: string;
  name: string;
  description: string;
  courses: Course[];
  is_default: boolean;
  created_at: string;
}

export interface LearningPath {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  persona: string;
  courses: string[];
  estimated_duration_hours: number;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComplianceRecord {
  id: string;
  organization_id: string;
  employee_id: string;
  course_id: string;
  completion_date: string;
  expiry_date?: string;
  ce_hours: number;
  certificate_url?: string;
  audit_trail: AuditEvent[];
  retention_until: string;
  created_at: string;
}

export interface AuditEvent {
  timestamp: string;
  event_type: string;
  details: string;
  user_id: string;
}
export type OrganizationRole = 'owner' | 'manager' | 'employee' | 'trainer' | 'compliance_officer';

export type Persona = 
  | 'financial_advisor'
  | 'cpa_accountant'
  | 'attorney_estate'
  | 'attorney_litigation'
  | 'realtor'
  | 'insurance_agent'
  | 'coach_consultant'
  | 'physician'
  | 'dentist'
  | 'business_owner'
  | 'independent_woman'
  | 'corporate_executive'
  | 'pre_retiree'
  | 'athlete_nil'
  | 'industry_org_leader';

export interface Organization {
  id: string;
  name: string;
  persona: Persona;
  logo_url?: string;
  brand_colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  retention_years: number;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  organization_id: string;
  user_id: string;
  employee_number?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: OrganizationRole;
  job_title: string;
  department?: string;
  manager_id?: string;
  start_date: string;
  status: 'active' | 'inactive' | 'terminated';
  profile_image_url?: string;
  current_projects: string[];
  created_at: string;
  updated_at: string;
}

export interface JobLadder {
  id: string;
  organization_id: string;
  persona: Persona;
  title: string;
  description: string;
  levels: JobLevel[];
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobLevel {
  id: string;
  level: number;
  title: string;
  description: string;
  competencies: string[];
  min_years_experience?: number;
  salary_range?: {
    min: number;
    max: number;
  };
}

export interface Project {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  owner_id: string;
  team_members: string[];
  start_date: string;
  due_date?: string;
  completed_date?: string;
  budget?: number;
  spent?: number;
  tags: string[];
  workflow_template_id?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowTemplate {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  persona: Persona;
  steps: WorkflowStep[];
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkflowStep {
  id: string;
  order: number;
  title: string;
  description: string;
  assignee_role?: OrganizationRole;
  estimated_hours?: number;
  requires_approval: boolean;
}

export interface AnnualReview {
  id: string;
  organization_id: string;
  employee_id: string;
  reviewer_id: string;
  review_period_start: string;
  review_period_end: string;
  status: 'draft' | 'in_progress' | 'completed' | 'approved';
  performance_score?: number;
  strengths: string[];
  areas_for_improvement: string[];
  goals: ReviewGoal[];
  skill_gaps: string[];
  recommended_courses: string[];
  comments: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewGoal {
  id: string;
  description: string;
  target_date: string;
  status: 'not_started' | 'in_progress' | 'completed';
}
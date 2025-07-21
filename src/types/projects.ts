import { TeamMember } from "./professionalTeam";

export type ProjectStatus = 'planning' | 'in_progress' | 'active' | 'completed' | 'on_hold' | 'cancelled';

export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';

export type ProjectVertical = 
  | 'estate_planning'
  | 'tax_strategy'
  | 'investment_management'
  | 'healthcare_planning'
  | 'property_management'
  | 'philanthropy'
  | 'family_governance'
  | 'risk_management'
  | 'education_planning'
  | 'business_succession'
  | 'lifestyle_management'
  | 'other';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  vertical: ProjectVertical;
  progress: number; // 0-100
  startDate: string;
  dueDate?: string;
  completedDate?: string;
  
  // Team assignments
  assignedTeam: TeamMember[];
  projectLead?: TeamMember;
  
  // Goals and milestones
  goals?: ProjectGoal[];
  milestones?: ProjectMilestone[];
  
  // Metadata
  tags?: string[];
  budget?: number;
  estimatedHours?: number;
  actualHours?: number;
  
  // Family context
  familyId: string;
  clientId: string;
  createdBy: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ProjectGoal {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  targetDate?: string;
  completed: boolean;
  completedDate?: string;
  assignedTo?: string;
  priority: ProjectPriority;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  completedDate?: string;
  assignedTeam: string[]; // User IDs
  deliverables?: string[];
  dependencies?: string[]; // Other milestone IDs
  createdAt: string;
  updatedAt: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  milestoneId?: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'blocked' | 'completed';
  priority: ProjectPriority;
  assignedTo?: string; // User ID
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  tags?: string[];
  isConfidential: boolean;
  accessLevel: 'public' | 'team' | 'leads_only' | 'confidential';
}

export interface ProjectCommunication {
  id: string;
  projectId: string;
  type: 'message' | 'meeting' | 'email' | 'note' | 'update';
  subject?: string;
  content: string;
  participants: string[]; // User IDs
  attachments?: string[]; // Document IDs
  createdBy: string;
  createdAt: string;
  tags?: string[];
}

// Project templates for different verticals
export const PROJECT_VERTICALS: Record<ProjectVertical, string> = {
  estate_planning: 'Estate Planning',
  tax_strategy: 'Tax Strategy',
  investment_management: 'Investment Management',
  healthcare_planning: 'Healthcare Planning',
  property_management: 'Property Management',
  philanthropy: 'Philanthropy',
  family_governance: 'Family Governance',
  risk_management: 'Risk Management',
  education_planning: 'Education Planning',
  business_succession: 'Business Succession',
  lifestyle_management: 'Lifestyle Management',
  other: 'Other'
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: 'Planning',
  in_progress: 'In Progress',
  active: 'Active',
  completed: 'Completed',
  on_hold: 'On Hold',
  cancelled: 'Cancelled'
};

export const PROJECT_PRIORITY_LABELS: Record<ProjectPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent'
};

// Template configurations for common project types
export interface ProjectTemplate {
  id: string;
  name: string;
  vertical: ProjectVertical;
  description: string;
  defaultMilestones: Omit<ProjectMilestone, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>[];
  defaultTasks: Omit<ProjectTask, 'id' | 'projectId' | 'createdAt' | 'updatedAt' | 'createdBy'>[];
  requiredRoles: string[]; // Professional relationship types
  estimatedDuration: number; // in days
  estimatedBudget?: number;
}

export const COMMON_PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'estate_planning_comprehensive',
    name: 'Comprehensive Estate Plan Review',
    vertical: 'estate_planning',
    description: 'Complete review and update of estate planning documents',
    requiredRoles: ['estate_attorney', 'cpa', 'lead_advisor'],
    estimatedDuration: 90,
    estimatedBudget: 15000,
    defaultMilestones: [
      {
        title: 'Document Review & Analysis',
        description: 'Review existing wills, trusts, and estate documents',
        dueDate: '30',
        completed: false,
        assignedTeam: [],
        deliverables: ['Document analysis report', 'Gap analysis']
      },
      {
        title: 'Tax Strategy Development',
        description: 'Develop tax-efficient transfer strategies',
        dueDate: '60',
        completed: false,
        assignedTeam: [],
        deliverables: ['Tax strategy memo', 'Gifting recommendations']
      },
      {
        title: 'Document Preparation & Execution',
        description: 'Prepare and execute updated estate documents',
        dueDate: '90',
        completed: false,
        assignedTeam: [],
        deliverables: ['Updated will', 'Trust documents', 'Power of attorney']
      }
    ],
    defaultTasks: [
      {
        title: 'Gather existing estate documents',
        status: 'todo',
        priority: 'high',
        estimatedHours: 4
      },
      {
        title: 'Schedule family meeting',
        status: 'todo', 
        priority: 'medium',
        estimatedHours: 2
      },
      {
        title: 'Review beneficiary designations',
        status: 'todo',
        priority: 'high',
        estimatedHours: 6
      }
    ]
  }
];
// Pre-seeded course packs for different personas
import { Course, Persona } from '@/types/lms';
import { OrganizationRole } from '@/types/operations';

export interface CoursePackTemplate {
  persona: Persona;
  courses: Omit<Course, 'id' | 'organization_id' | 'created_by' | 'created_at' | 'updated_at'>[];
}

export const coursePackTemplates: CoursePackTemplate[] = [
  {
    persona: 'financial_advisor',
    courses: [
      {
        title: 'Welcome & Platform Orientation',
        description: 'Learn how to navigate the platform and understand your role expectations.',
        course_type: 'orientation',
        persona: 'financial_advisor',
        status: 'published',
        estimated_duration_minutes: 45,
        is_required: true,
        required_approval: false,
        prerequisites: [],
        tags: ['orientation', 'onboarding'],
        content: [
          {
            id: '1',
            order: 1,
            title: 'Platform Overview',
            type: 'text',
            content: '<h3>Welcome to Your Financial Advisory Platform</h3><p>This comprehensive platform helps you manage clients, track compliance, and grow your practice efficiently.</p>',
            duration_minutes: 15,
            required: true
          },
          {
            id: '2',
            order: 2,
            title: 'Navigation Training',
            type: 'video',
            content: '/training/videos/navigation-overview.mp4',
            duration_minutes: 20,
            required: true
          },
          {
            id: '3',
            order: 3,
            title: 'Role Expectations',
            type: 'text',
            content: '<h3>Your Responsibilities as a Financial Advisor</h3><p>Understand client service standards, compliance requirements, and performance expectations.</p>',
            duration_minutes: 10,
            required: true
          }
        ]
      },
      {
        title: 'SEC/FINRA Compliance Training',
        description: 'Essential compliance training for financial advisors covering SEC and FINRA regulations.',
        course_type: 'compliance',
        persona: 'financial_advisor',
        status: 'published',
        estimated_duration_minutes: 120,
        ce_hours: 2,
        is_required: true,
        required_approval: true,
        prerequisites: [],
        tags: ['compliance', 'SEC', 'FINRA', 'regulations'],
        content: [
          {
            id: '1',
            order: 1,
            title: 'SEC Regulations Overview',
            type: 'text',
            content: '<h3>Securities and Exchange Commission Regulations</h3><p>Understanding fiduciary duty, investment advisor requirements, and client disclosure obligations.</p>',
            duration_minutes: 40,
            required: true
          },
          {
            id: '2',
            order: 2,
            title: 'FINRA Rules and Guidelines',
            type: 'text',
            content: '<h3>Financial Industry Regulatory Authority</h3><p>Broker-dealer regulations, suitability standards, and supervision requirements.</p>',
            duration_minutes: 40,
            required: true
          },
          {
            id: '3',
            order: 3,
            title: 'Compliance Quiz',
            type: 'quiz',
            content: '',
            duration_minutes: 40,
            required: true
          }
        ],
        quiz: {
          id: '1',
          title: 'SEC/FINRA Compliance Assessment',
          description: 'Test your knowledge of regulatory requirements',
          passing_score: 80,
          time_limit_minutes: 40,
          attempts_allowed: 3,
          questions: [
            {
              id: '1',
              question: 'What is the primary obligation of a fiduciary under SEC regulations?',
              type: 'multiple_choice',
              options: [
                'Maximize profits',
                'Act in the client\'s best interest',
                'Minimize fees',
                'Follow company policies'
              ],
              correct_answer: 'Act in the client\'s best interest',
              explanation: 'Fiduciaries must always act in the best interest of their clients.',
              points: 10
            }
          ]
        }
      },
      {
        title: 'Client Onboarding Workflow',
        description: 'Master the client onboarding process from initial contact to investment implementation.',
        course_type: 'persona_specific',
        persona: 'financial_advisor',
        status: 'published',
        estimated_duration_minutes: 90,
        ce_hours: 1.5,
        is_required: true,
        required_approval: false,
        prerequisites: [],
        tags: ['client-onboarding', 'workflow', 'process'],
        content: [
          {
            id: '1',
            order: 1,
            title: 'Initial Client Meeting',
            type: 'text',
            content: '<h3>Setting Up for Success</h3><p>Learn how to conduct effective discovery meetings and gather essential client information.</p>',
            duration_minutes: 30,
            required: true
          },
          {
            id: '2',
            order: 2,
            title: 'Documentation Requirements',
            type: 'document',
            content: '/training/docs/client-onboarding-checklist.pdf',
            duration_minutes: 20,
            required: true
          },
          {
            id: '3',
            order: 3,
            title: 'Investment Policy Statement Creation',
            type: 'text',
            content: '<h3>Creating Effective IPS Documents</h3><p>Guidelines for developing comprehensive investment policy statements.</p>',
            duration_minutes: 40,
            required: true
          }
        ]
      },
      {
        title: 'SWAG™ Retirement Roadmap Training',
        description: 'Learn to use the SWAG™ Retirement Roadmap for comprehensive retirement planning.',
        course_type: 'tools_training',
        persona: 'financial_advisor',
        status: 'published',
        estimated_duration_minutes: 75,
        ce_hours: 1.25,
        is_required: false,
        required_approval: false,
        prerequisites: [],
        tags: ['SWAG', 'retirement-planning', 'tools'],
        content: [
          {
            id: '1',
            order: 1,
            title: 'SWAG™ Overview',
            type: 'video',
            content: '/training/videos/swag-overview.mp4',
            duration_minutes: 25,
            required: true
          },
          {
            id: '2',
            order: 2,
            title: 'Scenario Modeling',
            type: 'text',
            content: '<h3>Advanced Scenario Analysis</h3><p>How to use stress testing and Monte Carlo simulations in client planning.</p>',
            duration_minutes: 30,
            required: true
          },
          {
            id: '3',
            order: 3,
            title: 'Client Presentation Best Practices',
            type: 'text',
            content: '<h3>Presenting SWAG™ Results</h3><p>Effective techniques for communicating complex planning scenarios to clients.</p>',
            duration_minutes: 20,
            required: true
          }
        ]
      }
    ]
  },
  {
    persona: 'cpa_accountant',
    courses: [
      {
        title: 'Welcome & Platform Orientation',
        description: 'Learn how to navigate the platform and understand your role expectations.',
        course_type: 'orientation',
        persona: 'cpa_accountant',
        status: 'published',
        estimated_duration_minutes: 45,
        is_required: true,
        required_approval: false,
        prerequisites: [],
        tags: ['orientation', 'onboarding'],
        content: [
          {
            id: '1',
            order: 1,
            title: 'Platform Overview for CPAs',
            type: 'text',
            content: '<h3>Welcome to Your CPA Practice Platform</h3><p>Streamline client management, ensure compliance, and optimize your accounting practice.</p>',
            duration_minutes: 15,
            required: true
          }
        ]
      },
      {
        title: 'Tax Season Workflow Management',
        description: 'Optimize your tax season processes and client communication.',
        course_type: 'persona_specific',
        persona: 'cpa_accountant',
        status: 'published',
        estimated_duration_minutes: 90,
        ce_hours: 1.5,
        is_required: true,
        required_approval: false,
        prerequisites: [],
        tags: ['tax-season', 'workflow', 'efficiency'],
        content: [
          {
            id: '1',
            order: 1,
            title: 'Tax Season Planning',
            type: 'text',
            content: '<h3>Preparing for Peak Season</h3><p>Strategies for managing workload and client expectations during tax season.</p>',
            duration_minutes: 30,
            required: true
          }
        ]
      },
      {
        title: 'IRS Compliance and Documentation',
        description: 'Stay current with IRS requirements and maintain proper documentation.',
        course_type: 'compliance',
        persona: 'cpa_accountant',
        status: 'published',
        estimated_duration_minutes: 120,
        ce_hours: 2,
        is_required: true,
        required_approval: true,
        prerequisites: [],
        tags: ['IRS', 'compliance', 'documentation'],
        content: [
          {
            id: '1',
            order: 1,
            title: 'IRS Regulations Update',
            type: 'text',
            content: '<h3>Current IRS Requirements</h3><p>Latest changes in tax law and compliance requirements.</p>',
            duration_minutes: 60,
            required: true
          }
        ]
      }
    ]
  }
  // Additional personas would be added here...
];

export const getDefaultJobLadders = () => {
  const jobLadders: Record<Persona, any> = {
    financial_advisor: {
      title: 'Financial Advisor Career Path',
      description: 'Progression from entry-level to senior advisory roles',
      levels: [
        {
          id: '1',
          level: 1,
          title: 'Associate Financial Planner',
          description: 'Entry-level position supporting senior advisors',
          competencies: ['Basic financial planning', 'Client support', 'Data entry'],
          min_years_experience: 0,
          salary_range: { min: 45000, max: 55000 }
        },
        {
          id: '2',
          level: 2,
          title: 'Junior Financial Advisor',
          description: 'Beginning to work directly with clients under supervision',
          competencies: ['Financial analysis', 'Client meetings', 'Investment research'],
          min_years_experience: 1,
          salary_range: { min: 55000, max: 70000 }
        },
        {
          id: '3',
          level: 3,
          title: 'Financial Advisor',
          description: 'Independent advisor with own client base',
          competencies: ['Comprehensive planning', 'Portfolio management', 'Business development'],
          min_years_experience: 3,
          salary_range: { min: 70000, max: 100000 }
        },
        {
          id: '4',
          level: 4,
          title: 'Senior Financial Advisor',
          description: 'Experienced advisor with complex cases and mentoring responsibilities',
          competencies: ['Advanced planning', 'Team leadership', 'Practice management'],
          min_years_experience: 7,
          salary_range: { min: 100000, max: 150000 }
        },
        {
          id: '5',
          level: 5,
          title: 'Partner/Principal',
          description: 'Equity owner with strategic responsibilities',
          competencies: ['Strategic planning', 'Business ownership', 'Firm leadership'],
          min_years_experience: 10,
          salary_range: { min: 150000, max: 300000 }
        }
      ]
    },
    cpa_accountant: {
      title: 'CPA Career Progression',
      description: 'From staff accountant to managing partner',
      levels: [
        {
          id: '1',
          level: 1,
          title: 'Staff Accountant',
          description: 'Entry-level accounting role',
          competencies: ['Basic accounting', 'Data entry', 'Bookkeeping'],
          min_years_experience: 0,
          salary_range: { min: 40000, max: 50000 }
        },
        {
          id: '2',
          level: 2,
          title: 'Senior Accountant',
          description: 'Experienced accountant with specialized responsibilities',
          competencies: ['Financial reporting', 'Tax preparation', 'Client interaction'],
          min_years_experience: 2,
          salary_range: { min: 50000, max: 65000 }
        },
        {
          id: '3',
          level: 3,
          title: 'Tax Manager',
          description: 'Manages tax department and complex returns',
          competencies: ['Tax strategy', 'Team management', 'Client advisory'],
          min_years_experience: 5,
          salary_range: { min: 65000, max: 85000 }
        },
        {
          id: '4',
          level: 4,
          title: 'Partner',
          description: 'Equity partner with firm ownership',
          competencies: ['Business development', 'Strategic planning', 'Firm leadership'],
          min_years_experience: 10,
          salary_range: { min: 100000, max: 250000 }
        }
      ]
    },
    attorney_estate: {
      title: 'Estate Planning Attorney Path',
      description: 'Specialization in estate and trust law',
      levels: [
        {
          id: '1',
          level: 1,
          title: 'Associate Attorney',
          description: 'Entry-level attorney position',
          competencies: ['Legal research', 'Document drafting', 'Client support'],
          min_years_experience: 0,
          salary_range: { min: 70000, max: 90000 }
        },
        {
          id: '2',
          level: 2,
          title: 'Senior Associate',
          description: 'Experienced attorney with client responsibilities',
          competencies: ['Estate planning', 'Trust administration', 'Client counseling'],
          min_years_experience: 3,
          salary_range: { min: 90000, max: 120000 }
        },
        {
          id: '3',
          level: 3,
          title: 'Partner',
          description: 'Equity partner with practice ownership',
          competencies: ['Business development', 'Complex planning', 'Firm management'],
          min_years_experience: 8,
          salary_range: { min: 150000, max: 400000 }
        }
      ]
    },
    attorney_litigation: {
      title: 'Litigation Attorney Path',
      description: 'Trial and litigation specialization',
      levels: [
        {
          id: '1',
          level: 1,
          title: 'Associate Attorney',
          description: 'Entry-level litigation support',
          competencies: ['Legal research', 'Discovery', 'Brief writing'],
          min_years_experience: 0,
          salary_range: { min: 75000, max: 95000 }
        },
        {
          id: '2',
          level: 2,
          title: 'Senior Associate',
          description: 'Lead case management and court appearances',
          competencies: ['Trial advocacy', 'Case strategy', 'Client representation'],
          min_years_experience: 4,
          salary_range: { min: 95000, max: 130000 }
        },
        {
          id: '3',
          level: 3,
          title: 'Partner',
          description: 'Practice owner and rainmaker',
          competencies: ['Business development', 'Complex litigation', 'Firm leadership'],
          min_years_experience: 8,
          salary_range: { min: 160000, max: 500000 }
        }
      ]
    },
    realtor: {
      title: 'Real Estate Agent Career Path',
      description: 'From new agent to brokerage owner',
      levels: [
        {
          id: '1',
          level: 1,
          title: 'New Agent',
          description: 'Licensed real estate agent starting their career',
          competencies: ['Listing procedures', 'Buyer representation', 'Market knowledge'],
          min_years_experience: 0,
          salary_range: { min: 30000, max: 50000 }
        },
        {
          id: '2',
          level: 2,
          title: 'Experienced Agent',
          description: 'Established agent with consistent sales',
          competencies: ['Negotiation', 'Marketing', 'Client relationships'],
          min_years_experience: 2,
          salary_range: { min: 50000, max: 80000 }
        },
        {
          id: '3',
          level: 3,
          title: 'Top Producer',
          description: 'High-volume agent with specialized expertise',
          competencies: ['Luxury markets', 'Investment properties', 'Team building'],
          min_years_experience: 5,
          salary_range: { min: 80000, max: 150000 }
        },
        {
          id: '4',
          level: 4,
          title: 'Broker/Owner',
          description: 'Brokerage owner and manager',
          competencies: ['Business management', 'Agent training', 'Regulatory compliance'],
          min_years_experience: 8,
          salary_range: { min: 100000, max: 300000 }
        }
      ]
    },
    insurance_agent: {
      title: 'Insurance Agent Career Path',
      description: 'Insurance and annuities sales progression',
      levels: [
        {
          id: '1',
          level: 1,
          title: 'Licensed Agent',
          description: 'Newly licensed insurance agent',
          competencies: ['Product knowledge', 'Needs analysis', 'Policy applications'],
          min_years_experience: 0,
          salary_range: { min: 35000, max: 50000 }
        },
        {
          id: '2',
          level: 2,
          title: 'Senior Agent',
          description: 'Experienced agent with established book',
          competencies: ['Advanced products', 'Estate planning', 'Business insurance'],
          min_years_experience: 3,
          salary_range: { min: 50000, max: 80000 }
        },
        {
          id: '3',
          level: 3,
          title: 'Agency Manager',
          description: 'Manages team of agents',
          competencies: ['Team leadership', 'Recruiting', 'Sales management'],
          min_years_experience: 7,
          salary_range: { min: 80000, max: 120000 }
        }
      ]
    },
    coach_consultant: {
      title: 'Coach/Consultant Career Path',
      description: 'Independent consulting progression',
      levels: [
        {
          id: '1',
          level: 1,
          title: 'Associate Consultant',
          description: 'Entry-level consulting role',
          competencies: ['Research', 'Analysis', 'Client support'],
          min_years_experience: 0,
          salary_range: { min: 45000, max: 60000 }
        },
        {
          id: '2',
          level: 2,
          title: 'Senior Consultant',
          description: 'Independent practice builder',
          competencies: ['Program development', 'Client acquisition', 'Delivery excellence'],
          min_years_experience: 3,
          salary_range: { min: 60000, max: 100000 }
        },
        {
          id: '3',
          level: 3,
          title: 'Principal/Partner',
          description: 'Practice owner and thought leader',
          competencies: ['Business development', 'Strategic planning', 'Team building'],
          min_years_experience: 7,
          salary_range: { min: 100000, max: 250000 }
        }
      ]
    },
    physician: {
      title: 'Physician Career Path',
      description: 'Medical practice progression',
      levels: [
        {
          id: '1',
          level: 1,
          title: 'Resident Physician',
          description: 'Medical resident in training',
          competencies: ['Patient care', 'Medical knowledge', 'Clinical skills'],
          min_years_experience: 0,
          salary_range: { min: 55000, max: 65000 }
        },
        {
          id: '2',
          level: 2,
          title: 'Attending Physician',
          description: 'Independent practicing physician',
          competencies: ['Diagnosis', 'Treatment planning', 'Patient management'],
          min_years_experience: 4,
          salary_range: { min: 200000, max: 300000 }
        },
        {
          id: '3',
          level: 3,
          title: 'Department Head',
          description: 'Leadership role in medical practice',
          competencies: ['Team leadership', 'Practice management', 'Quality improvement'],
          min_years_experience: 10,
          salary_range: { min: 300000, max: 500000 }
        }
      ]
    },
    dentist: {
      title: 'Dental Practice Career Path',
      description: 'Dental practice progression',
      levels: [
        {
          id: '1',
          level: 1,
          title: 'Associate Dentist',
          description: 'Employed dentist in established practice',
          competencies: ['General dentistry', 'Patient care', 'Treatment planning'],
          min_years_experience: 0,
          salary_range: { min: 120000, max: 160000 }
        },
        {
          id: '2',
          level: 2,
          title: 'Practice Owner',
          description: 'Independent dental practice owner',
          competencies: ['Practice management', 'Business development', 'Team leadership'],
          min_years_experience: 5,
          salary_range: { min: 180000, max: 300000 }
        }
      ]
    },
    business_owner: {
      title: 'Business Leadership Path',
      description: 'Entrepreneurial and executive progression',
      levels: [
        {
          id: '1',
          level: 1,
          title: 'Startup Founder',
          description: 'Early-stage business owner',
          competencies: ['Vision development', 'Resource management', 'Market validation'],
          min_years_experience: 0,
          salary_range: { min: 0, max: 100000 }
        },
        {
          id: '2',
          level: 2,
          title: 'Established Owner',
          description: 'Successful business operator',
          competencies: ['Operations management', 'Team building', 'Growth strategy'],
          min_years_experience: 3,
          salary_range: { min: 75000, max: 200000 }
        },
        {
          id: '3',
          level: 3,
          title: 'Serial Entrepreneur',
          description: 'Multiple business owner and investor',
          competencies: ['Portfolio management', 'Investment strategy', 'Mentoring'],
          min_years_experience: 10,
          salary_range: { min: 200000, max: 1000000 }
        }
      ]
    },
    independent_woman: {
      title: 'Professional Development Path',
      description: 'Career advancement for independent professionals',
      levels: [
        {
          id: '1',
          level: 1,
          title: 'Emerging Professional',
          description: 'Early career professional building foundation',
          competencies: ['Financial literacy', 'Career planning', 'Network building'],
          min_years_experience: 0,
          salary_range: { min: 40000, max: 60000 }
        },
        {
          id: '2',
          level: 2,
          title: 'Established Professional',
          description: 'Mid-career professional with expertise',
          competencies: ['Leadership', 'Wealth building', 'Strategic planning'],
          min_years_experience: 5,
          salary_range: { min: 60000, max: 100000 }
        },
        {
          id: '3',
          level: 3,
          title: 'Executive Leader',
          description: 'Senior leadership role',
          competencies: ['Executive presence', 'Legacy planning', 'Mentoring others'],
          min_years_experience: 12,
          salary_range: { min: 100000, max: 250000 }
        }
      ]
    },
    corporate_executive: {
      title: 'Corporate Executive Path',
      description: 'Corporate leadership progression',
      levels: [
        {
          id: '1',
          level: 1,
          title: 'Manager',
          description: 'First-level management role',
          competencies: ['Team management', 'Project leadership', 'Performance management'],
          min_years_experience: 3,
          salary_range: { min: 70000, max: 100000 }
        },
        {
          id: '2',
          level: 2,
          title: 'Director',
          description: 'Department head role',
          competencies: ['Strategic thinking', 'Budget management', 'Cross-functional leadership'],
          min_years_experience: 7,
          salary_range: { min: 100000, max: 150000 }
        },
        {
          id: '3',
          level: 3,
          title: 'Vice President',
          description: 'Senior executive role',
          competencies: ['Business strategy', 'P&L responsibility', 'Organizational leadership'],
          min_years_experience: 12,
          salary_range: { min: 150000, max: 300000 }
        },
        {
          id: '4',
          level: 4,
          title: 'C-Suite Executive',
          description: 'Top executive leadership',
          competencies: ['Vision setting', 'Board relations', 'Stakeholder management'],
          min_years_experience: 18,
          salary_range: { min: 300000, max: 1000000 }
        }
      ]
    },
    pre_retiree: {
      title: 'Pre-Retirement Transition',
      description: 'Preparing for retirement transition',
      levels: [
        {
          id: '1',
          level: 1,
          title: 'Pre-Retirement Planning',
          description: 'Initial retirement planning phase',
          competencies: ['Financial assessment', 'Lifestyle planning', 'Healthcare planning'],
          min_years_experience: 0,
          salary_range: { min: 0, max: 0 }
        },
        {
          id: '2',
          level: 2,
          title: 'Retirement Transition',
          description: 'Active transition to retirement',
          competencies: ['Income optimization', 'Asset management', 'Legacy planning'],
          min_years_experience: 2,
          salary_range: { min: 0, max: 0 }
        }
      ]
    },
    athlete_nil: {
      title: 'Athlete Career Management',
      description: 'Professional athlete career progression',
      levels: [
        {
          id: '1',
          level: 1,
          title: 'Emerging Athlete',
          description: 'Early career athlete building brand',
          competencies: ['Brand development', 'Financial literacy', 'Contract negotiation'],
          min_years_experience: 0,
          salary_range: { min: 25000, max: 100000 }
        },
        {
          id: '2',
          level: 2,
          title: 'Professional Athlete',
          description: 'Established professional athlete',
          competencies: ['Wealth preservation', 'Business ventures', 'Public relations'],
          min_years_experience: 3,
          salary_range: { min: 100000, max: 5000000 }
        },
        {
          id: '3',
          level: 3,
          title: 'Veteran/Retired Athlete',
          description: 'Transitioning to post-athletic career',
          competencies: ['Career transition', 'Business ownership', 'Mentoring'],
          min_years_experience: 8,
          salary_range: { min: 50000, max: 1000000 }
        }
      ]
    },
    industry_org_leader: {
      title: 'Industry Organization Leadership',
      description: 'Professional association leadership path',
      levels: [
        {
          id: '1',
          level: 1,
          title: 'Committee Member',
          description: 'Active volunteer on industry committees',
          competencies: ['Industry knowledge', 'Networking', 'Volunteer leadership'],
          min_years_experience: 0,
          salary_range: { min: 0, max: 0 }
        },
        {
          id: '2',
          level: 2,
          title: 'Board Member',
          description: 'Board of directors role',
          competencies: ['Governance', 'Strategic planning', 'Fiduciary responsibility'],
          min_years_experience: 5,
          salary_range: { min: 0, max: 25000 }
        },
        {
          id: '3',
          level: 3,
          title: 'Executive Leadership',
          description: 'President or CEO of industry organization',
          competencies: ['Organizational leadership', 'Public speaking', 'Industry advocacy'],
          min_years_experience: 10,
          salary_range: { min: 100000, max: 300000 }
        }
      ]
    }
  };

  return jobLadders;
};
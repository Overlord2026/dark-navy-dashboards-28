import {
  Users,
  TrendingUp,
  Calculator,
  FileText,
  Shield,
  Heart,
  Home,
  Briefcase,
  Target,
  Calendar,
  CreditCard,
  DollarSign,
  PieChart,
  Settings,
  UserPlus,
  MessageSquare,
  BookOpen,
  Award,
  Building,
  Globe,
  Phone,
  Mail,
  Camera,
  Video,
  Mic,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  Share,
  Lock,
  Unlock,
  Edit,
  Trash,
  Plus,
  Minus,
  Check,
  X,
  ChevronRight,
  Star,
  Crown
} from 'lucide-react';

interface AppModule {
  id: string;
  title: string;
  description: string;
  icon: typeof Users;
  href: string;
  status?: 'active' | 'premium' | 'coming-soon';
  badge?: string;
  color?: string;
}

interface AppSection {
  id: string;
  title: string;
  modules: AppModule[];
}

export const getPersonaAppSections = (persona: string): AppSection[] => {
  const sections: Record<string, AppSection[]> = {
    client: [
      {
        id: 'wealth-management',
        title: 'Wealth Management',
        modules: [
          {
            id: 'portfolio-overview',
            title: 'Portfolio',
            description: 'View your investment portfolio and performance',
            icon: PieChart,
            href: '/wealth/portfolio',
            color: 'text-emerald'
          },
          {
            id: 'net-worth',
            title: 'Net Worth',
            description: 'Track your total assets and liabilities',
            icon: TrendingUp,
            href: '/wealth/net-worth',
            color: 'text-primary'
          },
          {
            id: 'cash-management',
            title: 'Cash & Banking',
            description: 'Manage your cash accounts and transfers',
            icon: DollarSign,
            href: '/wealth/cash',
            color: 'text-accent'
          },
          {
            id: 'properties',
            title: 'Real Estate',
            description: 'Track your property investments',
            icon: Home,
            href: '/wealth/properties',
            color: 'text-gold'
          }
        ]
      },
      {
        id: 'planning',
        title: 'Financial Planning',
        modules: [
          {
            id: 'goals',
            title: 'Goals & Targets',
            description: 'Set and track your financial goals',
            icon: Target,
            href: '/goals',
            color: 'text-primary'
          },
          {
            id: 'retirement',
            title: 'Retirement Planning',
            description: 'Plan for your retirement future',
            icon: Calendar,
            href: '/retirement',
            color: 'text-emerald'
          },
          {
            id: 'tax-planning',
            title: 'Tax Optimization',
            description: 'Optimize your tax strategy',
            icon: Calculator,
            href: '/tax-planning',
            status: 'premium',
            color: 'text-accent'
          },
          {
            id: 'insurance',
            title: 'Insurance Review',
            description: 'Review your insurance coverage',
            icon: Shield,
            href: '/insurance',
            color: 'text-gold'
          }
        ]
      },
      {
        id: 'services',
        title: 'Family Office Services',
        modules: [
          {
            id: 'marketplace',
            title: 'Marketplace',
            description: 'Access elite services and opportunities',
            icon: Crown,
            href: '/marketplace',
            color: 'text-gold'
          },
          {
            id: 'concierge',
            title: 'Concierge Services',
            description: 'Personal assistance and lifestyle management',
            icon: Bell,
            href: '/concierge',
            status: 'premium',
            color: 'text-primary'
          },
          {
            id: 'health-wellness',
            title: 'Health & Wellness',
            description: 'Premium healthcare and wellness services',
            icon: Heart,
            href: '/health',
            color: 'text-accent'
          },
          {
            id: 'education',
            title: 'Education Center',
            description: 'Financial education and resources',
            icon: BookOpen,
            href: '/education',
            color: 'text-emerald'
          }
        ]
      },
      {
        id: 'documents',
        title: 'Documents & Vault',
        modules: [
          {
            id: 'vault',
            title: 'Family Vault',
            description: 'Secure document storage',
            icon: Lock,
            href: '/vault',
            color: 'text-primary'
          },
          {
            id: 'statements',
            title: 'Statements',
            description: 'View account statements and reports',
            icon: FileText,
            href: '/statements',
            color: 'text-emerald'
          },
          {
            id: 'tax-documents',
            title: 'Tax Documents',
            description: 'Access tax forms and filings',
            icon: Calculator,
            href: '/tax-docs',
            color: 'text-accent'
          },
          {
            id: 'legal-docs',
            title: 'Legal Documents',
            description: 'Estate planning and legal documents',
            icon: Shield,
            href: '/legal',
            status: 'premium',
            color: 'text-gold'
          }
        ]
      }
    ],
    advisor: [
      {
        id: 'practice-management',
        title: 'Practice Management',
        modules: [
          {
            id: 'client-households',
            title: 'Client Households',
            description: 'Manage client families and accounts',
            icon: Users,
            href: '/advisor/households',
            color: 'text-primary'
          },
          {
            id: 'accounts',
            title: 'Accounts',
            description: 'Portfolio and account management',
            icon: CreditCard,
            href: '/advisor/accounts',
            color: 'text-emerald'
          },
          {
            id: 'billing-center',
            title: 'Billing Center',
            description: 'Fee billing and payment processing',
            icon: DollarSign,
            href: '/advisor/billing',
            color: 'text-accent'
          },
          {
            id: 'reporting-center',
            title: 'Reporting Center',
            description: 'Client reports and analytics',
            icon: FileText,
            href: '/advisor/reports',
            color: 'text-gold'
          },
          {
            id: 'proposals',
            title: 'Proposals & Composites',
            description: 'Investment proposals and model portfolios',
            icon: Target,
            href: '/advisor/proposals',
            color: 'text-primary'
          }
        ]
      },
      {
        id: 'client-value-tools',
        title: 'Client Value Tools',
        modules: [
          {
            id: 'tax-return-scan',
            title: 'Scan Client Tax Return',
            description: 'AI-powered tax return analysis and insights',
            icon: Calculator,
            href: '/advisor/tax-scan',
            status: 'premium',
            badge: 'NEW',
            color: 'text-emerald'
          },
          {
            id: 'estate-plan-creator',
            title: 'Create Estate Plan',
            description: 'Digital estate planning collaboration tool',
            icon: Shield,
            href: '/advisor/estate-planning',
            status: 'premium',
            badge: 'NEW',
            color: 'text-gold'
          },
          {
            id: 'portfolio-analyzer',
            title: 'Portfolio Analyzer',
            description: 'Advanced portfolio analysis and optimization',
            icon: PieChart,
            href: '/advisor/portfolio-analyzer',
            color: 'text-primary'
          },
          {
            id: 'model-portfolios',
            title: 'Model Portfolios',
            description: 'Create and manage investment models',
            icon: TrendingUp,
            href: '/advisor/models',
            color: 'text-accent'
          },
          {
            id: 'swag-lead-score',
            title: 'SWAG Lead Score',
            description: 'AI-powered prospect scoring system',
            icon: Star,
            href: '/advisor/lead-scoring',
            status: 'premium',
            color: 'text-gold'
          }
        ]
      },
      {
        id: 'lead-to-sales-engine',
        title: 'Lead to Sales Engine',
        modules: [
          {
            id: 'create-campaign',
            title: 'Create Campaign',
            description: 'Launch marketing and nurture campaigns',
            icon: Target,
            href: '/advisor/campaigns/create',
            color: 'text-primary'
          },
          {
            id: 'track-leads',
            title: 'Track Leads',
            description: 'Monitor lead sources and conversion',
            icon: Users,
            href: '/advisor/leads',
            color: 'text-emerald'
          },
          {
            id: 'nurture-pipeline',
            title: 'Lead Nurture Pipeline',
            description: 'Automated lead nurturing workflows',
            icon: Target,
            href: '/advisor/nurture',
            color: 'text-accent'
          },
          {
            id: 'referral-dashboard',
            title: 'Referral Dashboard',
            description: 'Track referrals and partner credits',
            icon: Share,
            href: '/advisor/referrals',
            color: 'text-gold'
          },
          {
            id: 'email-sms-marketing',
            title: 'Email/SMS Marketing',
            description: 'Multi-channel marketing automation',
            icon: MessageSquare,
            href: '/advisor/marketing',
            status: 'premium',
            color: 'text-primary'
          }
        ]
      },
      {
        id: 'activity-management',
        title: 'Activity Management',
        modules: [
          {
            id: 'contacts',
            title: 'Contacts',
            description: 'Comprehensive contact management',
            icon: Users,
            href: '/advisor/contacts',
            color: 'text-primary'
          },
          {
            id: 'calendar',
            title: 'Calendar',
            description: 'Schedule meetings and appointments',
            icon: Calendar,
            href: '/advisor/calendar',
            color: 'text-emerald'
          },
          {
            id: 'email',
            title: 'Email',
            description: 'Integrated email management',
            icon: Mail,
            href: '/advisor/email',
            color: 'text-accent'
          },
          {
            id: 'notes',
            title: 'Notes',
            description: 'Client notes and meeting records',
            icon: FileText,
            href: '/advisor/notes',
            color: 'text-gold'
          },
          {
            id: 'workflows',
            title: 'Workflows',
            description: 'Automated business processes',
            icon: Target,
            href: '/advisor/workflows',
            color: 'text-primary'
          },
          {
            id: 'tasks-opportunities',
            title: 'Tasks & Opportunities',
            description: 'Track tasks and business opportunities',
            icon: Check,
            href: '/advisor/tasks',
            color: 'text-emerald'
          }
        ]
      },
      {
        id: 'compliance-support',
        title: 'Compliance & Support',
        modules: [
          {
            id: 'alerts-announcements',
            title: 'Alerts & Announcements',
            description: 'Important updates and notifications',
            icon: Bell,
            href: '/advisor/alerts',
            color: 'text-primary'
          },
          {
            id: 'document-vault',
            title: 'Secure Document Vault',
            description: 'Encrypted document storage and sharing',
            icon: Lock,
            href: '/advisor/vault',
            color: 'text-emerald'
          },
          {
            id: 'user-settings',
            title: 'User Settings',
            description: 'Profile and system preferences',
            icon: Settings,
            href: '/advisor/settings',
            color: 'text-accent'
          },
          {
            id: 'ai-concierge',
            title: 'Support & AI Concierge',
            description: 'Get help from Linda AI assistant',
            icon: MessageSquare,
            href: '/advisor/support',
            badge: 'Ask Linda',
            color: 'text-gold'
          }
        ]
      }
    ],
    accountant: [
      {
        id: 'tax-services',
        title: 'Tax Services',
        modules: [
          {
            id: 'tax-preparation',
            title: 'Tax Preparation',
            description: 'Prepare client tax returns',
            icon: Calculator,
            href: '/accountant/tax-prep',
            color: 'text-primary'
          },
          {
            id: 'tax-planning',
            title: 'Tax Planning',
            description: 'Strategic tax planning for clients',
            icon: Target,
            href: '/accountant/tax-planning',
            color: 'text-emerald'
          },
          {
            id: 'deadline-tracker',
            title: 'Deadline Tracker',
            description: 'Monitor important tax deadlines',
            icon: Calendar,
            href: '/accountant/deadlines',
            color: 'text-accent'
          },
          {
            id: 'tax-research',
            title: 'Tax Research',
            description: 'Access tax codes and regulations',
            icon: BookOpen,
            href: '/accountant/research',
            status: 'premium',
            color: 'text-gold'
          }
        ]
      },
      {
        id: 'client-services',
        title: 'Client Services',
        modules: [
          {
            id: 'client-management',
            title: 'Client Management',
            description: 'Manage all client relationships',
            icon: Users,
            href: '/accountant/clients',
            color: 'text-primary'
          },
          {
            id: 'document-portal',
            title: 'Document Portal',
            description: 'Secure client document exchange',
            icon: FileText,
            href: '/accountant/documents',
            color: 'text-emerald'
          },
          {
            id: 'engagement-letters',
            title: 'Engagement Management',
            description: 'Manage client engagements',
            icon: Shield,
            href: '/accountant/engagements',
            color: 'text-accent'
          },
          {
            id: 'client-communication',
            title: 'Client Communication',
            description: 'Secure messaging and updates',
            icon: MessageSquare,
            href: '/accountant/communication',
            color: 'text-gold'
          }
        ]
      },
      {
        id: 'practice-management',
        title: 'Practice Management',
        modules: [
          {
            id: 'billing',
            title: 'Time & Billing',
            description: 'Track time and generate invoices',
            icon: CreditCard,
            href: '/accountant/billing',
            color: 'text-primary'
          },
          {
            id: 'workflow',
            title: 'Workflow Management',
            description: 'Streamline practice workflows',
            icon: Target,
            href: '/accountant/workflow',
            color: 'text-emerald'
          },
          {
            id: 'staff-management',
            title: 'Staff Management',
            description: 'Manage team and assignments',
            icon: Users,
            href: '/accountant/staff',
            color: 'text-accent'
          },
          {
            id: 'practice-analytics',
            title: 'Practice Analytics',
            description: 'Business performance insights',
            icon: TrendingUp,
            href: '/accountant/analytics',
            status: 'premium',
            color: 'text-gold'
          }
        ]
      }
    ],
    attorney: [
      {
        id: 'estate-planning',
        title: 'Estate Planning',
        modules: [
          {
            id: 'estate-documents',
            title: 'Estate Documents',
            description: 'Create and manage estate plans',
            icon: Shield,
            href: '/attorney/estate-planning',
            color: 'text-primary'
          },
          {
            id: 'trust-administration',
            title: 'Trust Administration',
            description: 'Manage trust accounts and distributions',
            icon: Lock,
            href: '/attorney/trusts',
            color: 'text-emerald'
          },
          {
            id: 'probate',
            title: 'Probate Services',
            description: 'Handle probate proceedings',
            icon: FileText,
            href: '/attorney/probate',
            color: 'text-accent'
          },
          {
            id: 'tax-optimization',
            title: 'Estate Tax Planning',
            description: 'Minimize estate tax exposure',
            icon: Calculator,
            href: '/attorney/tax-planning',
            status: 'premium',
            color: 'text-gold'
          }
        ]
      },
      {
        id: 'legal-services',
        title: 'Legal Services',
        modules: [
          {
            id: 'contract-management',
            title: 'Contract Management',
            description: 'Draft and review contracts',
            icon: FileText,
            href: '/attorney/contracts',
            color: 'text-primary'
          },
          {
            id: 'compliance',
            title: 'Regulatory Compliance',
            description: 'Ensure regulatory compliance',
            icon: Shield,
            href: '/attorney/compliance',
            color: 'text-emerald'
          },
          {
            id: 'litigation-support',
            title: 'Litigation Support',
            description: 'Manage litigation matters',
            icon: Target,
            href: '/attorney/litigation',
            color: 'text-accent'
          },
          {
            id: 'legal-research',
            title: 'Legal Research',
            description: 'Access legal databases and precedents',
            icon: BookOpen,
            href: '/attorney/research',
            status: 'premium',
            color: 'text-gold'
          }
        ]
      },
      {
        id: 'practice-management',
        title: 'Practice Management',
        modules: [
          {
            id: 'client-management',
            title: 'Client Management',
            description: 'Manage client relationships',
            icon: Users,
            href: '/attorney/clients',
            color: 'text-primary'
          },
          {
            id: 'case-management',
            title: 'Case Management',
            description: 'Track cases and deadlines',
            icon: Calendar,
            href: '/attorney/cases',
            color: 'text-emerald'
          },
          {
            id: 'billing',
            title: 'Legal Billing',
            description: 'Track time and bill clients',
            icon: CreditCard,
            href: '/attorney/billing',
            color: 'text-accent'
          },
          {
            id: 'document-management',
            title: 'Document Management',
            description: 'Organize and store legal documents',
            icon: FileText,
            href: '/attorney/documents',
            color: 'text-gold'
          }
        ]
      }
    ]
  };

  return sections[persona] || sections.client;
};
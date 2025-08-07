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
        id: 'client-management',
        title: 'Client Management',
        modules: [
          {
            id: 'client-overview',
            title: 'Client Overview',
            description: 'Manage all your client relationships',
            icon: Users,
            href: '/advisor/clients',
            color: 'text-primary'
          },
          {
            id: 'prospect-pipeline',
            title: 'Prospect Pipeline',
            description: 'Track and nurture prospects',
            icon: Target,
            href: '/advisor/prospects',
            color: 'text-emerald'
          },
          {
            id: 'client-onboarding',
            title: 'Client Onboarding',
            description: 'Streamlined new client setup',
            icon: UserPlus,
            href: '/advisor/onboarding',
            color: 'text-accent'
          },
          {
            id: 'referral-tracking',
            title: 'Referral Network',
            description: 'Track referrals and partner relationships',
            icon: Share,
            href: '/advisor/referrals',
            color: 'text-gold'
          }
        ]
      },
      {
        id: 'portfolio-management',
        title: 'Portfolio Management',
        modules: [
          {
            id: 'aum-tracking',
            title: 'AUM Tracking',
            description: 'Monitor assets under management',
            icon: TrendingUp,
            href: '/advisor/aum',
            color: 'text-primary'
          },
          {
            id: 'performance-reporting',
            title: 'Performance Reports',
            description: 'Generate client performance reports',
            icon: PieChart,
            href: '/advisor/performance',
            color: 'text-emerald'
          },
          {
            id: 'risk-analysis',
            title: 'Risk Analysis',
            description: 'Portfolio risk assessment tools',
            icon: Shield,
            href: '/advisor/risk',
            color: 'text-accent'
          },
          {
            id: 'rebalancing',
            title: 'Rebalancing',
            description: 'Portfolio rebalancing recommendations',
            icon: Calculator,
            href: '/advisor/rebalancing',
            status: 'premium',
            color: 'text-gold'
          }
        ]
      },
      {
        id: 'business-tools',
        title: 'Practice Management',
        modules: [
          {
            id: 'billing',
            title: 'Billing & Invoicing',
            description: 'Manage client billing and payments',
            icon: CreditCard,
            href: '/advisor/billing',
            color: 'text-primary'
          },
          {
            id: 'calendar',
            title: 'Calendar & Meetings',
            description: 'Schedule and manage appointments',
            icon: Calendar,
            href: '/advisor/calendar',
            color: 'text-emerald'
          },
          {
            id: 'compliance',
            title: 'Compliance Center',
            description: 'Regulatory compliance tools',
            icon: Shield,
            href: '/advisor/compliance',
            color: 'text-accent'
          },
          {
            id: 'marketing',
            title: 'Marketing Hub',
            description: 'Marketing and communication tools',
            icon: MessageSquare,
            href: '/advisor/marketing',
            status: 'premium',
            color: 'text-gold'
          }
        ]
      },
      {
        id: 'resources',
        title: 'Resources & Analytics',
        modules: [
          {
            id: 'marketplace',
            title: 'Professional Network',
            description: 'Connect with other professionals',
            icon: Crown,
            href: '/marketplace',
            color: 'text-gold'
          },
          {
            id: 'continuing-education',
            title: 'Continuing Education',
            description: 'CE credits and professional development',
            icon: BookOpen,
            href: '/advisor/education',
            color: 'text-emerald'
          },
          {
            id: 'business-analytics',
            title: 'Business Analytics',
            description: 'Practice performance insights',
            icon: TrendingUp,
            href: '/advisor/analytics',
            color: 'text-primary'
          },
          {
            id: 'document-library',
            title: 'Document Library',
            description: 'Shared resources and templates',
            icon: FileText,
            href: '/advisor/documents',
            color: 'text-accent'
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
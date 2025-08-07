import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Crown,
  Star,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Calculator,
  Scale,
  Heart,
  Home,
  BookOpen,
  Settings,
  Briefcase,
  Play,
  FileText,
  Phone,
  Mail,
  DollarSign,
  Calendar
} from 'lucide-react';

interface FeatureItem {
  name: string;
  description: string;
  tier: 'basic' | 'premium';
  icon?: React.ComponentType<any>;
}

interface PersonaPreviewData {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  heroDescription: string;
  features: FeatureItem[];
  dashboardPreview: {
    title: string;
    description: string;
    modules: string[];
  };
  pricing?: {
    basic: string;
    premium: string;
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  nextSteps: string[];
}

const personaPreviewData: Record<string, PersonaPreviewData> = {
  family: {
    id: 'family',
    title: 'Client / Family Experience',
    subtitle: 'Your Private Family Office',
    icon: Crown,
    heroDescription: 'Experience the ultimate in family wealth management with our comprehensive platform designed for high-net-worth families. From secure document storage to AI-powered insights, everything you need is at your fingertips.',
    features: [
      { name: 'Personal Dashboard', description: 'Overview of wealth, health, and family coordination', tier: 'basic', icon: TrendingUp },
      { name: 'Document Storage', description: 'Basic secure storage for important documents', tier: 'basic', icon: FileText },
      { name: 'Goal Tracking', description: 'Set and monitor basic financial goals', tier: 'basic', icon: CheckCircle },
      { name: 'Professional Directory', description: 'Access to vetted advisors and service providers', tier: 'basic', icon: Users },
      { name: 'Retirement Roadmap™', description: 'Interactive scenario builder with Monte Carlo simulations', tier: 'premium', icon: TrendingUp },
      { name: 'Secure Family Vault™', description: 'Unlimited encrypted storage + Legacy Avatar features', tier: 'premium', icon: Shield },
      { name: 'Advanced Properties', description: 'Unlimited asset tracking with analytics and sharing', tier: 'premium', icon: Home },
      { name: 'Bill Pay Premium', description: 'Automated payment scheduling with banking integration', tier: 'premium', icon: DollarSign },
      { name: 'Advanced Tax Planning', description: 'Multi-year Roth analyzer and tax optimization tools', tier: 'premium', icon: Calculator },
      { name: 'AI Family Concierge', description: 'Premium smart assistant with proactive insights', tier: 'premium', icon: Zap }
    ],
    dashboardPreview: {
      title: 'Your Family Command Center',
      description: 'A unified view of your wealth, health, and family coordination tools.',
      modules: ['Wealth Overview', 'Health Dashboard', 'Family Vault', 'Goal Tracker', 'Professional Network', 'Education Center']
    },
    pricing: {
      basic: 'Free Forever',
      premium: '$97/month per family'
    },
    faqs: [
      {
        question: 'Is my financial information secure?',
        answer: 'Yes, we use bank-level encryption and store all data with enterprise-grade security. We never sell your data or share it without your explicit permission.'
      },
      {
        question: 'How is this different from other wealth management platforms?',
        answer: 'We combine wealth, health, and family coordination in one platform, with direct access to vetted professionals and premium tools typically only available to ultra-high-net-worth families.'
      },
      {
        question: 'Can I try Premium features before upgrading?',
        answer: 'Yes! You can explore all Premium features during your 14-day free trial. No credit card required to get started.'
      }
    ],
    nextSteps: ['Create your secure account', 'Complete family profile', 'Connect with a family advisor', 'Explore Premium features with free trial']
  },
  advisor: {
    id: 'advisor',
    title: 'Financial Advisor Practice Suite',
    subtitle: 'All-in-One Digital Practice Management',
    icon: TrendingUp,
    heroDescription: 'Transform your advisory practice with comprehensive tools for client management, compliance, marketing, and growth. Everything you need to run a world-class practice.',
    features: [
      { name: 'Client Portal', description: 'Basic client communication and document sharing', tier: 'basic', icon: Users },
      { name: 'Compliance Tracking', description: 'Essential regulatory compliance tools', tier: 'basic', icon: Shield },
      { name: 'Meeting Scheduler', description: 'Simple appointment booking system', tier: 'basic', icon: Calendar },
      { name: 'Document Library', description: 'Basic document storage and organization', tier: 'basic', icon: FileText },
      { name: 'Lead Engine™', description: 'Advanced prospect management with SWAG Lead Score™', tier: 'premium', icon: TrendingUp },
      { name: 'Campaign Automation', description: 'Automated marketing campaigns and follow-ups', tier: 'premium', icon: Zap },
      { name: 'Advanced Analytics', description: 'ROI tracking, client analytics, and business insights', tier: 'premium', icon: Calculator },
      { name: 'Compliance Plus', description: 'Advanced regulatory reporting and risk management', tier: 'premium', icon: Shield },
      { name: 'Client Collaboration', description: 'Premium family office tools for high-net-worth clients', tier: 'premium', icon: Crown },
      { name: 'Practice Growth Suite', description: 'Advanced prospecting, referral tracking, and business development', tier: 'premium', icon: Star }
    ],
    dashboardPreview: {
      title: 'Practice Management Dashboard',
      description: 'Everything you need to run and grow your advisory practice efficiently.',
      modules: ['Client Pipeline', 'Revenue Analytics', 'Compliance Center', 'Marketing Hub', 'Client Portal', 'Growth Metrics']
    },
    pricing: {
      basic: '$49/month',
      premium: '$197/month per advisor'
    },
    faqs: [
      {
        question: 'How does this integrate with my existing CRM?',
        answer: 'Our platform can integrate with most major CRMs, or serve as your primary client management system with advanced features specifically designed for financial advisors.'
      },
      {
        question: 'What compliance support is included?',
        answer: 'We provide built-in compliance tracking, regulatory reporting tools, and regular updates to keep pace with changing regulations. Premium plans include advanced compliance automation.'
      },
      {
        question: 'Can I customize the client portal?',
        answer: 'Yes, the client portal is fully customizable with your branding, and Premium plans include white-label options for a seamless client experience.'
      }
    ],
    nextSteps: ['Start your 14-day free trial', 'Import your client data', 'Customize your practice branding', 'Launch your first campaign']
  },
  accountant: {
    id: 'accountant',
    title: 'CPA Practice Platform',
    subtitle: 'Advanced Accounting Practice Management',
    icon: Calculator,
    heroDescription: 'Streamline your accounting practice with AI-powered tax scanning, client organization tools, and automated compliance tracking. Built specifically for CPAs and accounting professionals.',
    features: [
      { name: 'Client Organization', description: 'Basic client file management and communication', tier: 'basic', icon: Users },
      { name: 'Document Storage', description: 'Secure storage for tax documents and records', tier: 'basic', icon: FileText },
      { name: 'CE Tracking', description: 'Continue education credit tracking and reminders', tier: 'basic', icon: BookOpen },
      { name: 'Basic Compliance', description: 'Essential compliance checklists and deadlines', tier: 'basic', icon: CheckCircle },
      { name: 'AI Tax Scanning', description: 'Automated document scanning and data extraction', tier: 'premium', icon: Zap },
      { name: 'Advanced Workflow', description: 'Automated client workflows and task management', tier: 'premium', icon: TrendingUp },
      { name: 'Client Collaboration Hub', description: 'Premium portal for high-value clients', tier: 'premium', icon: Crown },
      { name: 'Practice Analytics', description: 'Revenue tracking, client profitability, and growth metrics', tier: 'premium', icon: Calculator },
      { name: 'Marketing Engine', description: 'Automated marketing campaigns for CPAs', tier: 'premium', icon: Star },
      { name: 'Compliance Automation', description: 'Advanced regulatory reporting and risk alerts', tier: 'premium', icon: Shield }
    ],
    dashboardPreview: {
      title: 'Practice Management Center',
      description: 'Comprehensive tools to manage your accounting practice efficiently.',
      modules: ['Client Dashboard', 'Tax Processing Center', 'Compliance Tracker', 'Revenue Analytics', 'Document Management', 'CE Credits']
    },
    pricing: {
      basic: '$39/month',
      premium: '$147/month per CPA'
    },
    faqs: [
      {
        question: 'Does this work with my existing tax software?',
        answer: 'Yes, our platform integrates with most major tax preparation software and can serve as a comprehensive practice management layer on top of your existing tools.'
      },
      {
        question: 'How secure is client tax information?',
        answer: 'We use military-grade encryption and comply with all IRS security requirements for tax professionals. Your client data is protected with the highest security standards.'
      },
      {
        question: 'Can I track continuing education automatically?',
        answer: 'Yes, our CE tracking system automatically monitors your continuing education credits, sends reminders for upcoming requirements, and integrates with major CE providers.'
      }
    ],
    nextSteps: ['Start your free trial', 'Import your client database', 'Set up automated workflows', 'Configure compliance tracking']
  },
  attorney: {
    id: 'attorney',
    title: 'Legal Practice Suite',
    subtitle: 'Estate Planning & Legal Practice Tools',
    icon: Scale,
    heroDescription: 'Comprehensive legal practice management with specialized tools for estate planning, document automation, and client collaboration. Designed for attorneys serving high-net-worth families.',
    features: [
      { name: 'Document Management', description: 'Basic legal document storage and organization', tier: 'basic', icon: FileText },
      { name: 'Client Communication', description: 'Secure messaging and appointment scheduling', tier: 'basic', icon: Mail },
      { name: 'CLE Tracking', description: 'Continue legal education credit monitoring', tier: 'basic', icon: BookOpen },
      { name: 'Basic Calendaring', description: 'Court dates and deadline tracking', tier: 'basic', icon: Calendar },
      { name: 'Estate Planning Suite', description: 'Advanced estate planning document automation', tier: 'premium', icon: Crown },
      { name: 'Client Family Portal', description: 'Premium family office collaboration tools', tier: 'premium', icon: Users },
      { name: 'Document Automation', description: 'AI-powered legal document generation', tier: 'premium', icon: Zap },
      { name: 'Practice Analytics', description: 'Revenue tracking and client profitability analysis', tier: 'premium', icon: Calculator },
      { name: 'Compliance Calendar', description: 'Advanced regulatory and deadline management', tier: 'premium', icon: Shield },
      { name: 'Professional Network', description: 'Connect with other professionals serving your clients', tier: 'premium', icon: Star }
    ],
    dashboardPreview: {
      title: 'Legal Practice Command Center',
      description: 'Everything you need to manage your legal practice and serve clients effectively.',
      modules: ['Client Portal', 'Document Center', 'Estate Planning Tools', 'Compliance Calendar', 'Revenue Dashboard', 'Professional Network']
    },
    pricing: {
      basic: '$59/month',
      premium: '$247/month per attorney'
    },
    faqs: [
      {
        question: 'How does this help with estate planning specifically?',
        answer: 'Our platform includes specialized estate planning tools, document automation, family tree mapping, and collaborative features that allow families to coordinate their estate planning effectively.'
      },
      {
        question: 'Can I share documents securely with clients?',
        answer: 'Yes, our platform provides bank-level security for document sharing, with granular permission controls and audit trails for all document access and modifications.'
      },
      {
        question: 'Does this track CLE credits automatically?',
        answer: 'Yes, our CLE tracking system monitors your continuing education requirements, integrates with major providers, and sends automatic reminders for upcoming deadlines.'
      }
    ],
    nextSteps: ['Begin your free trial', 'Set up your practice profile', 'Import existing client files', 'Configure estate planning workflows']
  },
  insurance: {
    id: 'insurance',
    title: 'Insurance Agent Hub',
    subtitle: 'Compliant Sales & Service Platform',
    icon: Shield,
    heroDescription: 'Sell and serve with confidence using our compliant platform designed for insurance agents. Features include call recording for Medicare compliance, client onboarding, and sales analytics.',
    features: [
      { name: 'Client Database', description: 'Basic contact management and policy tracking', tier: 'basic', icon: Users },
      { name: 'Quote System', description: 'Simple quoting tools for basic products', tier: 'basic', icon: Calculator },
      { name: 'Appointment Scheduling', description: 'Basic calendar and meeting management', tier: 'basic', icon: Calendar },
      { name: 'Document Storage', description: 'Secure storage for policy documents', tier: 'basic', icon: FileText },
      { name: 'Compliance Recording', description: 'Automated call recording for Medicare compliance', tier: 'premium', icon: Shield },
      { name: 'Multi-Product Quoting', description: 'Advanced quoting system for all insurance products', tier: 'premium', icon: Calculator },
      { name: 'Agency Tools', description: 'Team management and hierarchy features', tier: 'premium', icon: Users },
      { name: 'Sales Analytics', description: 'Commission tracking and performance analytics', tier: 'premium', icon: TrendingUp },
      { name: 'Marketing Automation', description: 'Automated follow-up campaigns and lead nurturing', tier: 'premium', icon: Zap },
      { name: 'Referral Network', description: 'Connect with other professionals for referrals', tier: 'premium', icon: Star }
    ],
    dashboardPreview: {
      title: 'Agent Performance Dashboard',
      description: 'Track sales, manage clients, and stay compliant with our comprehensive platform.',
      modules: ['Sales Pipeline', 'Client Portal', 'Compliance Center', 'Commission Tracker', 'Quote Engine', 'Marketing Hub']
    },
    pricing: {
      basic: '$29/month',
      premium: '$97/month per agent'
    },
    faqs: [
      {
        question: 'How does the Medicare compliance recording work?',
        answer: 'Our platform automatically records all client calls with proper disclosure, stores them securely for required retention periods, and provides easy access for compliance audits.'
      },
      {
        question: 'Can I manage my entire agency on this platform?',
        answer: 'Yes, Premium plans include agency management features, team hierarchies, commission splitting, and consolidated reporting for agency owners and managers.'
      },
      {
        question: 'What insurance products are supported?',
        answer: 'Our platform supports all major insurance products including life, health, disability, long-term care, annuities, and Medicare supplements with specialized tools for each.'
      }
    ],
    nextSteps: ['Start your free trial', 'Set up compliance preferences', 'Import your client database', 'Configure product quoting systems']
  },
  healthcare: {
    id: 'healthcare',
    title: 'Healthcare Consultant Platform',
    subtitle: 'Patient Care & Practice Management',
    icon: Heart,
    heroDescription: 'Power your healthcare practice or consultancy with patient health vaults, outcome tracking, and community-building tools. Special features for anchor clinics and leading healthcare providers.',
    features: [
      { name: 'Patient Portal', description: 'Basic patient communication and appointment scheduling', tier: 'basic', icon: Users },
      { name: 'Health Records', description: 'Secure storage for patient health information', tier: 'basic', icon: FileText },
      { name: 'Appointment Management', description: 'Calendar and scheduling system', tier: 'basic', icon: Calendar },
      { name: 'Basic Analytics', description: 'Patient outcome tracking and reporting', tier: 'basic', icon: TrendingUp },
      { name: 'Health Vault Premium', description: 'Advanced patient health data management', tier: 'premium', icon: Shield },
      { name: 'Longevity Analytics', description: 'Advanced health optimization and longevity tracking', tier: 'premium', icon: Heart },
      { name: 'Community Platform', description: 'Patient education and community building tools', tier: 'premium', icon: Users },
      { name: 'Anchor Clinic Features', description: 'White-label platform for leading healthcare providers', tier: 'premium', icon: Crown },
      { name: 'Outcome Analytics', description: 'Advanced patient outcome analysis and insights', tier: 'premium', icon: Calculator },
      { name: 'Professional Network', description: 'Connect with other healthcare providers and specialists', tier: 'premium', icon: Star }
    ],
    dashboardPreview: {
      title: 'Healthcare Practice Dashboard',
      description: 'Comprehensive patient care and practice management in one platform.',
      modules: ['Patient Dashboard', 'Health Analytics', 'Appointment Center', 'Outcome Tracking', 'Community Hub', 'Professional Network']
    },
    pricing: {
      basic: '$79/month',
      premium: '$297/month per provider'
    },
    faqs: [
      {
        question: 'Is this HIPAA compliant?',
        answer: 'Yes, our platform is fully HIPAA compliant with comprehensive security measures, audit trails, and data protection protocols specifically designed for healthcare providers.'
      },
      {
        question: 'What makes this different from other healthcare platforms?',
        answer: 'We focus on longevity and optimization, not just disease management. Our platform connects healthcare with wealth planning for comprehensive family care.'
      },
      {
        question: 'Can I customize this for my clinic brand?',
        answer: 'Yes, Premium plans include white-label options and custom branding. Anchor clinic partnerships get fully customized platforms.'
      }
    ],
    nextSteps: ['Begin your free trial', 'Set up HIPAA compliance', 'Import patient data', 'Configure health tracking protocols']
  },
  influencer: {
    id: 'influencer',
    title: 'Thought Leader Platform',
    subtitle: 'Expert Profile & Community Building',
    icon: Star,
    heroDescription: 'Claim your reserved expert profile and build your wellness community. Exclusive platform features for thought leaders, researchers, and influencers in the longevity and wellness space.',
    features: [
      { name: 'Expert Profile', description: 'Professional profile with credentials and expertise', tier: 'basic', icon: Star },
      { name: 'Content Sharing', description: 'Share research, articles, and insights', tier: 'basic', icon: FileText },
      { name: 'Community Access', description: 'Connect with other experts and professionals', tier: 'basic', icon: Users },
      { name: 'Basic Analytics', description: 'Track profile views and engagement', tier: 'basic', icon: TrendingUp },
      { name: 'VIP Profile Features', description: 'Enhanced profile with media kit and speaking bureau', tier: 'premium', icon: Crown },
      { name: 'Research Platform', description: 'Share and collaborate on research projects', tier: 'premium', icon: BookOpen },
      { name: 'Community Building', description: 'Create and manage your own expert communities', tier: 'premium', icon: Users },
      { name: 'Monetization Tools', description: 'Course creation, consultation booking, and revenue tracking', tier: 'premium', icon: DollarSign },
      { name: 'Family Office Access', description: 'Direct connection to high-net-worth families', tier: 'premium', icon: Shield },
      { name: 'Media & PR Suite', description: 'Press kit, media contacts, and publicity tools', tier: 'premium', icon: Zap }
    ],
    dashboardPreview: {
      title: 'Thought Leader Command Center',
      description: 'Manage your expert profile, community, and professional opportunities.',
      modules: ['Expert Dashboard', 'Community Hub', 'Research Center', 'Revenue Analytics', 'Media Kit', 'Family Office Connect']
    },
    pricing: {
      basic: 'By invitation only',
      premium: '$497/month per expert'
    },
    faqs: [
      {
        question: 'How do I qualify for a reserved profile?',
        answer: 'Reserved profiles are for recognized experts in longevity, wellness, and related fields. Application requires verification of credentials and professional standing.'
      },
      {
        question: 'Can I monetize my expertise on this platform?',
        answer: 'Yes, Premium features include course creation, consultation booking, speaking opportunities, and direct access to high-net-worth families seeking expert guidance.'
      },
      {
        question: 'How does this connect me with families?',
        answer: 'Our platform connects thought leaders directly with family offices and high-net-worth individuals seeking expert guidance in health, longevity, and wellness optimization.'
      }
    ],
    nextSteps: ['Apply for expert verification', 'Complete profile setup', 'Upload credentials and media kit', 'Connect with family office network']
  },
  realtor: {
    id: 'realtor',
    title: 'Property Manager Platform',
    subtitle: 'Real Estate & Property Management',
    icon: Home,
    heroDescription: 'Comprehensive property management and real estate platform. Manage listings, track compliance, communicate with clients, and offer premium experiences to high-net-worth property owners.',
    features: [
      { name: 'Property Listings', description: 'Basic property listing and management tools', tier: 'basic', icon: Home },
      { name: 'Client Communication', description: 'Secure messaging and document sharing', tier: 'basic', icon: Mail },
      { name: 'Transaction Tracking', description: 'Basic deal pipeline and commission tracking', tier: 'basic', icon: Calculator },
      { name: 'Document Storage', description: 'Secure storage for contracts and property documents', tier: 'basic', icon: FileText },
      { name: 'Premium Property Portal', description: 'Luxury property showcase with virtual tours', tier: 'premium', icon: Crown },
      { name: 'Client Wealth Integration', description: 'Connect property investments with wealth management', tier: 'premium', icon: TrendingUp },
      { name: 'Compliance Automation', description: 'Automated regulatory compliance and reporting', tier: 'premium', icon: Shield },
      { name: 'Marketing Automation', description: 'Automated marketing campaigns and lead generation', tier: 'premium', icon: Zap },
      { name: 'Investment Analytics', description: 'Property investment analysis and ROI tracking', tier: 'premium', icon: Calculator },
      { name: 'Professional Network', description: 'Connect with wealth advisors and other professionals', tier: 'premium', icon: Star }
    ],
    dashboardPreview: {
      title: 'Property Management Dashboard',
      description: 'Everything you need to manage properties and serve high-end clients.',
      modules: ['Property Portfolio', 'Client Portal', 'Transaction Pipeline', 'Marketing Hub', 'Compliance Center', 'Analytics Dashboard']
    },
    pricing: {
      basic: '$49/month',
      premium: '$197/month per agent'
    },
    faqs: [
      {
        question: 'How does this integrate with MLS systems?',
        answer: 'Our platform integrates with major MLS systems and provides additional features for luxury properties and high-net-worth client management.'
      },
      {
        question: 'Can I offer this platform to my high-end clients?',
        answer: 'Yes, Premium plans include client access to property management tools, investment tracking, and integration with their overall wealth management strategy.'
      },
      {
        question: 'What compliance features are included?',
        answer: 'We provide automated compliance tracking for real estate regulations, transaction documentation, and integration with industry-standard compliance requirements.'
      }
    ],
    nextSteps: ['Start your free trial', 'Import your property listings', 'Set up client portals', 'Configure compliance tracking']
  },
  business: {
    id: 'business',
    title: 'Business Owner Executive Suite',
    subtitle: 'Executive Dashboard & Business Management',
    icon: Briefcase,
    heroDescription: 'Comprehensive executive dashboard for business owners. Manage company finances, employee benefits, succession planning, and executive perks in one integrated platform.',
    features: [
      { name: 'Executive Dashboard', description: 'Overview of business and personal finances', tier: 'basic', icon: TrendingUp },
      { name: 'Basic Financial Tracking', description: 'Simple business and personal finance overview', tier: 'basic', icon: Calculator },
      { name: 'Employee Directory', description: 'Basic employee information and contact management', tier: 'basic', icon: Users },
      { name: 'Document Storage', description: 'Secure storage for business documents', tier: 'basic', icon: FileText },
      { name: 'Advanced Business Analytics', description: 'Comprehensive business performance and financial analysis', tier: 'premium', icon: Calculator },
      { name: 'Succession Planning Suite', description: 'Business succession and estate planning integration', tier: 'premium', icon: Crown },
      { name: 'Executive Benefits Management', description: 'Manage executive compensation and benefit packages', tier: 'premium', icon: Star },
      { name: 'Employee Benefits Platform', description: 'Comprehensive employee benefit administration', tier: 'premium', icon: Users },
      { name: 'Tax Optimization Suite', description: 'Business and personal tax planning integration', tier: 'premium', icon: Shield },
      { name: 'Professional Advisory Network', description: 'Direct access to executive-level advisors', tier: 'premium', icon: Crown }
    ],
    dashboardPreview: {
      title: 'Executive Command Center',
      description: 'Comprehensive business and personal financial management for executives.',
      modules: ['Business Dashboard', 'Personal Wealth', 'Employee Benefits', 'Succession Planning', 'Tax Center', 'Advisory Network']
    },
    pricing: {
      basic: '$149/month',
      premium: '$497/month per executive'
    },
    faqs: [
      {
        question: 'How does this integrate business and personal finances?',
        answer: 'Our platform provides a unified view of your business performance and personal wealth, with tools for tax optimization, succession planning, and integrated financial strategy.'
      },
      {
        question: 'Can I manage employee benefits through this platform?',
        answer: 'Yes, Premium plans include comprehensive employee benefit administration, from basic health insurance to executive compensation packages and equity management.'
      },
      {
        question: 'What succession planning tools are included?',
        answer: 'We provide comprehensive succession planning tools including business valuation, transition planning, estate integration, and professional advisory support.'
      }
    ],
    nextSteps: ['Schedule executive consultation', 'Set up business integration', 'Configure benefit administration', 'Access succession planning tools']
  },
  admin: {
    id: 'admin',
    title: 'Admin & Compliance Dashboard',
    subtitle: 'System Oversight & Management',
    icon: Settings,
    heroDescription: 'Comprehensive administrative dashboard for system oversight, compliance workflows, user management, and analytics. Built for compliance officers and system administrators.',
    features: [
      { name: 'User Management', description: 'Basic user account creation and management', tier: 'basic', icon: Users },
      { name: 'System Monitoring', description: 'Basic system health and usage monitoring', tier: 'basic', icon: TrendingUp },
      { name: 'Compliance Checklists', description: 'Standard compliance tracking and reporting', tier: 'basic', icon: CheckCircle },
      { name: 'Basic Reporting', description: 'Standard usage and activity reports', tier: 'basic', icon: FileText },
      { name: 'Advanced User Analytics', description: 'Comprehensive user behavior and engagement analytics', tier: 'premium', icon: Calculator },
      { name: 'Automated Compliance', description: 'Advanced regulatory compliance automation and alerts', tier: 'premium', icon: Shield },
      { name: 'System Administration', description: 'Advanced system configuration and management tools', tier: 'premium', icon: Settings },
      { name: 'Custom Reporting Suite', description: 'Advanced reporting and dashboard customization', tier: 'premium', icon: TrendingUp },
      { name: 'Audit Trail Management', description: 'Comprehensive audit trails and compliance documentation', tier: 'premium', icon: FileText },
      { name: 'Enterprise Integration', description: 'Advanced API access and system integrations', tier: 'premium', icon: Zap }
    ],
    dashboardPreview: {
      title: 'Administrative Command Center',
      description: 'Complete system oversight and compliance management dashboard.',
      modules: ['User Dashboard', 'Compliance Center', 'System Monitor', 'Reporting Suite', 'Audit Management', 'Configuration Panel']
    },
    pricing: {
      basic: '$99/month',
      premium: '$297/month per admin'
    },
    faqs: [
      {
        question: 'What compliance frameworks are supported?',
        answer: 'Our platform supports major compliance frameworks including SOC 2, HIPAA, SEC regulations, and custom compliance requirements with automated monitoring and reporting.'
      },
      {
        question: 'Can I customize user permissions and access?',
        answer: 'Yes, our admin dashboard provides granular permission controls, role-based access management, and custom user group configuration for enterprise environments.'
      },
      {
        question: 'What reporting capabilities are available?',
        answer: 'Premium plans include advanced reporting with custom dashboards, automated report generation, compliance documentation, and export capabilities for audit purposes.'
      }
    ],
    nextSteps: ['Set up admin credentials', 'Configure compliance parameters', 'Import user databases', 'Customize reporting dashboards']
  }
};

export const PersonaPreviewPage: React.FC = () => {
  const { personaId } = useParams<{ personaId: string }>();
  const navigate = useNavigate();
  const [personaData, setPersonaData] = useState<PersonaPreviewData | null>(null);

  useEffect(() => {
    if (personaId && personaPreviewData[personaId]) {
      setPersonaData(personaPreviewData[personaId]);
    } else {
      navigate('/');
    }
  }, [personaId, navigate]);

  if (!personaData) {
    return <div>Loading...</div>;
  }

  const IconComponent = personaData.icon;
  const basicFeatures = personaData.features.filter(f => f.tier === 'basic');
  const premiumFeatures = personaData.features.filter(f => f.tier === 'premium');

  const handleGetStarted = () => {
    // Store persona context and navigate to onboarding
    localStorage.setItem('selectedPersona', personaData.id);
    localStorage.setItem('personaData', JSON.stringify(personaData));
    navigate(`/auth?persona=${personaData.id}&type=signup`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-background to-navy/80">
      {/* Header */}
      <header className="w-full border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-foreground hover:text-gold transition-colors touch-target"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Experiences
          </Button>
          <div className="text-xl font-serif font-bold text-gold">
            Boutique Family Office™
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/auth?type=login')}
            className="border-gold text-gold hover:bg-gold hover:text-navy transition-all touch-target"
          >
            Login
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-2xl bg-gold/10 border border-gold/20">
              <IconComponent className="h-16 w-16 text-gold" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            {personaData.title}
          </h1>
          <p className="text-xl md:text-2xl text-gold mb-6 font-medium">
            {personaData.subtitle}
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            {personaData.heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-gold text-navy hover:bg-gold/90 font-semibold text-lg px-8 py-4 touch-target"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-emerald text-emerald hover:bg-emerald hover:text-navy font-semibold text-lg px-8 py-4 touch-target"
            >
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </section>

        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="features" className="touch-target">Features</TabsTrigger>
            <TabsTrigger value="dashboard" className="touch-target">Dashboard</TabsTrigger>
            <TabsTrigger value="pricing" className="touch-target">Pricing</TabsTrigger>
            <TabsTrigger value="faqs" className="touch-target">FAQs</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="space-y-8">
            {/* Feature Comparison */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-center text-foreground mb-8">
                What You Get
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Basic Features */}
                <Card className="bg-background/50 border-border/50">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-foreground flex items-center justify-center gap-2">
                      <CheckCircle className="h-6 w-6 text-emerald" />
                      Basic (Free)
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {personaData.pricing?.basic || 'Free Forever'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {basicFeatures.map((feature, index) => {
                      const FeatureIcon = feature.icon || CheckCircle;
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-emerald/10 mt-1">
                            <FeatureIcon className="h-4 w-4 text-emerald" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{feature.name}</h4>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Premium Features */}
                <Card className="bg-gradient-to-br from-gold/10 to-navy/5 border-gold/30 relative">
                  <Badge className="absolute top-4 right-4 bg-gold text-navy font-semibold">
                    Most Popular
                  </Badge>
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-foreground flex items-center justify-center gap-2">
                      <Crown className="h-6 w-6 text-gold" />
                      Premium
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {personaData.pricing?.premium || 'Contact for Pricing'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {premiumFeatures.map((feature, index) => {
                      const FeatureIcon = feature.icon || Star;
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-gold/10 mt-1">
                            <FeatureIcon className="h-4 w-4 text-gold" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{feature.name}</h4>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-8">
            <section id="demo">
              <h2 className="text-3xl font-serif font-bold text-center text-foreground mb-8">
                {personaData.dashboardPreview.title}
              </h2>
              
              <Card className="max-w-4xl mx-auto bg-background/50 border-border/50">
                <CardHeader className="text-center">
                  <CardDescription className="text-lg">
                    {personaData.dashboardPreview.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {personaData.dashboardPreview.modules.map((module, index) => (
                      <div 
                        key={index}
                        className="p-4 rounded-lg bg-foreground/5 border border-border/30 text-center"
                      >
                        <h4 className="font-semibold text-foreground">{module}</h4>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <Button 
                      size="lg"
                      onClick={handleGetStarted}
                      className="bg-gold text-navy hover:bg-gold/90 font-semibold touch-target"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Free Trial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-8">
            <section>
              <h2 className="text-3xl font-serif font-bold text-center text-foreground mb-8">
                Simple, Transparent Pricing
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Card className="bg-background/50 border-border/50">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-foreground">Basic</CardTitle>
                    <div className="text-3xl font-bold text-emerald">
                      {personaData.pricing?.basic || 'Free'}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {basicFeatures.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald" />
                          <span className="text-foreground">{feature.name}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full mt-6 touch-target" 
                      variant="outline"
                      onClick={handleGetStarted}
                    >
                      Get Started Free
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gold/10 to-navy/5 border-gold/30">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-foreground">Premium</CardTitle>
                    <div className="text-3xl font-bold text-gold">
                      {personaData.pricing?.premium || 'Contact Us'}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-gold" />
                        <span className="text-foreground">Everything in Basic</span>
                      </li>
                      {premiumFeatures.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-gold" />
                          <span className="text-foreground">{feature.name}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full mt-6 bg-gold text-navy hover:bg-gold/90 touch-target"
                      onClick={handleGetStarted}
                    >
                      Start Premium Trial
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="faqs" className="space-y-8">
            <section>
              <h2 className="text-3xl font-serif font-bold text-center text-foreground mb-8">
                Frequently Asked Questions
              </h2>
              
              <div className="max-w-3xl mx-auto space-y-6">
                {personaData.faqs.map((faq, index) => (
                  <Card key={index} className="bg-background/50 border-border/50">
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>

        {/* Next Steps */}
        <section className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-gold/10 to-emerald/10 border-gold/20">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground mb-4">
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-lg">
                Your next steps to unlock the full potential of your {personaData.title.toLowerCase()} experience:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {personaData.nextSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold text-navy font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <span className="text-foreground">{step}</span>
                </div>
              ))}
              
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="w-full mt-8 bg-gold text-navy hover:bg-gold/90 font-semibold text-lg py-4 touch-target"
              >
                Start Your Journey Today
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};
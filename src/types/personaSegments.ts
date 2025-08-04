// Segment-specific persona types for enhanced analytics
import { PersonaType } from './personas';
export type PersonaSegment = 
  // Attorney segments
  | 'divorce_family_law'
  | 'estate_planning' 
  | 'business_law'
  // Accountant segments
  | 'cpa'
  | 'enrolled_agent'
  // Advisor segments
  | 'ria'
  | 'wealth_advisor'
  | 'insurance_medicare'
  | 'medicare_ltc'
  // Healthcare segments
  | 'medicare_health'
  | 'healthcare_consultant'
  // General segments
  | 'general';

export interface PersonaSegmentConfig {
  segment: PersonaSegment;
  persona: PersonaType;
  title: string;
  subtitle: string;
  welcomeMessage: string;
  benefits: string[];
  analyticsEvents: {
    onboarding_started: Record<string, any>;
    onboarding_completed: Record<string, any>;
    faq_opened: Record<string, any>;
    viral_share_clicked: Record<string, any>;
  };
}

export const PERSONA_SEGMENT_CONFIGS: Record<PersonaSegment, PersonaSegmentConfig> = {
  // Attorney Segments
  divorce_family_law: {
    segment: 'divorce_family_law',
    persona: 'attorney',
    title: 'Welcome to your Divorce & Family Law Dashboard',
    subtitle: 'Instantly connect with families seeking clarity, secure collaboration, and comprehensive documentation for life\'s most important transitions.',
    welcomeMessage: 'Your specialized practice for family transitions—secure, compliant, and family-focused.',
    benefits: [
      'Secure family document management',
      'Confidential client communication',
      'Specialized divorce workflows',
      'Multi-party collaboration tools'
    ],
    analyticsEvents: {
      onboarding_started: { persona: 'attorney', segment: 'divorce_family_law' },
      onboarding_completed: { persona: 'attorney', segment: 'divorce_family_law', referrer: 'document.referrer' },
      faq_opened: { persona: 'attorney', segment: 'divorce_family_law', page: 'window.location.pathname' },
      viral_share_clicked: { persona: 'attorney', segment: 'divorce_family_law', channel: 'linkedin' }
    }
  },
  estate_planning: {
    segment: 'estate_planning',
    persona: 'attorney',
    title: 'Your Estate Planning Practice, Modernized',
    subtitle: 'Secure document vaults, legacy messaging, and integrated client onboarding—built to support multi-generational families.',
    welcomeMessage: 'Build lasting legacies with modern estate planning tools.',
    benefits: [
      'Multi-generational document vaults',
      'Legacy planning workflows',
      'Trust administration tools',
      'Beneficiary communication portals'
    ],
    analyticsEvents: {
      onboarding_started: { persona: 'attorney', segment: 'estate_planning' },
      onboarding_completed: { persona: 'attorney', segment: 'estate_planning', referrer: 'document.referrer' },
      faq_opened: { persona: 'attorney', segment: 'estate_planning', page: 'window.location.pathname' },
      viral_share_clicked: { persona: 'attorney', segment: 'estate_planning', channel: 'linkedin' }
    }
  },
  business_law: {
    segment: 'business_law',
    persona: 'attorney',
    title: 'Business Law, Reimagined',
    subtitle: 'Streamline client intakes, automate compliance, and deliver value to business owners—securely and efficiently.',
    welcomeMessage: 'Transform how you serve business clients with integrated legal workflows.',
    benefits: [
      'Automated business compliance',
      'Contract management system',
      'Corporate document organization',
      'Multi-entity client portals'
    ],
    analyticsEvents: {
      onboarding_started: { persona: 'attorney', segment: 'business_law' },
      onboarding_completed: { persona: 'attorney', segment: 'business_law', referrer: 'document.referrer' },
      faq_opened: { persona: 'attorney', segment: 'business_law', page: 'window.location.pathname' },
      viral_share_clicked: { persona: 'attorney', segment: 'business_law', channel: 'linkedin' }
    }
  },
  // Accountant Segments
  cpa: {
    segment: 'cpa',
    persona: 'accountant',
    title: 'Your CPA Back Office, Elevated',
    subtitle: 'Smart tax workflows, client vaults, and automated reminders—saving you and your clients time (and taxes).',
    welcomeMessage: 'Modernize your CPA practice with intelligent automation and client engagement.',
    benefits: [
      'Automated tax workflow management',
      'Smart client document collection',
      'Real-time tax planning tools',
      'Integrated advisor partnerships'
    ],
    analyticsEvents: {
      onboarding_started: { persona: 'accountant', segment: 'cpa' },
      onboarding_completed: { persona: 'accountant', segment: 'cpa', referrer: 'document.referrer' },
      faq_opened: { persona: 'accountant', segment: 'cpa', page: 'window.location.pathname' },
      viral_share_clicked: { persona: 'accountant', segment: 'cpa', channel: 'linkedin' }
    }
  },
  enrolled_agent: {
    segment: 'enrolled_agent',
    persona: 'accountant',
    title: 'Enrolled Agent Essentials',
    subtitle: 'Effortless onboarding, automated filings, and real-time communication with families and business owners.',
    welcomeMessage: 'Specialized tax representation with streamlined client management.',
    benefits: [
      'IRS representation workflows',
      'Automated filing systems',
      'Client communication portals',
      'Tax resolution case management'
    ],
    analyticsEvents: {
      onboarding_started: { persona: 'accountant', segment: 'enrolled_agent' },
      onboarding_completed: { persona: 'accountant', segment: 'enrolled_agent', referrer: 'document.referrer' },
      faq_opened: { persona: 'accountant', segment: 'enrolled_agent', page: 'window.location.pathname' },
      viral_share_clicked: { persona: 'accountant', segment: 'enrolled_agent', channel: 'linkedin' }
    }
  },
  // Advisor Segments
  ria: {
    segment: 'ria',
    persona: 'advisor',
    title: 'RIA Dashboard—Modern Client Experience',
    subtitle: 'Modern Client Onboarding, Holistic Planning, and Premium Digital Experiences for families who expect more.',
    welcomeMessage: 'Deliver sophisticated wealth management with white-glove digital experiences.',
    benefits: [
      'Premium client onboarding experience',
      'Holistic financial planning tools',
      'Integrated custodian connections',
      'Advanced portfolio analytics'
    ],
    analyticsEvents: {
      onboarding_started: { persona: 'advisor', segment: 'ria' },
      onboarding_completed: { persona: 'advisor', segment: 'ria', referrer: 'document.referrer' },
      faq_opened: { persona: 'advisor', segment: 'ria', page: 'window.location.pathname' },
      viral_share_clicked: { persona: 'advisor', segment: 'ria', channel: 'linkedin' }
    }
  },
  wealth_advisor: {
    segment: 'wealth_advisor',
    persona: 'advisor',
    title: 'Wealth Advisory Excellence',
    subtitle: 'Comprehensive wealth management platform designed for high-net-worth families and their advisors.',
    welcomeMessage: 'Elevate your wealth advisory practice with institutional-grade tools.',
    benefits: [
      'High-net-worth client management',
      'Family office coordination',
      'Advanced wealth planning',
      'Multi-generational strategies'
    ],
    analyticsEvents: {
      onboarding_started: { persona: 'advisor', segment: 'wealth_advisor' },
      onboarding_completed: { persona: 'advisor', segment: 'wealth_advisor', referrer: 'document.referrer' },
      faq_opened: { persona: 'advisor', segment: 'wealth_advisor', page: 'window.location.pathname' },
      viral_share_clicked: { persona: 'advisor', segment: 'wealth_advisor', channel: 'linkedin' }
    }
  },
  medicare_ltc: {
    segment: 'medicare_ltc',
    persona: 'insurance_agent',
    title: 'Your Insurance Agency Hub',
    subtitle: 'Manage quotes, enrollments, and family education—all in one place.',
    welcomeMessage: 'Streamline insurance services with comprehensive family support tools.',
    benefits: [
      'Medicare enrollment management',
      'Long-term care planning',
      'Family benefit coordination',
      'Educational resource library'
    ],
    analyticsEvents: {
      onboarding_started: { persona: 'insurance_agent', segment: 'medicare_ltc' },
      onboarding_completed: { persona: 'insurance_agent', segment: 'medicare_ltc', referrer: 'document.referrer' },
      faq_opened: { persona: 'insurance_agent', segment: 'medicare_ltc', page: 'window.location.pathname' },
      viral_share_clicked: { persona: 'insurance_agent', segment: 'medicare_ltc', channel: 'linkedin' }
    }
  },
  insurance_medicare: {
    segment: 'insurance_medicare',
    persona: 'insurance_agent',
    title: 'Medicare Specialist Dashboard',
    subtitle: 'Specialized Medicare guidance and enrollment management for families navigating health benefits.',
    welcomeMessage: 'Expert Medicare guidance with family-focused benefit coordination.',
    benefits: [
      'Medicare plan comparison tools',
      'Enrollment tracking system',
      'Family benefit optimization',
      'Compliance management'
    ],
    analyticsEvents: {
      onboarding_started: { persona: 'insurance_agent', segment: 'insurance_medicare' },
      onboarding_completed: { persona: 'insurance_agent', segment: 'insurance_medicare', referrer: 'document.referrer' },
      faq_opened: { persona: 'insurance_agent', segment: 'insurance_medicare', page: 'window.location.pathname' },
      viral_share_clicked: { persona: 'insurance_agent', segment: 'insurance_medicare', channel: 'linkedin' }
    }
  },
  // Healthcare Segments
  medicare_health: {
    segment: 'medicare_health',
    persona: 'healthcare_consultant',
    title: 'Healthcare Consultant Gateway',
    subtitle: 'Empower families with up-to-date advice, benefit navigation, and healthspan planning tools.',
    welcomeMessage: 'Transform healthcare consulting with comprehensive family health management.',
    benefits: [
      'Healthcare benefit navigation',
      'Family health coordination',
      'Healthspan planning tools',
      'Provider network management'
    ],
    analyticsEvents: {
      onboarding_started: { persona: 'healthcare_consultant', segment: 'medicare_health' },
      onboarding_completed: { persona: 'healthcare_consultant', segment: 'medicare_health', referrer: 'document.referrer' },
      faq_opened: { persona: 'healthcare_consultant', segment: 'medicare_health', page: 'window.location.pathname' },
      viral_share_clicked: { persona: 'healthcare_consultant', segment: 'medicare_health', channel: 'linkedin' }
    }
  },
  healthcare_consultant: {
    segment: 'healthcare_consultant',
    persona: 'healthcare_consultant',
    title: 'Healthcare Consulting Excellence',
    subtitle: 'Comprehensive healthcare consulting platform for families and professionals.',
    welcomeMessage: 'Advanced healthcare consulting with integrated family wellness management.',
    benefits: [
      'Healthcare strategy development',
      'Family wellness coordination',
      'Provider relationship management',
      'Health outcome tracking'
    ],
    analyticsEvents: {
      onboarding_started: { persona: 'healthcare_consultant', segment: 'healthcare_consultant' },
      onboarding_completed: { persona: 'healthcare_consultant', segment: 'healthcare_consultant', referrer: 'document.referrer' },
      faq_opened: { persona: 'healthcare_consultant', segment: 'healthcare_consultant', page: 'window.location.pathname' },
      viral_share_clicked: { persona: 'healthcare_consultant', segment: 'healthcare_consultant', channel: 'linkedin' }
    }
  },
  // General
  general: {
    segment: 'general',
    persona: 'client',
    title: 'Welcome to the Family Office Marketplace™',
    subtitle: 'Connect with vetted professionals and access premium resources for your financial future.',
    welcomeMessage: 'Your gateway to comprehensive family wealth and health management.',
    benefits: [
      'Vetted professional network',
      'Premium resources',
      'Personalized strategies',
      'Secure platform'
    ],
    analyticsEvents: {
      onboarding_started: { persona: 'client', segment: 'general' },
      onboarding_completed: { persona: 'client', segment: 'general', referrer: 'document.referrer' },
      faq_opened: { persona: 'client', segment: 'general', page: 'window.location.pathname' },
      viral_share_clicked: { persona: 'client', segment: 'general', channel: 'linkedin' }
    }
  }
};

// Segment detection utility
export const detectPersonaSegment = (
  persona: PersonaType, 
  registrationSource?: string, 
  onboardingAnswers?: Record<string, any>
): PersonaSegment => {
  // Attorney segment detection
  if (persona === 'attorney') {
    if (onboardingAnswers?.practice_area?.includes('divorce') || 
        onboardingAnswers?.practice_area?.includes('family')) {
      return 'divorce_family_law';
    }
    if (onboardingAnswers?.practice_area?.includes('estate') || 
        onboardingAnswers?.practice_area?.includes('trust')) {
      return 'estate_planning';
    }
    if (onboardingAnswers?.practice_area?.includes('business') || 
        onboardingAnswers?.practice_area?.includes('corporate')) {
      return 'business_law';
    }
  }
  
  // Accountant segment detection
  if (persona === 'accountant') {
    if (onboardingAnswers?.credentials?.includes('CPA') || 
        onboardingAnswers?.role_title?.includes('CPA')) {
      return 'cpa';
    }
    if (onboardingAnswers?.credentials?.includes('EA') || 
        onboardingAnswers?.role_title?.includes('Enrolled Agent')) {
      return 'enrolled_agent';
    }
    return 'cpa'; // Default for accountants
  }
  
  // Advisor segment detection
  if (persona === 'advisor') {
    if (onboardingAnswers?.advisor_type?.includes('RIA') || 
        onboardingAnswers?.firm_type?.includes('RIA')) {
      return 'ria';
    }
    if (onboardingAnswers?.specialization?.includes('wealth') || 
        onboardingAnswers?.aum_range === 'high_net_worth') {
      return 'wealth_advisor';
    }
    return 'ria'; // Default for advisors
  }
  
  // Insurance agent segment detection
  if (persona === 'insurance_agent') {
    if (onboardingAnswers?.specialization?.includes('medicare') || 
        onboardingAnswers?.specialization?.includes('ltc')) {
      return 'medicare_ltc';
    }
    return 'insurance_medicare';
  }
  
  // Healthcare consultant segment detection
  if (persona === 'healthcare_consultant') {
    if (onboardingAnswers?.specialization?.includes('medicare')) {
      return 'medicare_health';
    }
    return 'healthcare_consultant';
  }
  
  return 'general';
};
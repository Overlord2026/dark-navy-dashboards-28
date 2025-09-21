export interface SolutionData {
  slug: string;
  title: string;
  description: string;
  whatItIs: {
    title: string;
    content: string;
    benefits: string[];
  };
  pricing: {
    free: {
      title: string;
      features: string[];
    };
    premium: {
      title: string;
      features: string[];
      price: string;
    };
    pro: {
      title: string;
      features: string[];
      price: string;
    };
  };
  onboarding: {
    title: string;
    steps: string[];
    cta: string;
  };
  faq: {
    question: string;
    answer: string;
  }[];
}

export const solutionsData: Record<string, SolutionData> = {
  lending: {
    slug: 'lending',
    title: 'Lending Solutions',
    description: 'Access sophisticated lending options and credit facilities tailored for high-net-worth families.',
    whatItIs: {
      title: 'Comprehensive Lending Platform',
      content: 'Our lending solutions provide access to a curated network of private lenders, banks, and alternative credit providers. From asset-based lending to complex structured financing, we help families secure optimal terms.',
      benefits: [
        'Access to exclusive lending networks',
        'Competitive rates and terms',
        'Expert guidance throughout the process',
        'Confidential and discreet service'
      ]
    },
    pricing: {
      free: {
        title: 'Basic Access',
        features: ['Market rate comparisons', 'Basic lending education', 'Community discussions']
      },
      premium: {
        title: 'Premium Lending',
        features: ['Access to private lender network', 'Personalized rate quotes', 'Application assistance', 'Priority support'],
        price: '$99/month'
      },
      pro: {
        title: 'Pro Lending',
        features: ['Dedicated lending advisor', 'Complex structure financing', 'Negotiation support', 'Ongoing relationship management'],
        price: '$299/month'
      }
    },
    onboarding: {
      title: 'Get Started with Lending',
      steps: ['Complete financial profile', 'Define lending requirements', 'Connect with approved lenders', 'Review proposals and close'],
      cta: 'Start Lending Process'
    },
    faq: [
      {
        question: 'What types of lending do you offer?',
        answer: 'We provide access to various lending types including securities-based lending, real estate financing, bridge loans, and specialized credit facilities.'
      },
      {
        question: 'What are the minimum loan amounts?',
        answer: 'Most of our lending partners have minimum loan amounts starting at $1 million, though some specialized products may have lower minimums.'
      }
    ]
  },
  investments: {
    slug: 'investments',
    title: 'Investment Solutions',
    description: 'Access institutional-quality investments and alternative opportunities typically reserved for family offices.',
    whatItIs: {
      title: 'Institutional Investment Access',
      content: 'Our investment platform provides access to private equity, hedge funds, real assets, and other alternative investments. We conduct thorough due diligence and provide ongoing monitoring.',
      benefits: [
        'Access to exclusive investment opportunities',
        'Professional due diligence and monitoring',
        'Portfolio diversification strategies',
        'Risk management and reporting'
      ]
    },
    pricing: {
      free: {
        title: 'Market Insights',
        features: ['Market research and analysis', 'Investment education', 'Performance benchmarking']
      },
      premium: {
        title: 'Premium Investments',
        features: ['Access to alternative investments', 'Due diligence reports', 'Portfolio analysis', 'Investment committee access'],
        price: '$99/month'
      },
      pro: {
        title: 'Pro Investments',
        features: ['Dedicated investment advisor', 'Custom investment strategies', 'Direct access to fund managers', 'Co-investment opportunities'],
        price: '$299/month'
      }
    },
    onboarding: {
      title: 'Start Investing',
      steps: ['Investment profile assessment', 'Risk tolerance evaluation', 'Strategy development', 'Investment execution'],
      cta: 'Begin Investment Journey'
    },
    faq: [
      {
        question: 'What is the minimum investment amount?',
        answer: 'Minimum investments vary by opportunity, typically starting at $250,000 for alternative investments.'
      },
      {
        question: 'How do you select investment opportunities?',
        answer: 'Our investment committee conducts rigorous due diligence, evaluating fund managers, strategies, and risk-return profiles.'
      }
    ]
  },
  insurance: {
    slug: 'insurance',
    title: 'Insurance Solutions',
    description: 'Comprehensive insurance strategies for wealth protection, estate planning, and risk management.',
    whatItIs: {
      title: 'Strategic Insurance Planning',
      content: 'We provide access to sophisticated insurance products and strategies, including life insurance, disability coverage, and specialty policies for high-net-worth individuals and families.',
      benefits: [
        'Customized insurance strategies',
        'Access to top-rated carriers',
        'Tax-efficient structures',
        'Ongoing policy management'
      ]
    },
    pricing: {
      free: {
        title: 'Insurance Basics',
        features: ['Insurance needs analysis', 'Educational resources', 'Basic policy comparisons']
      },
      premium: {
        title: 'Premium Insurance',
        features: ['Advanced insurance strategies', 'Policy optimization', 'Carrier access', 'Implementation support'],
        price: '$99/month'
      },
      pro: {
        title: 'Pro Insurance',
        features: ['Dedicated insurance advisor', 'Complex structure design', 'Ongoing policy management', 'Claims advocacy'],
        price: '$299/month'
      }
    },
    onboarding: {
      title: 'Optimize Your Coverage',
      steps: ['Insurance needs assessment', 'Strategy development', 'Carrier selection', 'Policy implementation'],
      cta: 'Get Insurance Analysis'
    },
    faq: [
      {
        question: 'What types of insurance do you cover?',
        answer: 'We cover life, disability, property, liability, and specialty insurance products for high-net-worth families.'
      },
      {
        question: 'Do you work with specific carriers?',
        answer: 'We work with highly-rated carriers and have access to exclusive products not available in the retail market.'
      }
    ]
  },
  'estate-planning': {
    slug: 'estate-planning',
    title: 'Estate Planning',
    description: 'Comprehensive estate planning strategies to preserve and transfer wealth across generations.',
    whatItIs: {
      title: 'Multigenerational Wealth Planning',
      content: 'Our estate planning solutions help families structure their wealth transfer strategies, minimize tax implications, and ensure smooth succession across generations.',
      benefits: [
        'Tax-efficient wealth transfer',
        'Family governance structures',
        'Charitable giving strategies',
        'Succession planning'
      ]
    },
    pricing: {
      free: {
        title: 'Planning Basics',
        features: ['Estate planning education', 'Basic document templates', 'Planning checklists']
      },
      premium: {
        title: 'Premium Planning',
        features: ['Advanced planning strategies', 'Professional network access', 'Document review', 'Tax optimization'],
        price: '$99/month'
      },
      pro: {
        title: 'Pro Planning',
        features: ['Dedicated estate planning team', 'Complex structure design', 'Ongoing plan management', 'Family governance support'],
        price: '$299/month'
      }
    },
    onboarding: {
      title: 'Plan Your Legacy',
      steps: ['Estate assessment', 'Strategy development', 'Document preparation', 'Implementation and monitoring'],
      cta: 'Start Estate Planning'
    },
    faq: [
      {
        question: 'When should I start estate planning?',
        answer: 'Estate planning should begin as soon as you have significant assets or family obligations to protect.'
      },
      {
        question: 'How often should I update my estate plan?',
        answer: 'We recommend reviewing your estate plan every 3-5 years or after major life events.'
      }
    ]
  },
  healthcare: {
    slug: 'healthcare',
    title: 'Healthcare Solutions',
    description: 'Concierge healthcare services and medical advocacy for families and executives.',
    whatItIs: {
      title: 'Premium Healthcare Access',
      content: 'Our healthcare solutions provide access to top medical professionals, concierge services, and healthcare advocacy to ensure the best possible care for you and your family.',
      benefits: [
        'Access to top specialists',
        'Concierge medical services',
        'Healthcare advocacy',
        'Preventive care programs'
      ]
    },
    pricing: {
      free: {
        title: 'Health Resources',
        features: ['Health and wellness content', 'Provider directories', 'Basic health assessments']
      },
      premium: {
        title: 'Premium Healthcare',
        features: ['Concierge doctor access', 'Specialist referrals', 'Health advocacy', 'Preventive care coordination'],
        price: '$99/month'
      },
      pro: {
        title: 'Pro Healthcare',
        features: ['Dedicated health advocate', 'Executive health programs', 'Medical emergency coordination', '24/7 support'],
        price: '$299/month'
      }
    },
    onboarding: {
      title: 'Optimize Your Health',
      steps: ['Health assessment', 'Provider network setup', 'Care coordination', 'Ongoing monitoring'],
      cta: 'Start Health Journey'
    },
    faq: [
      {
        question: 'What is included in concierge healthcare?',
        answer: 'Concierge healthcare includes priority access to physicians, same-day appointments, comprehensive health assessments, and coordinated care.'
      },
      {
        question: 'Do you work with existing healthcare providers?',
        answer: 'Yes, we can coordinate with your existing providers while also providing access to our network of specialists.'
      }
    ]
  },
  'business-filings': {
    slug: 'business-filings',
    title: 'Business Filings',
    description: 'Professional business formation, compliance, and ongoing corporate maintenance services.',
    whatItIs: {
      title: 'Complete Business Services',
      content: 'From entity formation to ongoing compliance, we handle all aspects of business administration, allowing you to focus on growing your business.',
      benefits: [
        'Entity formation and structuring',
        'Ongoing compliance management',
        'Corporate governance support',
        'Professional registered agent services'
      ]
    },
    pricing: {
      free: {
        title: 'Business Basics',
        features: ['Business formation guides', 'Compliance checklists', 'Basic templates']
      },
      premium: {
        title: 'Premium Filings',
        features: ['Professional formation services', 'Compliance monitoring', 'Document management', 'Registered agent services'],
        price: '$99/month'
      },
      pro: {
        title: 'Pro Filings',
        features: ['Dedicated business services team', 'Complex structure setup', 'Ongoing governance support', 'Priority processing'],
        price: '$299/month'
      }
    },
    onboarding: {
      title: 'Set Up Your Business',
      steps: ['Business structure consultation', 'Entity formation', 'Compliance setup', 'Ongoing maintenance'],
      cta: 'Start Business Setup'
    },
    faq: [
      {
        question: 'What types of entities can you form?',
        answer: 'We can form all types of business entities including LLCs, corporations, partnerships, and more complex structures.'
      },
      {
        question: 'Do you provide ongoing compliance support?',
        answer: 'Yes, we provide ongoing compliance monitoring, filing services, and governance support to keep your business in good standing.'
      }
    ]
  },
  marketplace: {
    slug: 'marketplace',
    title: 'Professional Marketplace',
    description: 'Connect with vetted professionals and service providers in the family office ecosystem.',
    whatItIs: {
      title: 'Curated Professional Network',
      content: 'Our marketplace connects families with pre-vetted professionals including attorneys, CPAs, investment advisors, and specialized service providers.',
      benefits: [
        'Access to vetted professionals',
        'Transparent pricing and reviews',
        'Streamlined engagement process',
        'Quality assurance and monitoring'
      ]
    },
    pricing: {
      free: {
        title: 'Basic Directory',
        features: ['Professional directory access', 'Basic profiles and reviews', 'Contact information']
      },
      premium: {
        title: 'Premium Marketplace',
        features: ['Enhanced search and filtering', 'Direct messaging', 'Project posting', 'Rating and review system'],
        price: '$99/month'
      },
      pro: {
        title: 'Pro Marketplace',
        features: ['Dedicated relationship manager', 'Custom professional sourcing', 'Contract management', 'Performance monitoring'],
        price: '$299/month'
      }
    },
    onboarding: {
      title: 'Find Your Professionals',
      steps: ['Define service needs', 'Professional matching', 'Engagement and contracting', 'Ongoing relationship management'],
      cta: 'Explore Marketplace'
    },
    faq: [
      {
        question: 'How are professionals vetted?',
        answer: 'All professionals undergo background checks, credential verification, and reference checks before joining our marketplace.'
      },
      {
        question: 'Can I work with professionals outside the marketplace?',
        answer: 'Yes, our platform also provides tools to manage relationships with your existing professional team.'
      }
    ]
  }
};
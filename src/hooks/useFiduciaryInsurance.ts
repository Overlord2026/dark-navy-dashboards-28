import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProductEducation, DecisionTool, QuoteRequest, FiduciaryAdvisor, FiduciaryProductType } from '@/types/fiduciary-insurance';

export const useFiduciaryInsurance = () => {
  const [productEducation, setProductEducation] = useState<ProductEducation[]>([]);
  const [decisionTools, setDecisionTools] = useState<DecisionTool[]>([]);
  const [advisors, setAdvisors] = useState<FiduciaryAdvisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Mock educational content for now
  const mockEducation: ProductEducation[] = [
    {
      id: 'ltc-education',
      productType: 'ltc',
      title: 'Long-Term Care Insurance',
      subtitle: 'Protecting Your Family From Catastrophic Care Costs',
      overview: 'Long-term care insurance helps cover the costs of care when you can no longer perform basic activities of daily living. This is one of the largest unplanned expenses retirees face.',
      howItWorks: [
        'You pay annual premiums to maintain coverage',
        'When you need care, the policy pays a daily or monthly benefit',
        'Benefits can be used for home care, adult day care, or nursing home care',
        'Most policies have an elimination period before benefits begin'
      ],
      pros: [
        'Protects assets and family wealth',
        'Provides dignity and choice in care options',
        'Tax advantages for qualified policies',
        'Can include inflation protection'
      ],
      cons: [
        'Premiums can increase over time',
        'May never need to use the coverage',
        'Complex underwriting process',
        'Premium payments required even if never used'
      ],
      hiddenRisks: [
        'Premium increases are common after policy issuance',
        'Many policies have strict elimination periods',
        'Home care benefits may be limited compared to facility care',
        'Some agents oversell benefits you may not need'
      ],
      fiduciaryNote: 'Our advisors receive no commissions and will help you understand if LTC insurance fits your specific situation, including alternatives like self-insurance or hybrid life/LTC products.'
    },
    {
      id: 'medicare-education',
      productType: 'medicare',
      title: 'Medicare Supplement Insurance',
      subtitle: 'Understanding Your Medicare Options Without the Sales Pressure',
      overview: 'Medicare Supplement (Medigap) insurance helps pay for costs that Original Medicare doesn\'t cover, like copayments, coinsurance, and deductibles.',
      howItWorks: [
        'You must be enrolled in Medicare Parts A and B',
        'Supplement plans are standardized (Plan A through Plan N)',
        'You pay monthly premiums in addition to Medicare premiums',
        'Claims are automatically coordinated between Medicare and your supplement'
      ],
      pros: [
        'Predictable healthcare costs',
        'Freedom to see any Medicare-accepting doctor',
        'No network restrictions',
        'Coverage travels with you nationwide'
      ],
      cons: [
        'Monthly premiums in addition to Medicare',
        'Doesn\'t include prescription drug coverage',
        'Premiums typically increase with age',
        'May not be cost-effective for healthy individuals'
      ],
      hiddenRisks: [
        'Medicare Advantage vs. Supplement choice is often oversimplified',
        'Plan F is no longer available to new Medicare beneficiaries',
        'Underwriting may apply if you miss initial enrollment',
        'Some agents push expensive plans when basic coverage may suffice'
      ],
      fiduciaryNote: 'Medicare decisions are permanent in many cases. Our fiduciary advisors will help you understand all options, including whether Medicare Advantage might be better for your situation.'
    },
    {
      id: 'iul-education',
      productType: 'iul',
      title: 'Indexed Universal Life Insurance',
      subtitle: 'The Truth About IUL: What Most Agents Won\'t Tell You',
      overview: 'Indexed Universal Life (IUL) combines life insurance with a cash value component tied to stock market index performance. It\'s often marketed as an investment, but the reality is more complex.',
      howItWorks: [
        'Premiums go toward insurance costs and cash value',
        'Cash value grows based on index performance (with caps and floors)',
        'You can borrow against cash value (with interest)',
        'Policy requires ongoing premium payments to stay in force'
      ],
      pros: [
        'Potential for higher returns than whole life',
        'Downside protection with floors',
        'Tax-deferred growth',
        'Flexibility in premium payments'
      ],
      cons: [
        'High fees and costs reduce returns significantly',
        'Caps limit upside potential',
        'Complex illustrations often show unrealistic projections',
        'Can lapse if underfunded'
      ],
      hiddenRisks: [
        'Illustrated returns assume perfect index timing (rarely achieved)',
        'Cost of insurance increases with age, requiring higher premiums',
        'Loans reduce death benefit and can cause policy to lapse',
        'Many policies perform poorly in real-world scenarios'
      ],
      fiduciaryNote: 'IUL is often oversold with unrealistic projections. Our analysis will show you real-world scenarios and help you determine if term life plus investing might be better for your goals.'
    }
  ];

  const mockDecisionTools: DecisionTool[] = [
    {
      id: 'ltc-needs-estimator',
      productType: 'ltc',
      title: 'LTC Needs Estimator',
      description: 'Calculate your potential long-term care costs and coverage needs based on your location and preferences.',
      calculatorType: 'ltc-needs',
      questions: [
        {
          id: 'age',
          question: 'What is your current age?',
          type: 'number',
          required: true,
          helpText: 'Age affects both premium costs and probability of needing care'
        },
        {
          id: 'state',
          question: 'What state do you live in?',
          type: 'select',
          options: ['California', 'Florida', 'Texas', 'New York', 'Pennsylvania'],
          required: true,
          helpText: 'Care costs vary significantly by state'
        },
        {
          id: 'preferred-care',
          question: 'Where would you prefer to receive care?',
          type: 'select',
          options: ['At home', 'Adult day care', 'Assisted living', 'Nursing home', 'Flexible options'],
          required: true
        },
        {
          id: 'assets',
          question: 'What are your approximate investable assets?',
          type: 'select',
          options: ['Under $250k', '$250k-$500k', '$500k-$1M', '$1M-$2M', 'Over $2M'],
          required: true,
          helpText: 'This helps determine if self-insurance might be an option'
        }
      ]
    },
    {
      id: 'medicare-decision-tree',
      productType: 'medicare',
      title: 'Medicare Decision Tree',
      description: 'Find the Medicare coverage that best fits your health needs and budget.',
      calculatorType: 'medicare-eligibility',
      questions: [
        {
          id: 'turning-65',
          question: 'When are you turning 65?',
          type: 'select',
          options: ['Already 65+', 'Within 6 months', '6-12 months', 'More than 1 year'],
          required: true
        },
        {
          id: 'current-coverage',
          question: 'Do you currently have employer health coverage?',
          type: 'boolean',
          required: true,
          helpText: 'This affects your enrollment timing and options'
        },
        {
          id: 'doctor-preference',
          question: 'Do you have doctors you want to keep seeing?',
          type: 'boolean',
          required: true
        },
        {
          id: 'travel-frequency',
          question: 'How often do you travel or spend time in other states?',
          type: 'select',
          options: ['Rarely', 'Occasionally', 'Frequently', 'Part-time resident'],
          required: true
        },
        {
          id: 'monthly-budget',
          question: 'What\'s your comfortable monthly healthcare budget?',
          type: 'select',
          options: ['Under $200', '$200-$400', '$400-$600', 'Over $600'],
          required: true
        }
      ]
    },
    {
      id: 'iul-real-cost',
      productType: 'iul',
      title: 'IUL Real Cost Calculator',
      description: 'See realistic projections for IUL performance vs. term life + investing.',
      calculatorType: 'iul-cost',
      questions: [
        {
          id: 'coverage-amount',
          question: 'How much life insurance coverage do you need?',
          type: 'select',
          options: ['$250k', '$500k', '$750k', '$1M', '$1.5M', '$2M+'],
          required: true
        },
        {
          id: 'age',
          question: 'What is your current age?',
          type: 'number',
          required: true
        },
        {
          id: 'health-status',
          question: 'How would you rate your health?',
          type: 'select',
          options: ['Excellent', 'Good', 'Fair', 'Poor'],
          required: true
        },
        {
          id: 'investment-experience',
          question: 'What\'s your investment experience?',
          type: 'select',
          options: ['Beginner', 'Some experience', 'Experienced', 'Very experienced'],
          required: true
        },
        {
          id: 'time-horizon',
          question: 'How long do you plan to need life insurance?',
          type: 'select',
          options: ['10-15 years', '15-20 years', '20-30 years', 'Lifetime'],
          required: true
        }
      ]
    }
  ];

  const submitQuoteRequest = async (quoteData: Omit<QuoteRequest, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
    try {
      setSaving(true);
      
      // TODO: Replace with actual Supabase call
      const quoteRequest: QuoteRequest = {
        ...quoteData,
        id: Math.random().toString(),
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Auto-match to advisor based on state and specialty
      const matchedAdvisor = advisors.find(advisor => 
        advisor.state === quoteData.personalInfo.state &&
        advisor.specialties.includes(quoteData.productType) &&
        advisor.complianceStatus === 'verified'
      );

      if (matchedAdvisor) {
        quoteRequest.matchedAdvisorId = matchedAdvisor.id;
        quoteRequest.status = 'matched';
      }

      toast({
        title: "Request Submitted",
        description: matchedAdvisor 
          ? `We've matched you with ${matchedAdvisor.name}. They'll contact you within 24 hours.`
          : "We're finding the best fiduciary advisor for your needs. You'll hear from us within 24 hours.",
      });

      return quoteRequest;
    } catch (error) {
      console.error('Error submitting quote request:', error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const getProductEducation = (productType: FiduciaryProductType) => {
    return productEducation.find(edu => edu.productType === productType);
  };

  const getDecisionTool = (productType: FiduciaryProductType) => {
    return decisionTools.find(tool => tool.productType === productType);
  };

  useEffect(() => {
    // Load mock data
    setProductEducation(mockEducation);
    setDecisionTools(mockDecisionTools);
    setLoading(false);
  }, []);

  return {
    productEducation,
    decisionTools,
    advisors,
    loading,
    saving,
    submitQuoteRequest,
    getProductEducation,
    getDecisionTool,
  };
};
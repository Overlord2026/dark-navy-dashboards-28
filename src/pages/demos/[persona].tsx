import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TourStepper } from '@/components/discover/TourStepper';
import { ShareButton } from '@/components/discover/ShareButton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Demo data is shared with DemoLauncher component
const demoData = {
  overview: [
    {
      title: "Welcome to the Family Office Platform",
      content: "A secure workspace where families and their trusted professionals collaborate seamlessly. Everything you need in one place, with compliance and proof built in.",
      duration: 8
    },
    {
      title: "Choose Your Role",
      content: "Whether you're a family, advisor, CPA, attorney, or other professional, the platform adapts to your specific needs and workflows.",
      duration: 8
    },
    {
      title: "Organize Everything",
      content: "Accounts, documents, goals, tasks, and communications—all organized and accessible to the right people at the right time.",
      duration: 8
    },
    {
      title: "Trust & Compliance",
      content: "Every action creates a cryptographic receipt. Smart checks ensure compliance. Secure vault keeps everything safe. Time-stamped anchors provide immutable proof.",
      duration: 8
    },
    {
      title: "Collaborate Securely",
      content: "Invite your people, share what they need to see, and maintain complete control over your information.",
      duration: 8
    }
  ],
  families: [
    {
      title: "Your Family Command Center",
      content: "Start by organizing all your financial and health information in one secure workspace. Import accounts, upload documents, set goals.",
      duration: 10
    },
    {
      title: "Invite Your Team",
      content: "Connect with your advisors, CPAs, attorneys, and healthcare providers. Each sees only what they need for their role.",
      duration: 10
    },
    {
      title: "Track Everything",
      content: "Monitor accounts, track goals, manage tasks, and get insights on your financial health—all in real-time.",
      duration: 10
    },
    {
      title: "Estate & Legacy Planning",
      content: "Keep important documents secure, maintain beneficiary information, and ensure your legacy plans are up to date.",
      duration: 10
    },
    {
      title: "Health Coordination",
      content: "Manage medical records, coordinate care among providers, and keep health directives accessible to family members.",
      duration: 10
    }
  ],
  advisors: [
    {
      title: "Client Lifecycle Management",
      content: "From prospect to lifelong client—manage the entire relationship in one platform. Lead generation, onboarding, planning, and ongoing service.",
      duration: 10
    },
    {
      title: "Comprehensive Planning Tools",
      content: "Built-in financial planning, investment management, tax planning, and estate planning tools. Everything integrated and client-ready.",
      duration: 10
    },
    {
      title: "Client Collaboration Hub",
      content: "Secure client portal where families can access their information, review recommendations, and communicate with your team.",
      duration: 10
    },
    {
      title: "Compliance & Documentation",
      content: "Automatic compliance tracking, document management, and audit trails. Every client interaction is properly documented.",
      duration: 10
    },
    {
      title: "Practice Growth",
      content: "Analytics, reporting, and insights to grow your practice. Track client satisfaction, retention, and revenue growth.",
      duration: 10
    }
  ],
  cpas: [
    {
      title: "Engagement Management",
      content: "Organize client engagements from initial request through completion. Track deadlines, deliverables, and client communications.",
      duration: 10
    },
    {
      title: "Document Collection",
      content: "Secure portal for clients to upload tax documents, financial statements, and other required materials. Automatic organization and verification.",
      duration: 10
    },
    {
      title: "Tax Preparation & Review",
      content: "Integrated tax preparation tools with built-in review processes. Collaborate with clients on tax strategies and planning.",
      duration: 10
    },
    {
      title: "Signature & Delivery",
      content: "Electronic signature workflows and secure delivery of completed returns and documents. Full audit trail maintained.",
      duration: 10
    },
    {
      title: "Year-Round Advisory",
      content: "Beyond tax season—provide ongoing advisory services, quarterly check-ins, and strategic tax planning throughout the year.",
      duration: 10
    }
  ],
  attorneys: [
    {
      title: "Matter Management",
      content: "Organize legal matters from intake through resolution. Track deadlines, court dates, and case progression.",
      duration: 10
    },
    {
      title: "Document Assembly",
      content: "Template-based document creation with automatic population from client data. Version control and collaboration features.",
      duration: 10
    },
    {
      title: "Client Authority",
      content: "Manage client authorizations, powers of attorney, and other authority documents. Ensure proper permissions for all actions.",
      duration: 10
    },
    {
      title: "Evidence & Discovery",
      content: "Secure storage and organization of case evidence. Collaboration tools for discovery and case preparation.",
      duration: 10
    },
    {
      title: "Billing & Time Tracking",
      content: "Integrated time tracking and billing. Transparent client billing with detailed activity logs and receipt generation.",
      duration: 10
    }
  ],
  insurance: [
    {
      title: "Quote Management",
      content: "Generate and manage insurance quotes across multiple carriers. Track client preferences and coverage needs.",
      duration: 10
    },
    {
      title: "Application Processing",
      content: "Streamlined application workflows with electronic signatures and document collection. Track application status in real-time.",
      duration: 10
    },
    {
      title: "Policy Administration",
      content: "Manage active policies, renewals, and changes. Automatic reminders for premium payments and policy reviews.",
      duration: 10
    },
    {
      title: "Claims Support",
      content: "Assist clients with claims filing and tracking. Maintain documentation and communicate with carriers on behalf of clients.",
      duration: 10
    },
    {
      title: "Compliance Tracking",
      content: "Ensure all transactions meet regulatory requirements. Generate compliance reports and maintain proper documentation.",
      duration: 10
    }
  ],
  healthcare: [
    {
      title: "Family Health Dashboard",
      content: "Secure view into family health information relevant to your care. See medical history, current conditions, and medications.",
      duration: 10
    },
    {
      title: "Prior Authorization",
      content: "Streamlined prior authorization process with access to family financial information and insurance details.",
      duration: 10
    },
    {
      title: "Care Coordination",
      content: "Collaborate with other providers in the family's care team. Share treatment plans and coordinate care decisions.",
      duration: 10
    },
    {
      title: "Results Delivery",
      content: "Securely deliver test results, treatment summaries, and care instructions directly to the family vault.",
      duration: 10
    },
    {
      title: "Billing Integration",
      content: "Integrated billing with family financial information. Transparent pricing and payment processing.",
      duration: 10
    }
  ],
  realtor: [
    {
      title: "Listing Management",
      content: "Manage property listings with integrated marketing tools and client communication. Track showings and feedback.",
      duration: 10
    },
    {
      title: "Buyer Qualification",
      content: "Access client financial information (with permission) to ensure proper qualification and pre-approval coordination.",
      duration: 10
    },
    {
      title: "Offer Management",
      content: "Manage offers, counteroffers, and negotiations. Track all communications and document every decision.",
      duration: 10
    },
    {
      title: "Transaction Coordination",
      content: "Coordinate with lenders, inspectors, appraisers, and attorneys. Track all transaction milestones and deadlines.",
      duration: 10
    },
    {
      title: "Closing Support",
      content: "Manage closing documents, coordinate final walkthroughs, and ensure smooth transaction completion.",
      duration: 10
    }
  ],
  'nil-athlete': [
    {
      title: "Training & Development",
      content: "Track training schedules, performance metrics, and development goals. Coordinate with coaches and trainers.",
      duration: 10
    },
    {
      title: "Disclosure Management",
      content: "Manage required disclosures for eligibility and compliance. Automatic reminders and verification processes.",
      duration: 10
    },
    {
      title: "Offer Evaluation",
      content: "Review and evaluate NIL offers with integrated financial analysis. Compare terms and understand implications.",
      duration: 10
    },
    {
      title: "Contract Management",
      content: "Secure contract storage and management. Track obligations, deadlines, and performance requirements.",
      duration: 10
    },
    {
      title: "Payment Tracking",
      content: "Monitor payments, tax implications, and financial impact. Generate reports for tax preparation and financial planning.",
      duration: 10
    }
  ],
  'nil-school': [
    {
      title: "Rule Publication",
      content: "Publish and manage NIL compliance rules for your institution. Ensure athletes and families understand requirements.",
      duration: 10
    },
    {
      title: "Offer Verification",
      content: "Automatic verification of NIL offers against institutional rules and NCAA regulations. Flag potential compliance issues.",
      duration: 10
    },
    {
      title: "Dispute Resolution",
      content: "Streamlined dispute resolution process with complete documentation and audit trails. Reduce compliance conflicts.",
      duration: 10
    },
    {
      title: "Reporting & Analytics",
      content: "Comprehensive reporting on NIL activity, compliance metrics, and program effectiveness. Data-driven insights.",
      duration: 10
    },
    {
      title: "Integration Support",
      content: "Integrate with existing athletic department systems and NCAA reporting requirements. Seamless workflow integration.",
      duration: 10
    }
  ]
};

const DemoPage: React.FC = () => {
  const { persona } = useParams<{ persona: string }>();
  const [isOpen, setIsOpen] = useState(true);
  const steps = demoData[persona as keyof typeof demoData] || [];

  useEffect(() => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('demo.page.visit', { persona });
    }
  }, [persona]);

  const handleClose = () => {
    setIsOpen(false);
    // Redirect back to discover
    window.location.href = '/discover';
  };

  const handleStartWorkspace = () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('lp.hero.cta', { persona, source: 'demo_page' });
    }
    
    window.location.href = `/onboarding?persona=${persona}`;
  };

  if (!persona || steps.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Demo not found</h1>
          <p className="text-muted-foreground">The requested demo could not be found.</p>
          <Button asChild>
            <a href="/discover">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Discover
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="/discover">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Discover
                </a>
              </Button>
              <div>
                <h1 className="text-lg font-semibold capitalize">{persona} Demo</h1>
                <p className="text-sm text-muted-foreground">
                  See how the platform works for {persona}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ShareButton 
                text={`Check out this demo for ${persona} on the Family Office Platform`}
                variant="outline"
                size="sm"
              />
              <Button size="sm" className="bg-gold hover:bg-gold-hover text-navy" onClick={handleStartWorkspace}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Start workspace
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">
            Experience the {persona} workflow
          </h2>
          <p className="text-xl text-muted-foreground">
            This 60-second demo shows how the platform adapts to your specific needs and workflows.
          </p>
        </div>
      </main>

      {/* Tour Stepper */}
      <TourStepper
        isOpen={isOpen}
        onClose={handleClose}
        steps={steps}
        persona={persona}
      />
    </div>
  );
};

export default DemoPage;

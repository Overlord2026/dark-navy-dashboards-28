import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  CreditCard, 
  Calendar, 
  Target,
  Shield,
  MessageSquare,
  TrendingUp,
  Calculator,
  Scale,
  Building,
  Heart,
  Crown,
  Briefcase
} from 'lucide-react';

interface PracticeModule {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  status?: 'active' | 'premium' | 'coming-soon';
  metrics?: {
    value: string;
    label: string;
    trend?: 'up' | 'down' | 'neutral';
  };
}

interface PersonaPracticeManagementProps {
  persona: string;
}

export const PersonaPracticeManagement: React.FC<PersonaPracticeManagementProps> = ({ persona }) => {
  const navigate = useNavigate();

  const getPracticeModules = (persona: string): PracticeModule[] => {
    const modulesByPersona: Record<string, PracticeModule[]> = {
      advisor: [
        {
          id: 'client-management',
          title: 'Client Management',
          description: 'Manage all client relationships and portfolios',
          icon: Users,
          href: '/advisor/clients',
          metrics: { value: '42', label: 'Active Clients', trend: 'up' }
        },
        {
          id: 'aum-tracking',
          title: 'AUM Tracking',
          description: 'Monitor total assets under management',
          icon: TrendingUp,
          href: '/advisor/aum',
          metrics: { value: '$347.9M', label: 'Total AUM', trend: 'up' }
        },
        {
          id: 'billing',
          title: 'Billing & Invoicing',
          description: 'Manage client billing and fee collection',
          icon: CreditCard,
          href: '/advisor/billing'
        },
        {
          id: 'compliance',
          title: 'Compliance Center',
          description: 'Regulatory compliance and reporting',
          icon: Shield,
          href: '/advisor/compliance',
          status: 'premium'
        },
        {
          id: 'marketing',
          title: 'Marketing Hub',
          description: 'Client communications and marketing',
          icon: MessageSquare,
          href: '/advisor/marketing',
          status: 'premium'
        },
        {
          id: 'calendar',
          title: 'Calendar & Meetings',
          description: 'Schedule and manage client appointments',
          icon: Calendar,
          href: '/advisor/calendar'
        }
      ],
      accountant: [
        {
          id: 'tax-prep',
          title: 'Tax Preparation',
          description: 'Prepare and file client tax returns',
          icon: Calculator,
          href: '/accountant/tax-prep',
          metrics: { value: '145', label: 'Returns Filed', trend: 'up' }
        },
        {
          id: 'client-portal',
          title: 'Client Portal',
          description: 'Secure client document exchange',
          icon: Users,
          href: '/accountant/clients',
          metrics: { value: '67', label: 'Active Clients', trend: 'up' }
        },
        {
          id: 'deadline-tracker',
          title: 'Deadline Tracker',
          description: 'Monitor important tax deadlines',
          icon: Calendar,
          href: '/accountant/deadlines',
          metrics: { value: '7', label: 'Upcoming Deadlines', trend: 'neutral' }
        },
        {
          id: 'time-billing',
          title: 'Time & Billing',
          description: 'Track time and generate invoices',
          icon: CreditCard,
          href: '/accountant/billing'
        },
        {
          id: 'tax-research',
          title: 'Tax Research',
          description: 'Access tax codes and regulations',
          icon: FileText,
          href: '/accountant/research',
          status: 'premium'
        },
        {
          id: 'workflow',
          title: 'Workflow Management',
          description: 'Streamline tax preparation workflows',
          icon: Target,
          href: '/accountant/workflow'
        }
      ],
      attorney: [
        {
          id: 'case-management',
          title: 'Case Management',
          description: 'Manage all client cases and matters',
          icon: Briefcase,
          href: '/attorney/cases',
          metrics: { value: '23', label: 'Active Cases', trend: 'up' }
        },
        {
          id: 'document-management',
          title: 'Document Management',
          description: 'Legal document creation and storage',
          icon: FileText,
          href: '/attorney/documents'
        },
        {
          id: 'trust-administration',
          title: 'Trust Administration',
          description: 'Manage trusts and estate planning',
          icon: Shield,
          href: '/attorney/trusts',
          status: 'premium'
        },
        {
          id: 'billing',
          title: 'Legal Billing',
          description: 'Time tracking and client billing',
          icon: CreditCard,
          href: '/attorney/billing',
          metrics: { value: '156', label: 'Billable Hours', trend: 'up' }
        },
        {
          id: 'compliance',
          title: 'Legal Compliance',
          description: 'Bar requirements and compliance tracking',
          icon: Scale,
          href: '/attorney/compliance'
        },
        {
          id: 'calendar',
          title: 'Court Calendar',
          description: 'Court dates and client appointments',
          icon: Calendar,
          href: '/attorney/calendar'
        }
      ],
      realtor: [
        {
          id: 'listings',
          title: 'Property Listings',
          description: 'Manage all your property listings',
          icon: Building,
          href: '/realtor/listings',
          metrics: { value: '18', label: 'Active Listings', trend: 'up' }
        },
        {
          id: 'client-management',
          title: 'Client Management',
          description: 'Manage buyers and sellers',
          icon: Users,
          href: '/realtor/clients'
        },
        {
          id: 'transactions',
          title: 'Transaction Management',
          description: 'Track deals and closings',
          icon: FileText,
          href: '/realtor/transactions',
          metrics: { value: '5', label: 'Pending Closings', trend: 'neutral' }
        },
        {
          id: 'marketing',
          title: 'Property Marketing',
          description: 'Marketing tools for listings',
          icon: MessageSquare,
          href: '/realtor/marketing'
        },
        {
          id: 'family-office-network',
          title: 'Family Office Network',
          description: 'Connect with high-net-worth families',
          icon: Crown,
          href: '/realtor/family-office',
          status: 'premium'
        },
        {
          id: 'calendar',
          title: 'Showings & Appointments',
          description: 'Schedule property showings',
          icon: Calendar,
          href: '/realtor/calendar'
        }
      ],
      healthcare: [
        {
          id: 'patient-portal',
          title: 'Patient Portal',
          description: 'Manage patient relationships and records',
          icon: Users,
          href: '/healthcare/patients',
          metrics: { value: '234', label: 'Active Patients', trend: 'up' }
        },
        {
          id: 'wellness-programs',
          title: 'Wellness Programs',
          description: 'Executive health and wellness services',
          icon: Heart,
          href: '/healthcare/wellness',
          status: 'premium'
        },
        {
          id: 'appointments',
          title: 'Appointment Scheduling',
          description: 'Schedule and manage appointments',
          icon: Calendar,
          href: '/healthcare/appointments'
        },
        {
          id: 'health-records',
          title: 'Health Records',
          description: 'Secure medical record management',
          icon: FileText,
          href: '/healthcare/records'
        },
        {
          id: 'family-health',
          title: 'Family Health Hub',
          description: 'Comprehensive family health management',
          icon: Crown,
          href: '/healthcare/family-hub',
          status: 'premium'
        },
        {
          id: 'billing',
          title: 'Practice Billing',
          description: 'Healthcare billing and insurance',
          icon: CreditCard,
          href: '/healthcare/billing'
        }
      ]
    };

    return modulesByPersona[persona] || [];
  };

  const modules = getPracticeModules(persona);
  const personaTitle = persona.charAt(0).toUpperCase() + persona.slice(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{personaTitle} Practice Management</h2>
          <p className="text-muted-foreground">
            Comprehensive tools for your {persona} practice
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Briefcase className="h-3 w-3" />
          Professional Suite
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <Card
            key={module.id}
            className="relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
            onClick={() => navigate(module.href)}
          >
            {module.status === 'premium' && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-gold/20 to-accent/20 text-gold border-gold/20"
              >
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
            
            {module.status === 'coming-soon' && (
              <Badge 
                variant="outline" 
                className="absolute -top-2 -right-2 z-10 bg-muted text-muted-foreground"
              >
                Coming Soon
              </Badge>
            )}

            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-2">
                <div className="p-3 rounded-lg bg-accent/10 text-accent">
                  <module.icon className="h-6 w-6" />
                </div>
              </div>
              <CardTitle className="text-sm font-medium">{module.title}</CardTitle>
            </CardHeader>
            
            <CardContent className="pt-0">
              <CardDescription className="text-xs text-center mb-3">
                {module.description}
              </CardDescription>
              
              {module.metrics && (
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">
                    {module.metrics.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {module.metrics.label}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
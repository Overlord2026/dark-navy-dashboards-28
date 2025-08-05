import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Star, HelpCircle, Crown, Zap } from 'lucide-react';
import { PricingFeatureTooltips } from './PricingFeatureTooltips';
import { PricingCTAButtons } from './PricingCTAButtons';

interface PricingTier {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  isPopular?: boolean;
  features: Record<string, boolean | string>;
}

interface PersonaPricing {
  persona: string;
  icon: string;
  description: string;
  tiers: PricingTier[];
  addOns: Array<{
    name: string;
    price: number;
    description: string;
  }>;
}

export const PersonaPricingTables = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPersona, setSelectedPersona] = useState('advisor');

  const personaPricingData: Record<string, PersonaPricing> = {
    advisor: {
      persona: 'Financial Advisors',
      icon: '📊',
      description: 'Complete wealth management platform for elite advisors',
      tiers: [
        {
          name: 'Basic',
          monthlyPrice: 59,
          annualPrice: 600,
            features: {
              'branded_portal': true,
              'crm_pipeline': true,
              'document_vault': true,
              'training_center': true,
              'community_access': true,
              'linda_ai_assistant': '+$10/mo',
              'lead_engine': false,
              'automated_meetings': false,
              'advertising_dashboard': false,
              'portfolio_analytics': false,
              'compliance_center': false,
              'swag_scoring': false,
              'vip_marketplace': false,
              'ai_copilot': false,
              'white_label': false,
              'users_included': '1 seat'
            }
        },
        {
          name: 'Pro',
          monthlyPrice: 119,
          annualPrice: 1200,
          isPopular: true,
            features: {
              'branded_portal': true,
              'crm_pipeline': true,
              'document_vault': true,
              'training_center': true,
              'community_access': true,
              'linda_ai_assistant': true,
              'lead_engine': true,
              'automated_meetings': true,
              'advertising_dashboard': true,
              'portfolio_analytics': true,
              'compliance_center': true,
              'swag_scoring': false,
              'vip_marketplace': false,
              'ai_copilot': false,
              'white_label': false,
              'users_included': '3 seats'
            }
        },
        {
          name: 'Premium',
          monthlyPrice: 199,
          annualPrice: 2000,
            features: {
              'branded_portal': true,
              'crm_pipeline': true,
              'document_vault': true,
              'training_center': true,
              'community_access': true,
              'linda_ai_assistant': true,
              'lead_engine': true,
              'automated_meetings': true,
              'advertising_dashboard': true,
              'portfolio_analytics': true,
              'compliance_center': true,
              'swag_scoring': true,
              'vip_marketplace': true,
              'ai_copilot': true,
              'white_label': true,
              'users_included': '10 seats'
            }
        }
      ],
      addOns: [
        { name: 'Linda AI Assistant', price: 10, description: 'Voice AI meeting confirmation assistant (VOIP/SMS)' },
        { name: 'SMS/Voice Add-on', price: 5, description: 'SMS and voice calling capabilities' },
        { name: 'VIP Support', price: 25, description: 'Priority support and dedicated success manager' },
        { name: 'Extra Users', price: 15, description: 'Additional user seats beyond included amount' }
      ]
    },
    cpa: {
      persona: 'Accountants/CPAs',
      icon: '🧮',
      description: 'Advanced practice management for accounting professionals',
      tiers: [
        {
          name: 'Basic',
          monthlyPrice: 49,
          annualPrice: 500,
          features: {
            'client_portal': true,
            'ce_tracking': true,
            'document_vault': true,
            'training_center': true,
            'community_access': true,
            'linda_ai_assistant': '+$10/mo',
            'tax_analysis': false,
            'workflow_automation': false,
            'lead_engine': false,
            'compliance_monitoring': false,
            'family_office_integration': false,
            'vip_marketplace': false,
            'ai_tax_assistant': false,
            'white_label': false,
            'users_included': '1 seat'
          }
        },
        {
          name: 'Pro',
          monthlyPrice: 99,
          annualPrice: 1000,
          isPopular: true,
          features: {
            'client_portal': true,
            'ce_tracking': true,
            'document_vault': true,
            'training_center': true,
            'community_access': true,
            'linda_ai_assistant': true,
            'tax_analysis': true,
            'workflow_automation': true,
            'lead_engine': true,
            'compliance_monitoring': true,
            'family_office_integration': false,
            'vip_marketplace': false,
            'ai_tax_assistant': false,
            'white_label': false,
            'users_included': '5 seats'
          }
        },
        {
          name: 'Premium',
          monthlyPrice: 159,
          annualPrice: 1600,
          features: {
            'client_portal': true,
            'ce_tracking': true,
            'document_vault': true,
            'training_center': true,
            'community_access': true,
            'linda_ai_assistant': true,
            'tax_analysis': true,
            'workflow_automation': true,
            'lead_engine': true,
            'compliance_monitoring': true,
            'family_office_integration': true,
            'vip_marketplace': true,
            'ai_tax_assistant': true,
            'white_label': true,
            'users_included': '15 seats'
          }
        }
      ],
      addOns: [
        { name: 'Linda AI Assistant', price: 10, description: 'Voice AI meeting confirmation assistant (VOIP/SMS)' },
        { name: 'Advanced Tax Module', price: 15, description: 'Enhanced tax planning and analysis tools' },
        { name: 'Client Communication Suite', price: 10, description: 'SMS, email automation, and client messaging' },
        { name: 'Extra Storage', price: 8, description: 'Additional document storage beyond base limits' }
      ]
    },
    attorney: {
      persona: 'Attorneys',
      icon: '⚖️',
      description: 'Comprehensive legal practice management for estate planning',
      tiers: [
        {
          name: 'Basic',
          monthlyPrice: 69,
          annualPrice: 700,
          features: {
            'client_portal': true,
            'cle_tracking': true,
            'document_vault': true,
            'training_center': true,
            'community_access': true,
            'linda_ai_assistant': '+$10/mo',
            'legal_crm': false,
            'document_automation': false,
            'event_scheduling': false,
            'lead_engine': false,
            'compliance_alerts': false,
            'vip_marketplace': false,
            'ai_legal_assistant': false,
            'white_label': false,
            'users_included': '1 seat'
          }
        },
        {
          name: 'Pro',
          monthlyPrice: 129,
          annualPrice: 1300,
          isPopular: true,
          features: {
            'client_portal': true,
            'cle_tracking': true,
            'document_vault': true,
            'training_center': true,
            'community_access': true,
            'linda_ai_assistant': true,
            'legal_crm': true,
            'document_automation': true,
            'event_scheduling': true,
            'lead_engine': true,
            'compliance_alerts': true,
            'vip_marketplace': false,
            'ai_legal_assistant': false,
            'white_label': false,
            'users_included': '5 seats'
          }
        },
        {
          name: 'Premium',
          monthlyPrice: 199,
          annualPrice: 2000,
          features: {
            'client_portal': true,
            'cle_tracking': true,
            'document_vault': true,
            'training_center': true,
            'community_access': true,
            'linda_ai_assistant': true,
            'legal_crm': true,
            'document_automation': true,
            'event_scheduling': true,
            'lead_engine': true,
            'compliance_alerts': true,
            'vip_marketplace': true,
            'ai_legal_assistant': true,
            'white_label': true,
            'users_included': '15 seats'
          }
        }
      ],
      addOns: [
        { name: 'Linda AI Assistant', price: 10, description: 'Voice AI meeting confirmation assistant (VOIP/SMS)' },
        { name: 'Legal Document Library', price: 20, description: 'Access to premium legal document templates' },
        { name: 'Court Calendar Integration', price: 12, description: 'Sync with court systems and legal calendars' },
        { name: 'Expert Witness Network', price: 25, description: 'Access to vetted expert witness database' }
      ]
    },
    insurance: {
      persona: 'Insurance/IMO/FMO',
      icon: '🛡️',
      description: 'Complete insurance agency management platform',
      tiers: [
        {
          name: 'Basic',
          monthlyPrice: 39,
          annualPrice: 400,
          features: {
            'agent_portal': true,
            'ce_tracking': true,
            'linda_ai_assistant': '+$10/mo',
            'commission_tracking': false,
            'lead_engine': false,
            'marketing_dashboard': false,
            'event_management': false,
            'compliance_center': false,
            'vip_marketplace': false,
            'ai_sales_assistant': false,
            'white_label': false,
            'users_included': '1 seat'
          }
        },
        {
          name: 'Pro',
          monthlyPrice: 89,
          annualPrice: 900,
          isPopular: true,
          features: {
            'agent_portal': true,
            'ce_tracking': true,
            'linda_ai_assistant': true,
            'commission_tracking': true,
            'lead_engine': true,
            'marketing_dashboard': true,
            'event_management': true,
            'compliance_center': true,
            'vip_marketplace': false,
            'ai_sales_assistant': false,
            'white_label': false,
            'users_included': '10 seats'
          }
        },
        {
          name: 'Premium',
          monthlyPrice: 149,
          annualPrice: 1500,
          features: {
            'agent_portal': true,
            'ce_tracking': true,
            'linda_ai_assistant': true,
            'commission_tracking': true,
            'lead_engine': true,
            'marketing_dashboard': true,
            'event_management': true,
            'compliance_center': true,
            'vip_marketplace': true,
            'ai_sales_assistant': true,
            'white_label': true,
            'users_included': '25 seats'
          }
        }
      ],
      addOns: [
        { name: 'Linda AI Assistant', price: 10, description: 'Voice AI for policy reviews and annual calls (VOIP/SMS)' },
        { name: 'Carrier Integration Suite', price: 18, description: 'Direct integration with major insurance carriers' },
        { name: 'Advanced Analytics', price: 15, description: 'Deep dive analytics and reporting tools' },
        { name: 'Team Collaboration Tools', price: 10, description: 'Enhanced team communication and workflow' }
      ]
    },
    coach: {
      persona: 'Consultants/Coaches',
      icon: '🎯',
      description: 'Professional coaching and consulting practice platform',
      tiers: [
        {
          name: 'Basic',
          monthlyPrice: 29,
          annualPrice: 300,
          features: {
            'practice_dashboard': true,
            'client_management': true,
            'linda_ai_assistant': '+$10/mo',
            'meeting_tools': false,
            'curriculum_manager': false,
            'lead_engine': false,
            'client_engagement': false,
            'vip_marketplace': false,
            'ai_coaching_assistant': false,
            'white_label': false,
            'users_included': '1 seat'
          }
        },
        {
          name: 'Pro',
          monthlyPrice: 69,
          annualPrice: 700,
          isPopular: true,
          features: {
            'practice_dashboard': true,
            'client_management': true,
            'linda_ai_assistant': true,
            'meeting_tools': true,
            'curriculum_manager': true,
            'lead_engine': true,
            'client_engagement': true,
            'vip_marketplace': false,
            'ai_coaching_assistant': false,
            'white_label': false,
            'users_included': '5 seats'
          }
        },
        {
          name: 'Premium',
          monthlyPrice: 119,
          annualPrice: 1200,
          features: {
            'practice_dashboard': true,
            'client_management': true,
            'linda_ai_assistant': true,
            'meeting_tools': true,
            'curriculum_manager': true,
            'lead_engine': true,
            'client_engagement': true,
            'vip_marketplace': true,
            'ai_coaching_assistant': true,
            'white_label': true,
            'users_included': '15 seats'
          }
        }
      ],
      addOns: [
        { name: 'Linda AI Assistant', price: 10, description: 'Voice AI meeting confirmation assistant (VOIP/SMS)' },
        { name: 'Course Builder Pro', price: 12, description: 'Advanced course creation and delivery tools' },
        { name: 'Client Assessment Suite', price: 8, description: 'Comprehensive client evaluation tools' },
        { name: 'Marketing Automation', price: 15, description: 'Automated marketing and lead nurturing' }
      ]
    },
    industry_org: {
      persona: 'Industry Organizations',
      icon: '🏛️',
      description: 'Enterprise platform for industry associations and organizations',
      tiers: [
        {
          name: 'Basic',
          monthlyPrice: 199,
          annualPrice: 2000,
          features: {
            'member_management': true,
            'linda_ai_assistant': '+$10/mo',
            'event_platform': false,
            'marketplace_access': false,
            'bulk_onboarding': false,
            'analytics_dashboard': false,
            'sponsor_tools': false,
            'white_label': false,
            'ai_admin_assistant': false,
            'users_included': '5 seats'
          }
        },
        {
          name: 'Pro',
          monthlyPrice: 399,
          annualPrice: 4000,
          isPopular: true,
          features: {
            'member_management': true,
            'linda_ai_assistant': true,
            'event_platform': true,
            'marketplace_access': true,
            'bulk_onboarding': true,
            'analytics_dashboard': true,
            'sponsor_tools': false,
            'white_label': false,
            'ai_admin_assistant': false,
            'users_included': '15 seats'
          }
        },
        {
          name: 'Premium',
          monthlyPrice: 699,
          annualPrice: 7000,
          features: {
            'member_management': true,
            'linda_ai_assistant': true,
            'event_platform': true,
            'marketplace_access': true,
            'bulk_onboarding': true,
            'analytics_dashboard': true,
            'sponsor_tools': true,
            'white_label': true,
            'ai_admin_assistant': true,
            'users_included': '50 seats'
          }
        }
      ],
      addOns: [
        { name: 'Linda AI Assistant', price: 10, description: 'Voice AI meeting confirmation assistant (VOIP/SMS)' },
        { name: 'Enterprise SSO', price: 50, description: 'Single sign-on integration for enterprise security' },
        { name: 'Custom Integrations', price: 100, description: 'Custom API integrations and data connectors' },
        { name: 'Dedicated Success Manager', price: 200, description: 'Dedicated enterprise success manager' }
      ]
    },
    client: {
      persona: 'Clients/Families',
      icon: '👨‍👩‍👧‍👦',
      description: 'Comprehensive family office platform for high-net-worth families',
      tiers: [
        {
          name: 'Basic',
          monthlyPrice: 19,
          annualPrice: 200,
          features: {
            'family_dashboard': true,
            'net_worth_tracking': true,
            'linda_ai_assistant': '+$10/mo',
            'budget_tools': false,
            'education_center': false,
            'secure_vault': false,
            'family_onboarding': false,
            'concierge_services': false,
            'ai_family_assistant': false,
            'white_label': false,
            'users_included': '2 family members'
          }
        },
        {
          name: 'Pro',
          monthlyPrice: 49,
          annualPrice: 500,
          isPopular: true,
          features: {
            'family_dashboard': true,
            'net_worth_tracking': true,
            'linda_ai_assistant': true,
            'budget_tools': true,
            'education_center': true,
            'secure_vault': true,
            'family_onboarding': true,
            'concierge_services': false,
            'ai_family_assistant': false,
            'white_label': false,
            'users_included': '6 family members'
          }
        },
        {
          name: 'Premium',
          monthlyPrice: 99,
          annualPrice: 1000,
          features: {
            'family_dashboard': true,
            'net_worth_tracking': true,
            'linda_ai_assistant': true,
            'budget_tools': true,
            'education_center': true,
            'secure_vault': true,
            'family_onboarding': true,
            'concierge_services': true,
            'ai_family_assistant': true,
            'white_label': true,
            'users_included': '15 family members'
          }
        }
      ],
      addOns: [
        { name: 'AI Scheduling Concierge (Linda)', price: 10, description: 'AI scheduling concierge assistant (VOIP/SMS)' },
        { name: 'Premium Concierge', price: 25, description: 'Enhanced concierge and lifestyle services' },
        { name: 'Investment Tracking Pro', price: 15, description: 'Advanced investment performance tracking' },
        { name: 'Tax Optimization Suite', price: 20, description: 'Advanced tax planning and optimization tools' }
      ]
    }
  };

  const currentPersona = personaPricingData[selectedPersona];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getFeatureIcon = (hasFeature: boolean | string) => {
    if (typeof hasFeature === 'string') {
      return <span className="text-sm text-muted-foreground">{hasFeature}</span>;
    }
    return hasFeature ? (
      <Check className="h-4 w-4 text-emerald-600" />
    ) : (
      <X className="h-4 w-4 text-gray-400" />
    );
  };

  return (
    <div className="space-y-8">
      {/* Persona Selector */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          Boutique Family Office Platform
        </h1>
        <p className="text-xl text-muted-foreground">
          Choose your professional pricing tier
        </p>
        
        <Tabs value={selectedPersona} onValueChange={setSelectedPersona}>
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full">
            <TabsTrigger value="advisor" className="text-xs">👨‍💼 Advisors</TabsTrigger>
            <TabsTrigger value="cpa" className="text-xs">🧮 CPAs</TabsTrigger>
            <TabsTrigger value="attorney" className="text-xs">⚖️ Attorneys</TabsTrigger>
            <TabsTrigger value="insurance" className="text-xs">🛡️ Insurance</TabsTrigger>
            <TabsTrigger value="coach" className="text-xs">🎯 Coaches</TabsTrigger>
            <TabsTrigger value="industry_org" className="text-xs">🏛️ Orgs</TabsTrigger>
            <TabsTrigger value="client" className="text-xs">👨‍👩‍👧‍👦 Families</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-3 bg-muted p-1 rounded-lg">
          <Button
            variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
            onClick={() => setBillingCycle('monthly')}
            size="sm"
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === 'annual' ? 'default' : 'ghost'}
            onClick={() => setBillingCycle('annual')}
            size="sm"
          >
            Annual
            <Badge variant="secondary" className="ml-2">Save 15%</Badge>
          </Button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {currentPersona.tiers.map((tier, index) => (
          <Card 
            key={tier.name} 
            className={`relative ${tier.isPopular ? 'border-primary shadow-lg scale-105' : ''}`}
          >
            {tier.isPopular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1">
                  <Star className="h-3 w-3 mr-1" />
                  Best Value
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              <div className="text-4xl font-bold">
                {formatPrice(billingCycle === 'annual' ? tier.annualPrice : tier.monthlyPrice)}
                <span className="text-lg font-normal text-muted-foreground">
                  /{billingCycle === 'annual' ? 'year' : 'month'}
                </span>
              </div>
              {billingCycle === 'annual' && (
                <p className="text-sm text-muted-foreground">
                  {formatPrice(tier.annualPrice / 12)}/month billed annually
                </p>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              <PricingFeatureTooltips 
                features={tier.features} 
                persona={selectedPersona}
                getFeatureIcon={getFeatureIcon}
              />
              
              <div className="pt-4">
                <PricingCTAButtons 
                  tier={tier.name}
                  persona={selectedPersona}
                  price={billingCycle === 'annual' ? tier.annualPrice : tier.monthlyPrice}
                  billingCycle={billingCycle}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add-ons Section */}
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              À La Carte Add-ons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {currentPersona.addOns.map((addon, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold">{addon.name}</h4>
                  <p className="text-sm text-muted-foreground">{addon.description}</p>
                  <div className="text-lg font-bold text-primary">
                    +{formatPrice(addon.price)}/month
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Persona Description */}
      <div className="text-center max-w-3xl mx-auto">
        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-secondary/5">
          <CardContent className="pt-6">
            <div className="text-6xl mb-4">{currentPersona.icon}</div>
            <h3 className="text-2xl font-bold mb-2">{currentPersona.persona}</h3>
            <p className="text-lg text-muted-foreground">{currentPersona.description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
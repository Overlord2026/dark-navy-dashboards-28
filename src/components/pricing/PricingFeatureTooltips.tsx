import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PricingFeatureTooltipsProps {
  features: Record<string, boolean | string>;
  persona: string;
  getFeatureIcon: (hasFeature: boolean | string) => React.ReactNode;
}

export const PricingFeatureTooltips = ({ features, persona, getFeatureIcon }: PricingFeatureTooltipsProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const featureDescriptions = {
    // Universal Features
    'branded_portal': {
      name: 'Branded Client Portal',
      description: 'Fully customizable client portal with your branding, logo, and color scheme.',
      tooltip: '🏆 SWAG Feature: Premium white-label portal that builds your brand authority'
    },
    'crm_pipeline': {
      name: 'CRM & Pipeline',
      description: 'Complete customer relationship management with visual sales pipeline.',
      tooltip: 'Track leads from first contact to close with automated follow-up sequences'
    },
    'document_vault': {
      name: 'Document Vault & Secure Messaging',
      description: 'Bank-grade encrypted document storage with secure client messaging.',
      tooltip: 'Military-grade encryption for sensitive financial documents and communications'
    },
    'training_center': {
      name: 'Training/Resource Center',
      description: 'Comprehensive training materials, best practices, and ongoing education.',
      tooltip: 'Stay current with industry trends and platform updates'
    },
    'community_access': {
      name: 'Community Access',
      description: 'Access to exclusive professional community and networking events.',
      tooltip: 'Connect with elite professionals in your field for referrals and collaboration'
    },

    // Advisor Features
    'lead_engine': {
      name: 'Lead-to-Sales Engine',
      description: 'Integrated funnel management, campaign dashboard, and automated lead nurturing.',
      tooltip: '🏆 SWAG Feature: AI-powered lead scoring with 300% higher conversion rates'
    },
    'automated_meetings': {
      name: 'Automated Meetings',
      description: 'Zoom, Google Calendar, and phone integration with smart scheduling.',
      tooltip: 'One-click meeting setup with automatic follow-up and recording transcription'
    },
    'advertising_dashboard': {
      name: 'Advertising Campaigns Dashboard',
      description: 'Track ROI across all marketing channels with advanced attribution.',
      tooltip: 'See which campaigns generate your highest-value clients'
    },
    'portfolio_analytics': {
      name: 'Advanced Portfolio Analytics',
      description: 'Institutional-grade portfolio analysis and performance reporting.',
      tooltip: 'Impress prospects with sophisticated analytics typically reserved for large firms'
    },
    'compliance_center': {
      name: 'Compliance & RMD Center',
      description: 'Automated ADV filing, state compliance, and RMD calculations.',
      tooltip: 'Never miss a compliance deadline with automated alerts and filing assistance'
    },
    'swag_scoring': {
      name: 'SWAG Lead Scoring Engine',
      description: 'Proprietary high-net-worth scoring model - "Got SWAG?" algorithm.',
      tooltip: '🎯 Exclusive: AI identifies prospects in the top 20% wealth bracket with 85% accuracy'
    },
    'vip_marketplace': {
      name: 'VIP Marketplace Profile',
      description: 'Premium listing in our exclusive professional marketplace.',
      tooltip: '👑 VIP Status: Get matched with high-value clients seeking your expertise'
    },
    'ai_copilot': {
      name: 'AI Copilot',
      description: 'AI assistant for emails, reports, and client communication.',
      tooltip: 'Generate professional proposals and follow-ups in seconds, not hours'
    },
    'white_label': {
      name: 'White-Label Branding',
      description: 'Complete platform customization with your firm\'s branding.',
      tooltip: 'Present the platform as your own proprietary technology'
    },

    // CPA Features
    'client_portal': {
      name: 'Client Portal',
      description: 'Secure portal for tax document collection and client communication.',
      tooltip: 'Streamline tax season with automated document requests and secure upload'
    },
    'ce_tracking': {
      name: 'CE/CLE Tracking',
      description: 'Automated continuing education credit tracking and compliance alerts.',
      tooltip: 'Never miss CE deadlines with smart reminders and automated record keeping'
    },
    'tax_analysis': {
      name: 'Advanced Tax Analysis',
      description: 'Sophisticated tax planning tools and scenario modeling.',
      tooltip: 'Identify tax-saving opportunities with advanced projection modeling'
    },
    'workflow_automation': {
      name: 'Workflow Automation',
      description: 'Automated client onboarding and document processing workflows.',
      tooltip: 'Reduce manual work by 70% with intelligent process automation'
    },
    'compliance_monitoring': {
      name: 'Real-time Compliance Monitoring',
      description: 'Continuous monitoring of tax law changes and compliance requirements.',
      tooltip: 'Stay ahead of regulatory changes with AI-powered compliance monitoring'
    },
    'family_office_integration': {
      name: 'Family Office Integration',
      description: 'Seamless integration with family office advisory services.',
      tooltip: 'Collaborate with wealth advisors for comprehensive client service'
    },
    'ai_tax_assistant': {
      name: 'AI Tax Assistant',
      description: 'AI-powered tax research and planning recommendations.',
      tooltip: 'Get instant answers to complex tax questions with AI research assistant'
    },

    // Attorney Features
    'cle_tracking': {
      name: 'CLE Tracking',
      description: 'Continuing Legal Education credit tracking and bar compliance.',
      tooltip: 'Automated CLE tracking with state-specific requirements'
    },
    'legal_crm': {
      name: 'Legal CRM',
      description: 'Case management and client relationship tracking for legal practices.',
      tooltip: 'Track cases, deadlines, and billable hours in one integrated system'
    },
    'document_automation': {
      name: 'Document Automation',
      description: 'Automated legal document generation and template management.',
      tooltip: 'Generate complex legal documents in minutes with smart templates'
    },
    'event_scheduling': {
      name: 'Event & Court Scheduling',
      description: 'Integration with court calendars and legal event management.',
      tooltip: 'Never miss a court date with automated calendar synchronization'
    },
    'compliance_alerts': {
      name: 'Legal Compliance Alerts',
      description: 'Automated alerts for legal deadlines and compliance requirements.',
      tooltip: 'Protect your practice with proactive compliance monitoring'
    },
    'ai_legal_assistant': {
      name: 'AI Legal Research Assistant',
      description: 'AI-powered legal research and brief generation.',
      tooltip: 'Accelerate legal research with AI that understands complex legal concepts'
    },

    // Insurance Features
    'agent_portal': {
      name: 'Agent Portal',
      description: 'Centralized portal for insurance agents and team management.',
      tooltip: 'Manage your agency team with role-based access and performance tracking'
    },
    'commission_tracking': {
      name: 'Commission Tracking',
      description: 'Automated commission calculations and payout management.',
      tooltip: 'Real-time commission tracking with automated reconciliation'
    },
    'marketing_dashboard': {
      name: 'Marketing Dashboard',
      description: 'Track marketing campaigns and lead generation performance.',
      tooltip: 'Optimize your marketing spend with detailed ROI analytics'
    },
    'event_management': {
      name: 'Event Management',
      description: 'Plan and manage client events, seminars, and educational workshops.',
      tooltip: 'Host professional events that generate qualified leads'
    },
    'ai_sales_assistant': {
      name: 'AI Sales Assistant',
      description: 'AI-powered sales coaching and proposal generation.',
      tooltip: 'Get personalized sales coaching and automated proposal creation'
    },

    // Coach Features
    'practice_dashboard': {
      name: 'Practice Dashboard',
      description: 'Comprehensive view of your coaching practice performance.',
      tooltip: 'Track client progress, revenue, and practice growth metrics'
    },
    'client_management': {
      name: 'Client Management',
      description: 'Tools for managing coaching relationships and client progress.',
      tooltip: 'Track client goals, progress, and engagement across all programs'
    },
    'meeting_tools': {
      name: 'Advanced Meeting Tools',
      description: 'Video coaching, session recording, and progress tracking.',
      tooltip: 'Professional coaching tools with session analytics and client insights'
    },
    'curriculum_manager': {
      name: 'Curriculum Manager',
      description: 'Create and manage coaching programs and educational content.',
      tooltip: 'Build scalable coaching programs with modular content delivery'
    },
    'client_engagement': {
      name: 'Client Engagement Suite',
      description: 'Tools for maintaining ongoing client engagement and retention.',
      tooltip: 'Automated check-ins and engagement campaigns that build stronger relationships'
    },
    'ai_coaching_assistant': {
      name: 'AI Coaching Assistant',
      description: 'AI-powered coaching insights and program recommendations.',
      tooltip: 'Get AI-driven insights to improve coaching effectiveness and client outcomes'
    },

    // Industry Org Features
    'member_management': {
      name: 'Member Management',
      description: 'Comprehensive member database and engagement tracking.',
      tooltip: 'Manage member lifecycle from onboarding to renewal with automated workflows'
    },
    'event_platform': {
      name: 'Event Platform',
      description: 'Virtual and in-person event management with registration and payments.',
      tooltip: 'Host professional conferences and networking events with integrated registration'
    },
    'marketplace_access': {
      name: 'Marketplace Access',
      description: 'Featured placement in professional services marketplace.',
      tooltip: 'Connect your members with qualified service providers and opportunities'
    },
    'bulk_onboarding': {
      name: 'Bulk Member Onboarding',
      description: 'Streamlined onboarding process for large member organizations.',
      tooltip: 'Efficiently onboard hundreds of members with automated workflows'
    },
    'analytics_dashboard': {
      name: 'Advanced Analytics',
      description: 'Deep insights into member engagement and organizational performance.',
      tooltip: 'Data-driven insights to improve member satisfaction and retention'
    },
    'sponsor_tools': {
      name: 'Sponsor Management Tools',
      description: 'Manage sponsors, partnerships, and revenue opportunities.',
      tooltip: 'Maximize sponsor value with detailed engagement analytics and custom packages'
    },
    'ai_admin_assistant': {
      name: 'AI Admin Assistant',
      description: 'AI-powered administrative assistance and member support.',
      tooltip: 'Automate routine administrative tasks and provide 24/7 member support'
    },

    // Client Features
    'family_dashboard': {
      name: 'Family Dashboard',
      description: 'Centralized view of all family financial information and activities.',
      tooltip: 'See your entire family\'s financial picture in one comprehensive dashboard'
    },
    'net_worth_tracking': {
      name: 'Net Worth Tracking',
      description: 'Real-time net worth calculation and trend analysis.',
      tooltip: 'Track your wealth growth with automated asset valuation and reporting'
    },
    'budget_tools': {
      name: 'Advanced Budget Tools',
      description: 'Sophisticated budgeting and expense management for high-net-worth families.',
      tooltip: 'Family-scale budgeting with category intelligence and spending optimization'
    },
    'education_center': {
      name: 'Financial Education Center',
      description: 'Curated financial education content for family members.',
      tooltip: 'Age-appropriate financial education for all family members'
    },
    'secure_vault': {
      name: 'Secure Family Vault',
      description: 'Ultra-secure storage for important family documents and records.',
      tooltip: 'Military-grade security for wills, trusts, insurance policies, and other critical documents'
    },
    'family_onboarding': {
      name: 'Family Onboarding Suite',
      description: 'Comprehensive onboarding process for multi-generational families.',
      tooltip: 'Streamlined onboarding that accommodates multiple family members and entities'
    },
    'concierge_services': {
      name: 'Premium Concierge',
      description: 'White-glove concierge services for high-net-worth families.',
      tooltip: 'Personal assistance with travel, events, bill pay, and lifestyle management'
    },
    'ai_family_assistant': {
      name: 'AI Family Assistant',
      description: 'AI-powered family office assistant for financial planning and management.',
      tooltip: 'Intelligent assistant that learns your family\'s preferences and automates routine tasks'
    },
    'users_included': {
      name: 'Users Included',
      description: 'Number of user seats included in this plan.',
      tooltip: 'Additional users can be added for an extra monthly fee'
    },
    'linda_ai_assistant': {
      name: 'Linda Voice AI Meeting Assistant (VOIP/SMS)',
      description: 'Linda is your AI-powered voice assistant for meeting confirmations, reschedules, reminders, and post-meeting follow-up calls or SMS—fully branded for your practice.',
      tooltip: '🎙️ Linda calls and texts your clients automatically to confirm meetings, send reminders, and follow up—saving you hours every week!'
    }
  };

  const getFeatureName = (key: string) => {
    return featureDescriptions[key]?.name || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getFeatureDescription = (key: string) => {
    return featureDescriptions[key]?.description || 'Feature description not available.';
  };

  const getFeatureTooltip = (key: string) => {
    return featureDescriptions[key]?.tooltip || '';
  };

  const coreFeatures = Object.entries(features).filter(([key]) => 
    ['branded_portal', 'crm_pipeline', 'document_vault', 'training_center', 'community_access', 'client_portal', 'family_dashboard', 'agent_portal', 'practice_dashboard', 'member_management', 'linda_ai_assistant'].includes(key)
  );

  const advancedFeatures = Object.entries(features).filter(([key]) => 
    !['branded_portal', 'crm_pipeline', 'document_vault', 'training_center', 'community_access', 'client_portal', 'family_dashboard', 'agent_portal', 'practice_dashboard', 'member_management', 'linda_ai_assistant', 'users_included'].includes(key)
  );

  const userInfo = Object.entries(features).filter(([key]) => key === 'users_included');

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Core Features */}
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-3">Core Features</h4>
          <div className="space-y-2">
            {coreFeatures.map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 cursor-help">
                      <span className="text-sm">{getFeatureName(key)}</span>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-medium">{getFeatureName(key)}</p>
                      <p className="text-xs">{getFeatureDescription(key)}</p>
                      {getFeatureTooltip(key) && (
                        <p className="text-xs text-amber-200 font-medium">{getFeatureTooltip(key)}</p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
                {getFeatureIcon(value)}
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Features */}
        {advancedFeatures.length > 0 && (
          <div>
            <Collapsible
              open={expandedSections.has('advanced')}
              onOpenChange={() => toggleSection('advanced')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <h4 className="font-semibold text-sm text-muted-foreground">Advanced Features</h4>
                  {expandedSections.has('advanced') ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-3">
                {advancedFeatures.map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-help">
                          <span className="text-sm">{getFeatureName(key)}</span>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <div className="space-y-1">
                          <p className="font-medium">{getFeatureName(key)}</p>
                          <p className="text-xs">{getFeatureDescription(key)}</p>
                          {getFeatureTooltip(key) && (
                            <p className="text-xs text-amber-200 font-medium">{getFeatureTooltip(key)}</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                    {getFeatureIcon(value)}
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        {/* User Information */}
        {userInfo.length > 0 && (
          <div className="pt-3 border-t">
            {userInfo.map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium">{getFeatureName(key)}</span>
                {getFeatureIcon(value)}
              </div>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
import React from 'react';
import { ProSegment } from '@/lib/persona';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProHeroProps {
  segment: ProSegment;
}

const SEGMENT_CONFIG = {
  'advisor': {
    title: 'Financial Advisors',
    subtitle: 'Comprehensive wealth management platform',
    description: 'Streamline client relationships, portfolio management, and compliance with our integrated advisor toolkit.',
    badge: 'Financial Services',
    cta: 'Join Advisor Network'
  },
  'cpa': {
    title: 'CPAs & Tax Professionals', 
    subtitle: 'Tax planning and compliance made simple',
    description: 'Automate tax workflows, collaborate with clients, and stay compliant with our accounting platform.',
    badge: 'Financial Services',
    cta: 'Join CPA Network'
  },
  'attorney-estate': {
    title: 'Estate Planning Attorneys',
    subtitle: 'Estate planning workflow automation',
    description: 'Document assembly, client collaboration, and trust administration tools designed for estate attorneys.',
    badge: 'Legal Services', 
    cta: 'Join Legal Network'
  },
  'attorney-litigation': {
    title: 'Litigation Attorneys',
    subtitle: 'Case management and client communication',
    description: 'Streamline case tracking, document management, and client updates for litigation practices.',
    badge: 'Legal Services',
    cta: 'Join Legal Network'
  },
  'realtor': {
    title: 'Real Estate Professionals',
    subtitle: 'Transaction and relationship management',
    description: 'Lead generation, transaction pipeline, and client relationship tools for real estate professionals.',
    badge: 'Real Estate',
    cta: 'Join Realtor Network'
  },
  'insurance-annuity': {
    title: 'Annuity Insurance Specialists',
    subtitle: 'Retirement income planning solutions',
    description: 'Annuity illustrations, client education, and sales support tools for insurance professionals.',
    badge: 'Insurance',
    cta: 'Join Insurance Network'
  },
  'insurance-life': {
    title: 'Life Insurance Agents',
    subtitle: 'Life insurance sales and service',
    description: 'Lead generation, needs analysis, and policy management tools for life insurance agents.',
    badge: 'Insurance',
    cta: 'Join Insurance Network'
  },
  'insurance-medicare': {
    title: 'Medicare Insurance Agents',
    subtitle: 'Medicare enrollment and education',
    description: 'Medicare plan comparison, enrollment tools, and compliance tracking for Medicare specialists.',
    badge: 'Insurance',
    cta: 'Join Medicare Network'
  },
  'insurance-ltc': {
    title: 'Long-Term Care Specialists',
    subtitle: 'LTC planning and protection',
    description: 'Long-term care needs assessment, product comparison, and client education tools.',
    badge: 'Insurance',
    cta: 'Join LTC Network'
  },
  'healthcare-provider': {
    title: 'Healthcare Providers',
    subtitle: 'Patient financial wellness',
    description: 'Help patients manage healthcare costs and financial planning for medical professionals.',
    badge: 'Healthcare',
    cta: 'Join Provider Network'
  },
  'influencer': {
    title: 'Financial Influencers',
    subtitle: 'Content creation and audience engagement',
    description: 'Content tools, audience insights, and collaboration opportunities for financial influencers.',
    badge: 'Content Creator',
    cta: 'Join Influencer Program'
  }
};

export function ProHero({ segment }: ProHeroProps) {
  const config = SEGMENT_CONFIG[segment] || SEGMENT_CONFIG['advisor'];

  return (
    <div className="text-center space-y-6">
      <Badge variant="secondary" className="mb-4">{config.badge}</Badge>
      <h1 className="text-4xl font-bold text-foreground">
        {config.title}
      </h1>
      <h2 className="text-xl text-primary font-semibold">
        {config.subtitle}
      </h2>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
        {config.description}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg">{config.cta}</Button>
        <Button variant="outline" size="lg">View Demo</Button>
      </div>
    </div>
  );
}
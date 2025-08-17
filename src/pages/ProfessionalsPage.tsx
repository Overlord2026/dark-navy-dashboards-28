import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProfessionalSegment } from '@/lib/persona';
import { usePersonaStore } from '@/store/personaStore';

const ProfessionalsLanding = () => {
  const { setPersona } = usePersonaStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Professional Partners
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our network of trusted professionals serving high-net-worth families and businesses.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              segment: ProfessionalSegment.ADVISOR,
              title: 'Financial Advisors',
              description: 'Comprehensive wealth management and investment advisory',
              category: 'Financial Services'
            },
            {
              segment: ProfessionalSegment.CPA,
              title: 'CPAs & Tax Professionals',
              description: 'Tax planning, compliance, and accounting services',
              category: 'Financial Services'
            },
            {
              segment: ProfessionalSegment.ATTORNEY,
              title: 'Estate Attorneys',
              description: 'Estate planning, trusts, and legal structures',
              category: 'Financial Services'
            },
            {
              segment: ProfessionalSegment.INSURANCE,
              title: 'Insurance Agents',
              description: 'Life, disability, and property insurance solutions',
              category: 'Insurance & Risk'
            },
            {
              segment: ProfessionalSegment.BANK_TRUST,
              title: 'Bank & Trust Officers',
              description: 'Private banking and trust administration',
              category: 'Banking'
            },
            {
              segment: ProfessionalSegment.HEALTHCARE_INFLUENCER,
              title: 'Healthcare Influencers',
              description: 'Medical thought leaders and content creators',
              category: 'Healthcare'
            },
            {
              segment: ProfessionalSegment.HEALTHCARE_CLINIC,
              title: 'Healthcare Clinics',
              description: 'Medical practices and healthcare facilities',
              category: 'Healthcare'
            },
            {
              segment: ProfessionalSegment.HEALTHCARE_NAVIGATOR,
              title: 'Healthcare Navigators',
              description: 'Patient advocacy and healthcare coordination',
              category: 'Healthcare'
            },
            {
              segment: ProfessionalSegment.PHARMACY,
              title: 'Pharmacy Partners',
              description: 'Specialized pharmacy services and consultations',
              category: 'Healthcare'
            },
            {
              segment: ProfessionalSegment.REALTOR,
              title: 'Real Estate Professionals',
              description: 'Luxury real estate and property management',
              category: 'Real Estate'
            }
          ].map((professional) => (
            <div
              key={professional.segment}
              className="p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="mb-3">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  {professional.category}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {professional.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {professional.description}
              </p>
              <button
                className="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
                onClick={() => setPersona('pro', professional.segment)}
              >
                Learn More →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProfessionalSegmentPage = ({ segment }: { segment: ProfessionalSegment }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          {segment.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Portal
        </h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-muted-foreground">
            Professional resources and tools for {segment.replace(/_/g, ' ')} professionals.
          </p>
          <p>
            This page will contain specific content, tools, and resources designed for this professional segment.
            Content will be dynamically loaded based on the selected persona and segment.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ProfessionalsPage = () => {
  return (
    <Routes>
      <Route index element={<ProfessionalsLanding />} />
      <Route path="advisor" element={<ProfessionalSegmentPage segment={ProfessionalSegment.ADVISOR} />} />
      <Route path="cpa" element={<ProfessionalSegmentPage segment={ProfessionalSegment.CPA} />} />
      <Route path="attorney" element={<ProfessionalSegmentPage segment={ProfessionalSegment.ATTORNEY} />} />
      <Route path="insurance" element={<ProfessionalSegmentPage segment={ProfessionalSegment.INSURANCE} />} />
      <Route path="bank-trust" element={<ProfessionalSegmentPage segment={ProfessionalSegment.BANK_TRUST} />} />
      <Route path="healthcare-influencer" element={<ProfessionalSegmentPage segment={ProfessionalSegment.HEALTHCARE_INFLUENCER} />} />
      <Route path="healthcare-clinic" element={<ProfessionalSegmentPage segment={ProfessionalSegment.HEALTHCARE_CLINIC} />} />
      <Route path="healthcare-navigator" element={<ProfessionalSegmentPage segment={ProfessionalSegment.HEALTHCARE_NAVIGATOR} />} />
      <Route path="pharmacy" element={<ProfessionalSegmentPage segment={ProfessionalSegment.PHARMACY} />} />
      <Route path="realtor" element={<ProfessionalSegmentPage segment={ProfessionalSegment.REALTOR} />} />
    </Routes>
  );
};
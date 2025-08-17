import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProSegment } from '@/lib/persona';
import { usePersonaStore } from '@/store/personaStore';
import { Persona } from '@/lib/persona';

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
              segment: 'advisor' as ProSegment,
              title: 'Financial Advisors',
              description: 'Comprehensive wealth management and investment advisory',
              category: 'Financial Services'
            },
            {
              segment: 'cpa' as ProSegment,
              title: 'CPAs & Tax Professionals',
              description: 'Tax planning, compliance, and accounting services',
              category: 'Financial Services'
            },
            {
              segment: 'attorney-estate' as ProSegment,
              title: 'Estate Attorneys',
              description: 'Estate planning, trusts, and legal structures',
              category: 'Legal Services'
            },
            {
              segment: 'insurance-life' as ProSegment,
              title: 'Life Insurance Agents',
              description: 'Life insurance and protection planning',
              category: 'Insurance'
            },
            {
              segment: 'insurance-medicare' as ProSegment,
              title: 'Medicare Specialists',
              description: 'Medicare enrollment and education',
              category: 'Insurance'
            },
            {
              segment: 'healthcare-provider' as ProSegment,
              title: 'Healthcare Providers',
              description: 'Medical professionals and patient financial wellness',
              category: 'Healthcare'
            },
            {
              segment: 'influencer' as ProSegment,
              title: 'Financial Influencers',
              description: 'Content creators and financial educators',
              category: 'Content'
            },
            {
              segment: 'realtor' as ProSegment,
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
                onClick={() => setPersona(Persona.PROFESSIONAL, professional.segment)}
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

const ProfessionalSegmentPage = ({ segment }: { segment: ProSegment }) => {
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
      <Route path="advisor" element={<ProfessionalSegmentPage segment={'advisor' as ProSegment} />} />
      <Route path="cpa" element={<ProfessionalSegmentPage segment={'cpa' as ProSegment} />} />
      <Route path="attorney-estate" element={<ProfessionalSegmentPage segment={'attorney-estate' as ProSegment} />} />
      <Route path="attorney-litigation" element={<ProfessionalSegmentPage segment={'attorney-litigation' as ProSegment} />} />
      <Route path="insurance-life" element={<ProfessionalSegmentPage segment={'insurance-life' as ProSegment} />} />
      <Route path="insurance-medicare" element={<ProfessionalSegmentPage segment={'insurance-medicare' as ProSegment} />} />
      <Route path="healthcare-provider" element={<ProfessionalSegmentPage segment={'healthcare-provider' as ProSegment} />} />
      <Route path="influencer" element={<ProfessionalSegmentPage segment={'influencer' as ProSegment} />} />
      <Route path="realtor" element={<ProfessionalSegmentPage segment={'realtor' as ProSegment} />} />
    </Routes>
  );
};
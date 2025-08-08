// Placeholder components for Accountant Deck - to be fully implemented
import React from 'react';

interface SlideProps {
  presentationMode?: boolean;
}

export const AccountantOpportunitySlide: React.FC<SlideProps> = () => (
  <div className="p-16 text-center">
    <h2 className="text-3xl font-bold mb-4">The Opportunity</h2>
    <p>Expanding from compliance to proactive wealth & retirement planning</p>
  </div>
);

export const AccountantValuePropSlide: React.FC<SlideProps> = () => (
  <div className="p-16 text-center">
    <h2 className="text-3xl font-bold mb-4">Your New Value Proposition</h2>
    <p>Become your clients' most trusted advisor</p>
  </div>
);

export const AccountantCoreToolsSlide: React.FC<SlideProps> = () => (
  <div className="p-16 text-center">
    <h2 className="text-3xl font-bold mb-4">Core Tools for Client Success</h2>
    <p>SWAG™ Retirement Roadmap with stress-testing and optimization</p>
  </div>
);

export const AccountantTaxToolsSlide: React.FC<SlideProps> = () => (
  <div className="p-16 text-center">
    <h2 className="text-3xl font-bold mb-4">Premium Tax Planning Tools</h2>
    <p>Multi-year Roth conversions, state residency analysis, charitable strategies</p>
  </div>
);

export const AccountantClientPortalSlide: React.FC<SlideProps> = () => (
  <div className="p-16 text-center">
    <h2 className="text-3xl font-bold mb-4">Client Portal Experience</h2>
    <p>White-labeled portal for comprehensive client management</p>
  </div>
);

export const AccountantPracticeGrowthSlide: React.FC<SlideProps> = () => (
  <div className="p-16 text-center">
    <h2 className="text-3xl font-bold mb-4">Practice Growth Tools</h2>
    <p>Lead generation, marketing automation, and referral tracking</p>
  </div>
);

export const AccountantComplianceSlide: React.FC<SlideProps> = () => (
  <div className="p-16 text-center">
    <h2 className="text-3xl font-bold mb-4">Compliance & Efficiency</h2>
    <p>CE credits, secure vault, automated reminders, RLS compliance</p>
  </div>
);

export const AccountantRevenueModelSlide: React.FC<SlideProps> = () => (
  <div className="p-16 text-center">
    <h2 className="text-3xl font-bold mb-4">Revenue Model</h2>
    <p>Premium packages, subscriptions, cross-referrals</p>
  </div>
);

export const AccountantCaseStudySlide: React.FC<SlideProps> = () => (
  <div className="p-16 text-center">
    <h2 className="text-3xl font-bold mb-4">Case Study</h2>
    <p>32% revenue growth, 98% client retention with BFO platform</p>
  </div>
);

export const AccountantCallToActionSlide: React.FC<SlideProps> = () => (
  <div className="p-16 text-center">
    <h2 className="text-3xl font-bold mb-4">Ready to Transform?</h2>
    <p>Steps to onboard, pricing tiers, and booking links</p>
  </div>
);
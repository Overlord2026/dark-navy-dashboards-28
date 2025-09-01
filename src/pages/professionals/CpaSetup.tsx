import React from 'react';
import { Helmet } from 'react-helmet-async';
import MinimalProfessionalSignup from '@/components/onboarding/MinimalProfessionalSignup';

export default function CpaSetup() {
  return (
    <>
      <Helmet>
        <title>CPA Setup - Get Started</title>
        <meta name="description" content="Set up your CPA workspace in minutes" />
      </Helmet>
      
      <div className="min-h-screen bg-bfo-black p-4">
        <div className="max-w-4xl mx-auto pt-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Welcome, CPA</h1>
            <p className="text-white/80 max-w-2xl mx-auto">
              Streamline your accounting practice with automated workflows, client management, and compliance tools.
            </p>
          </div>
          
          <MinimalProfessionalSignup role="accountant" />
        </div>
      </div>
    </>
  );
}
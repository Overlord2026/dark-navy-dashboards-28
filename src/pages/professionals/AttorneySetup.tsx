import React from 'react';
import { Helmet } from 'react-helmet-async';
import MinimalProfessionalSignup from '@/components/onboarding/MinimalProfessionalSignup';

export default function AttorneySetup() {
  return (
    <>
      <Helmet>
        <title>Attorney Setup - Get Started</title>
        <meta name="description" content="Set up your attorney workspace in minutes" />
      </Helmet>
      
      <div className="min-h-screen bg-bfo-black p-4">
        <div className="max-w-4xl mx-auto pt-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Welcome, Attorney</h1>
            <p className="text-white/80 max-w-2xl mx-auto">
              Manage your legal practice with secure document handling, client communication, and case management tools.
            </p>
          </div>
          
          <MinimalProfessionalSignup role="attorney" />
        </div>
      </div>
    </>
  );
}
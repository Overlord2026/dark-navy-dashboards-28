import React from 'react';
import { TrustExplainer } from '@/components/discover/TrustExplainer';
import { PatentFooter } from '@/components/ui/PatentFooter';

export const HowItWorks: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            How It Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with human-centered design 
            to create a trustworthy environment for your financial decisions.
          </p>
        </div>
        
        <TrustExplainer />
      </div>
      
      <PatentFooter />
    </div>
  );
};
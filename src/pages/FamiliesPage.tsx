import React from 'react';
import { FamilyHero } from '@/components/families/FamilyHero';

const FamiliesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <FamilyHero />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Family Office Solutions
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive wealth management tools and services for your family's financial success.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FamiliesPage;
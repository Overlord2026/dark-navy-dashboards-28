import React, { useState } from 'react';
import { FamilyHero } from '@/components/families/FamilyHero';
import { FamilySegmentSelector } from '@/components/families/FamilySegmentSelector';
import { FamilyQuickActions } from '@/components/families/FamilyQuickActions';
import { FamilyCardsGrid } from '@/components/families/FamilyCardsGrid';
import { FamilySegment } from '@/data/familiesPricingTiers';

const FamiliesPage = () => {
  const [selectedSegment, setSelectedSegment] = useState<FamilySegment>('Aspiring');

  return (
    <div className="min-h-screen bg-background">
      <FamilyHero />
      
      <div className="container mx-auto px-4 py-8 space-y-12">
        <FamilySegmentSelector 
          selectedSegment={selectedSegment}
          onSegmentChange={setSelectedSegment}
        />
        
        <FamilyQuickActions selectedSegment={selectedSegment} />
        
        <FamilyCardsGrid selectedSegment={selectedSegment} />
      </div>
    </div>
  );
};

export default FamiliesPage;
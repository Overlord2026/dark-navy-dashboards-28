import React from 'react';
import { EducationalResources } from '@/components/EducationalResources';
import { CuratedEducationCenter } from './CuratedEducationCenter';
import { Separator } from '@/components/ui/separator';

interface EducationalGuidesSectionProps {
  searchQuery?: string;
  category?: string;
}

export function EducationalGuidesSection({ searchQuery = '', category = 'all' }: EducationalGuidesSectionProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Educational Guides & Resources</h2>
        <p className="text-muted-foreground">
          Comprehensive guides covering retirement, tax planning, estate planning, and more
        </p>
      </div>
      
      {/* Curated Content Section */}
      <CuratedEducationCenter />
      
      <Separator className="my-8" />
      
      {/* All Resources Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">All Resources</h3>
        <EducationalResources />
      </div>
    </div>
  );
}
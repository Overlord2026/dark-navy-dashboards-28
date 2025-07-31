import React from 'react';
import { EducationalResources } from '@/components/EducationalResources';

interface EducationalGuidesSectionProps {
  searchQuery?: string;
  category?: string;
}

export function EducationalGuidesSection({ searchQuery = '', category = 'all' }: EducationalGuidesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Educational Guides & Resources</h2>
        <p className="text-muted-foreground">
          Comprehensive guides covering retirement, tax planning, estate planning, and more
        </p>
      </div>
      <EducationalResources />
    </div>
  );
}
import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { EnhancedResourceCenter } from '@/components/education/EnhancedResourceCenter';

export default function EducationPage() {
  return (
    <ThreeColumnLayout 
      title="Education Center" 
      activeMainItem="education"
      activeSecondaryItem="all"
      secondaryMenuItems={[]}
    >
      <div className="space-y-6 px-1 pb-8">
        <EnhancedResourceCenter 
          showCategories={['All', 'Tax', 'Retirement', 'Estate', 'Investment', 'Insurance', 'Planning', 'Business']}
          title="Financial Education Center"
          description="Comprehensive guides, courses, and resources to enhance your financial knowledge and planning skills"
        />
      </div>
    </ThreeColumnLayout>
  );
}
import React from 'react';
import { UnderConstructionPage } from '@/components/ui/UnderConstructionPage';

export function EducationVideosPage() {
  return (
    <UnderConstructionPage
      featureName="Education Video Library"
      expectedDate="Q2 2024"
      description="Video tutorials and webinars covering all aspects of wealth management and financial planning."
      roadmapItems={[
        'HD video tutorials with transcripts',
        'Interactive video quizzes',
        'Expert-led webinar series',
        'Personal finance masterclasses',
        'Mobile-optimized video player'
      ]}
      showNotificationSignup={true}
    />
  );
}
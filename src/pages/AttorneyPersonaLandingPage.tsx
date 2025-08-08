import React from 'react';
import { AttorneyPersonaLanding } from '@/components/attorney/AttorneyPersonaLanding';

export default function AttorneyPersonaLandingPage() {
  const handleExploreFeatures = () => {
    // Scroll to features or show feature details
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return <AttorneyPersonaLanding onExploreFeatures={handleExploreFeatures} />;
}
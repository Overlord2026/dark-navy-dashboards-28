import React, { useState } from 'react';
import { SWAGRetirementIntake } from '@/components/retirement/SWAGRetirementIntake';
import { SWAGPhaseDashboard } from '@/components/retirement/SWAGPhaseDashboard';

export default function SWAGRetirementRoadmapPage() {
  const [showResults, setShowResults] = useState(false);

  if (showResults) {
    return <SWAGPhaseDashboard />;
  }

  return <SWAGRetirementIntake />;
}
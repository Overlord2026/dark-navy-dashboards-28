import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { RetirementConfidenceScorecard } from '@/components/scorecard/RetirementConfidenceScorecard';

export const ScorecardStartPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tool = searchParams.get('tool');
  const persona = searchParams.get('persona') || 'client-family';

  // For now, we only have the retirement confidence scorecard
  // This can be expanded for other scorecard types in the future
  if (tool === 'retirement-confidence') {
    return <RetirementConfidenceScorecard />;
  }

  // Default to retirement confidence scorecard
  return <RetirementConfidenceScorecard />;
};
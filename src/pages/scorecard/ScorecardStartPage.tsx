import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ScorecardPage } from './ScorecardPage';

export const ScorecardStartPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tool = searchParams.get('tool');
  const persona = searchParams.get('persona') || 'client-family';

  // For now, we only have the retirement confidence scorecard
  // This can be expanded for other scorecard types in the future
  if (tool === 'retirement-confidence') {
    return <ScorecardPage />;
  }

  // Default to retirement confidence scorecard
  return <ScorecardPage />;
};
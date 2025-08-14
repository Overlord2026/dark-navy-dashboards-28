import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getPersonaGroup } from './AudienceGuard';
import { SplitHeroLanding } from './SplitHeroLanding';

export const PersonaRedirect: React.FC = () => {
  const personaGroup = getPersonaGroup();
  
  // Check if persona is already set
  useEffect(() => {
    // Also check cookie as backup
    const cookiePersona = document.cookie
      .split('; ')
      .find(row => row.startsWith('persona_group='))
      ?.split('=')[1];
    
    if (cookiePersona && !localStorage.getItem('persona_group')) {
      localStorage.setItem('persona_group', cookiePersona);
    }
  }, []);

  // If persona is set, redirect to appropriate route
  if (personaGroup && personaGroup !== 'family') {
    return <Navigate to="/pros" replace />;
  } else if (personaGroup === 'family') {
    return <Navigate to="/families" replace />;
  }

  // If no persona, show split hero
  return <SplitHeroLanding />;
};
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { usePersonaContext } from '@/hooks/usePersonaContext';

interface PersonaPathCardProps {
  className?: string;
}

export const PersonaPathCard: React.FC<PersonaPathCardProps> = ({ 
  className = '' 
}) => {
  const navigate = useNavigate();
  const { selectedPersona, hasPersonaContext } = usePersonaContext();

  const handleClick = () => {
    if (hasPersonaContext()) {
      // Navigate to persona-specific dashboard
      const dashboardRoute = selectedPersona === 'family' ? '/client-portal' : '/advisor';
      navigate(dashboardRoute);
    } else {
      // Navigate to persona selection
      navigate('/marketplace');
    }
  };

  return (
    <div className={`bfo-card p-6 bg-gradient-to-br from-bfo-purple to-bfo-purple/90 text-bfo-gold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${className}`}>
      <Button 
        onClick={handleClick}
        className="bfo-cta w-full bg-bfo-gold text-bfo-navy hover:bg-bfo-gold/90 font-semibold"
      >
        {hasPersonaContext() ? 'Your Persona Dashboard' : 'Choose Your Persona Path'}
      </Button>
    </div>
  );
};
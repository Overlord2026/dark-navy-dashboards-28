
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import PersonaCard from '@/components/landing/PersonaCard';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <ThreeColumnLayout 
      title={null}
      hideRightSidebar
    >
      <div className="mx-auto my-8 grid grid-cols-1 sm:grid-cols-3 gap-6 px-8">
        <PersonaCard
          title="Aspiring Wealthy"
          subtitle="Growth-focused professionals"
          onClick={() => navigate('/dashboard?segment=aspiring')}
        />
        <PersonaCard
          title="Pre-Retirees & Retirees"
          subtitle="Planning your next chapter"
          onClick={() => navigate('/dashboard?segment=preretirees')}
        />
        <PersonaCard
          title="Ultra High Net Worth"
          subtitle="Bespoke solutions & concierge"
          onClick={() => navigate('/dashboard?segment=ultra')}
        />
      </div>
    </ThreeColumnLayout>
  );
}

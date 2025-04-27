
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import PersonaCard from '@/components/landing/PersonaCard';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <ThreeColumnLayout 
      hideLeftSidebar
      hideRightSidebar
    >
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold">
          Welcome to Boutique Family Office
        </h1>
        <p className="mt-4 text-muted-foreground">
          Choose your experience
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <PersonaCard
          title="Aspiring Wealthy"
          subtitle="Building and growing wealth for a prosperous future"
          onClick={() => navigate('/dashboard?segment=aspiring')}
        />
        <PersonaCard
          title="Pre-Retirees & Retirees"
          subtitle="Securing and optimizing retirement wealth"
          onClick={() => navigate('/dashboard?segment=preretirees')}
        />
        <PersonaCard
          title="Ultra High Net Worth"
          subtitle="Sophisticated wealth management & legacy planning"
          onClick={() => navigate('/dashboard?segment=ultra')}
        />
      </div>
    </ThreeColumnLayout>
  );
}

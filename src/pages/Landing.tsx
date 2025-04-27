
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
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-96px)] px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full mb-4">
          <PersonaCard
            title="Pre-Retirees & Retirees"
            subtitle="Securing and optimizing retirement wealth"
            imagePath="/lovable-uploads/1721322800607-8c38375eef04.png"
            onClick={() => navigate('/dashboard?segment=preretirees')}
          />
          <PersonaCard
            title="Aspiring Wealthy"
            subtitle="Building and growing wealth for a prosperous future"
            imagePath="/lovable-uploads/7faf1d1a-8aff-4541-8400-18aa687704e7.png"
            onClick={() => navigate('/dashboard?segment=aspiring')}
          />
        </div>
        
        <p className="text-xl text-gray-200 mt-4 text-center">
          Choose your experience
        </p>
      </div>
    </ThreeColumnLayout>
  );
}

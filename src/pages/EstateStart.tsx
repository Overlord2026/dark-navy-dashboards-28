import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EstateIntakeWizard } from '@/modules/estate/components/EstateIntakeWizard';

const EstateStart = () => {
  const navigate = useNavigate();

  const handleComplete = (data: any) => {
    console.log('Estate intake completed:', data);
    navigate('/estate');
  };

  const handleSaveAndContinue = (data: any) => {
    console.log('Saving progress:', data);
    // Save to localStorage or database
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <EstateIntakeWizard 
          onComplete={handleComplete}
          onSaveAndContinue={handleSaveAndContinue}
        />
      </div>
    </div>
  );
};

export default EstateStart;
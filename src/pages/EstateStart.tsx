import React from 'react';
import { EstateIntakeWizard } from '@/modules/estate/components/EstateIntakeWizard';

const EstateStart = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <EstateIntakeWizard />
      </div>
    </div>
  );
};

export default EstateStart;
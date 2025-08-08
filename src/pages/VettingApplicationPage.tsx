import React from 'react';
import { VettingApplicationForm } from '@/components/marketplace/VettingApplicationForm';

const VettingApplicationPage: React.FC = () => {
  const handleApplicationSubmit = (data: any) => {
    console.log('Application submitted:', data);
    // Handle successful submission (e.g., redirect to success page)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-background to-navy">
      <div className="container mx-auto px-4 py-8">
        <VettingApplicationForm onSubmit={handleApplicationSubmit} />
      </div>
    </div>
  );
};

export default VettingApplicationPage;
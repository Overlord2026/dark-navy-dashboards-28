import React from 'react';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { HealthcareQATestSuite } from '@/components/qa/HealthcareQATestSuite';

const HealthcareQAPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader 
        heading="Healthcare QA Test Suite" 
        text="Comprehensive testing of healthcare module navigation, branding, mobile responsiveness, accessibility, persona integration, and secure file operations"
      />
      
      <HealthcareQATestSuite />
    </div>
  );
};

export default HealthcareQAPage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AdvisorPromptProps {
  isMobile: boolean;
}

export const AdvisorPrompt: React.FC<AdvisorPromptProps> = ({ isMobile }) => {
  const navigate = useNavigate();

  return (
    <div className={`${isMobile ? 'mt-8' : 'mb-16'} text-center`}>
      <p className={`text-gray-${isMobile ? '400' : '300'} mb-2 text-sm`}>Are you a financial advisor?</p>
      <Button 
        variant="outline"
        className={`px-4 py-1.5 text-sm border-${isMobile ? '' : '2'} border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10`}
        onClick={() => navigate('/advisor/dashboard')} // Updated to go directly to dashboard
      >
        Access Advisor Portal
      </Button>
    </div>
  );
}


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
        className="bg-[#FFC700] text-[#0F1E3A] hover:bg-[#E0B000] font-medium"
        onClick={() => navigate('/advisor')}
      >
        Access Advisor Portal
      </Button>
    </div>
  );
}

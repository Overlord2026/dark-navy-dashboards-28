
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AdvisorPromptProps {
  isMobile: boolean;
}

export const AdvisorPrompt: React.FC<AdvisorPromptProps> = ({ isMobile }) => {
  const navigate = useNavigate();

  return (
    <Button 
      className="bg-[#FFC700] text-[#0F1E3A] hover:bg-[#E0B000] font-medium"
      onClick={() => navigate('/advisor')}
    >
      Access Advisor Portal
    </Button>
  );
}

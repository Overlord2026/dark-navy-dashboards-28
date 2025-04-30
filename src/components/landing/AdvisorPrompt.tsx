
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface AdvisorPromptProps {
  isMobile: boolean;
}

export const AdvisorPrompt: React.FC<AdvisorPromptProps> = ({ isMobile }) => {
  const navigate = useNavigate();

  return (
    <section className="my-12 bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Are you a Financial Advisor?</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
          Elevate your practice with our comprehensive advisor platform, designed to help you better serve high-net-worth clients
        </p>
        <Button 
          onClick={() => navigate('/advisor')} 
          size="lg"
          className="bg-[#FFC700] hover:bg-[#FFD700] text-black"
        >
          Access Advisor Platform
        </Button>
      </div>
    </section>
  );
};

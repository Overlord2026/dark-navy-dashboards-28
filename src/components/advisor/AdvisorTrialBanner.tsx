
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/context/SubscriptionContext";

export function AdvisorTrialBanner() {
  const navigate = useNavigate();
  const { startFreeTrial } = useSubscription();
  
  const handleStartTrial = () => {
    startFreeTrial();
    navigate('/advisor/dashboard');
  };
  
  const handleCreateProfile = () => {
    navigate('/advisor/profile');
  };
  
  return (
    <div className="w-full bg-[#0F1E3A] border border-[#FFC700]/30 py-8 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-[#FFC700] text-2xl font-semibold mb-4">
          Try your 90-Day Free Trial!
        </h2>
        <div className="flex flex-col items-center gap-3">
          <Button 
            onClick={handleStartTrial}
            className="bg-[#FFC700] text-white hover:bg-[#E0B000] font-medium px-8 py-6 text-lg"
          >
            Start Free Trial
          </Button>
          <button 
            onClick={handleCreateProfile}
            className="text-[#FFC700] underline hover:text-[#E0B000]"
          >
            Create Your Profile
          </button>
        </div>
      </div>
    </div>
  );
}

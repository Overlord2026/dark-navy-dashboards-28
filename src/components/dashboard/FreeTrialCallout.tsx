
import React from "react";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";

export const FreeTrialCallout: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const segment = queryParams.get('segment');
  
  const trialLink = `/signup?segment=${segment || "default"}`;
  
  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8 text-center border border-yellow-400">
      <h2 className="text-xl font-semibold mb-4">Try your 90-Day Free Trial!</h2>
      <div className="flex flex-col items-center gap-3">
        <Button
          asChild
          className="bg-black text-[#FFC107] hover:bg-black/90 border border-[#FFC107]"
        >
          <Link to={trialLink}>Start Free Trial</Link>
        </Button>
        
        <Link 
          to="/create-profile" 
          className="text-[#FFC107] font-medium text-sm uppercase tracking-wide hover:underline"
        >
          Create Your Profile
        </Link>
      </div>
    </div>
  );
};


import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

export function PremiumTierAdvisorBanner() {
  const navigate = useNavigate();
  
  return (
    <div className="mb-8 p-6 bg-[#0F0F2D] rounded-lg border border-purple-700">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            This feature is part of our <Badge className="ml-1 bg-purple-600">Premium Tier</Badge> suite
          </h2>
        </div>
        
        <p className="text-gray-400">
          Upgrade your advisor subscription to unlock:
        </p>
        
        <ul className="space-y-2 mb-2">
          <li className="flex items-start gap-2">
            <span className="text-purple-400 font-bold">•</span>
            <span>Advanced marketing funnels & CRM integrations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 font-bold">•</span>
            <span>Priority listing in our Marketplace</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 font-bold">•</span>
            <span>White-labeled practice management and analytics</span>
          </li>
        </ul>
        
        <div>
          <Button 
            variant="advisor" 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => navigate("/subscription")}
          >
            <Zap className="h-4 w-4 mr-2" />
            Upgrade now for $1,000/month
          </Button>
          <p className="text-sm text-gray-400 mt-2">
            Accelerate your practice growth and stand out to new prospects
          </p>
        </div>
      </div>
    </div>
  );
}


import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { AdvisorModules } from "@/components/advisor/AdvisorModules";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Zap } from "lucide-react";
import { FreeTierAdvisorBanner } from "@/components/advisor/FreeTierAdvisorBanner";

export default function AdvisorModuleMarketplace() {
  return (
    <ThreeColumnLayout activeMainItem="advisor" title="Module Marketplace">
      <div className="w-full max-w-6xl mx-auto p-4">
        <FreeTierAdvisorBanner />
        
        <div className="mb-8 p-6 bg-[#0F0F2D] rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Explore our suite of integrated tools to enhance your practice</h2>
          <p className="text-gray-400 mb-6">
            Pick and choose which best fits your business needs.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-[#1EAEDB] font-bold">•</span>
              <span><strong>Catchlight:</strong> Automated lead scoring</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1EAEDB] font-bold">•</span>
              <span><strong>Finneat:</strong> Intelligent allocations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1EAEDB] font-bold">•</span>
              <span><strong>eMoney:</strong> Advanced planning</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1EAEDB] font-bold">•</span>
              <span><strong>GHL:</strong> Digital marketing engine</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1EAEDB] font-bold">•</span>
              <span><strong>Tax analysis module:</strong> Comprehensive tax planning</span>
            </li>
          </ul>
          
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              View Pricing/Details
            </Button>
            <Button variant="advisor" className="gap-2">
              <Zap className="h-4 w-4" />
              Enable Modules
            </Button>
            <Button variant="ghost" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Ask a Question
            </Button>
          </div>
        </div>
        <AdvisorModules />
      </div>
    </ThreeColumnLayout>
  );
}

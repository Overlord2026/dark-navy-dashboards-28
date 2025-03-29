
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, BarChart, MessageSquare } from "lucide-react";
import { MarketingFunnelDialog } from "./MarketingFunnelDialog";

export function MarketingFunnelPrompt() {
  const [showDialog, setShowDialog] = useState(false);
  
  const handleOpenDialog = () => {
    setShowDialog(true);
  };
  
  const handleCloseDialog = () => {
    setShowDialog(false);
  };
  
  return (
    <div className="mb-8 p-6 bg-[#0F0F2D] rounded-lg border border-[#1EAEDB]/50">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-bold">
          Ready to supercharge your practice with our integrated marketing engine?
        </h2>
        
        <p className="text-gray-400">
          Set up your first funnel to attract and qualify new leads, automate follow-ups, and convert prospects into clients. 
          We'll guide you through each step.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="flex items-start gap-3">
            <div className="bg-[#1EAEDB]/20 p-2 rounded-full">
              <Mail className="h-5 w-5 text-[#1EAEDB]" />
            </div>
            <div>
              <h3 className="font-medium">Custom landing pages</h3>
              <p className="text-sm text-gray-400">Professionally designed lead capture</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-[#1EAEDB]/20 p-2 rounded-full">
              <MessageSquare className="h-5 w-5 text-[#1EAEDB]" />
            </div>
            <div>
              <h3 className="font-medium">Automated email/SMS campaigns</h3>
              <p className="text-sm text-gray-400">Nurture leads without manual work</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-[#1EAEDB]/20 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-[#1EAEDB]" />
            </div>
            <div>
              <h3 className="font-medium">Calendars for scheduling appointments</h3>
              <p className="text-sm text-gray-400">Let clients book time automatically</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-[#1EAEDB]/20 p-2 rounded-full">
              <BarChart className="h-5 w-5 text-[#1EAEDB]" />
            </div>
            <div>
              <h3 className="font-medium">Real-time lead scoring</h3>
              <p className="text-sm text-gray-400">Focus on your hottest prospects</p>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <Button 
            variant="advisor"
            className="w-full sm:w-auto"
            onClick={handleOpenDialog}
          >
            Get Started Now
          </Button>
        </div>
      </div>
      
      <MarketingFunnelDialog 
        isOpen={showDialog} 
        onClose={handleCloseDialog} 
      />
    </div>
  );
}

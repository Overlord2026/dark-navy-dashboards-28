
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { toast } from "sonner";

export function FreeTrialCallout() {
  const handleScheduleDemo = () => {
    window.open("https://calendly.com/tonygomes/60min", "_blank");
    toast.success("Opening scheduling page", {
      description: "Schedule a meeting to discuss our premium features with an advisor.",
    });
  };

  return <div className="mb-8 p-6 bg-[#162B4D] border border-[#2A3E5C] rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-[#FFC700]">BFO Premium Access</h2>
          <p className="text-white mb-4 md:mb-0 max-w-lg">Upgrade to get advanced features</p>
        </div>
        <div className="flex gap-4">
          <Button className="bg-[#FFC700] text-[#0F1E3A] hover:bg-[#E0B000] font-medium">
            Upgrade Now
          </Button>
          <Button 
            variant="outline" 
            className="border-[#FFC700] text-[#FFC700] hover:bg-[#FFC700]/10"
            onClick={handleScheduleDemo}
          >
            <CalendarClock className="mr-2 h-4 w-4" />
            Schedule Demo
          </Button>
        </div>
      </div>
    </div>;
}

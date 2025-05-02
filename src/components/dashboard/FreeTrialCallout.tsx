
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarClock, Diamond } from "lucide-react";

export function FreeTrialCallout() {
  return (
    <div className="mb-8 p-6 bg-[#162B4D] border border-[#2A3E5C] rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-[#FFC700]">BFO PREMIUM</h2>
          <p className="text-white mb-4 md:mb-0 max-w-lg">
            Access premium wealth management features, personalized planning tools, and enhanced analytics.
          </p>
        </div>
        <div className="flex gap-4">
          <Button className="bg-[#FFC700] text-[#0F1E3A] hover:bg-[#E0B000] font-medium">
            Explore Premium
          </Button>
          <Button variant="outline" className="border-[#FFC700] text-[#FFC700] hover:bg-[#FFC700]/10">
            <Diamond className="mr-2 h-4 w-4" />
            View Benefits
          </Button>
        </div>
      </div>
    </div>
  );
}

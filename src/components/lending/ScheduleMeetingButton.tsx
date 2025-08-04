
import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CalendlyReplacementNotice } from "@/components/scheduling/CalendlyReplacementNotice";

interface ScheduleMeetingButtonProps {
  offeringName: string;
}

export const ScheduleMeetingButton: React.FC<ScheduleMeetingButtonProps> = ({ offeringName }) => {
  const [showScheduling, setShowScheduling] = useState(false);

  const handleScheduleMeeting = () => {
    // Platform Minimization: Use BFO Scheduling by default, fallback to Calendly
    setShowScheduling(true);
    
    toast.success("Opening BFO Scheduling", {
      description: `Schedule a meeting to discuss ${offeringName} with your advisor using our integrated platform.`,
      duration: 3000,
    });
  };

  const handleCalendlyFallback = () => {
    window.open("https://calendly.com/tonygomes/talk-with-tony", "_blank");
    setShowScheduling(false);
  };
  
  if (showScheduling) {
    return (
      <CalendlyReplacementNotice
        onUseBFOScheduling={() => {
          // In a real implementation, this would open the BFO scheduling widget
          toast.success("BFO Scheduling launched!", {
            description: "This would open the integrated BFO scheduling widget.",
          });
          setShowScheduling(false);
        }}
        onContinueWithCalendly={handleCalendlyFallback}
        showCalendlyOption={true}
      />
    );
  }

  return (
    <Button onClick={handleScheduleMeeting}>
      <Calendar className="mr-2 h-4 w-4" /> Schedule Appointment
    </Button>
  );
};

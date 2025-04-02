
import React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toast } from "sonner";

interface ScheduleMeetingButtonProps {
  offeringName: string;
}

export const ScheduleMeetingButton: React.FC<ScheduleMeetingButtonProps> = ({ offeringName }) => {
  const handleScheduleMeeting = () => {
    // Open Calendly or other scheduling tool
    window.open("https://calendly.com/tombrady/60min", "_blank");
    
    toast.success("Opening scheduling page", {
      description: `Schedule a meeting to discuss ${offeringName} with your advisor.`,
      duration: 3000,
    });
  };
  
  return (
    <Button onClick={handleScheduleMeeting}>
      <Calendar className="mr-2 h-4 w-4" /> Schedule Consultation
    </Button>
  );
};

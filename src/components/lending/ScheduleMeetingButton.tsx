
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

interface ScheduleMeetingButtonProps {
  offeringName: string;
}

export const ScheduleMeetingButton: React.FC<ScheduleMeetingButtonProps> = ({ offeringName }) => {
  const handleScheduleMeeting = () => {
    // Open the new Calendly link directly
    window.open("https://calendly.com/tonygomes/60min", "_blank");
    
    toast.success("Opening scheduling page", {
      description: `Schedule a meeting regarding ${offeringName}.`,
      duration: 3000,
    });
  };
  
  return (
    <Button 
      variant="outline" 
      className="w-full" 
      onClick={handleScheduleMeeting}
    >
      <Calendar className="h-4 w-4 mr-2" /> 
      Schedule a Meeting
    </Button>
  );
};

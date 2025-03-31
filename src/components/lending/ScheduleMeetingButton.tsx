
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

interface ScheduleMeetingButtonProps {
  offeringName: string;
}

export const ScheduleMeetingButton: React.FC<ScheduleMeetingButtonProps> = ({ offeringName }) => {
  const handleScheduleMeeting = () => {
    // In a real application, this would open a calendar scheduling interface or send a notification to the advisor
    toast.success("Meeting request sent!", {
      description: `Your advisor has been notified about your interest in scheduling a meeting regarding ${offeringName}.`,
      duration: 5000,
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

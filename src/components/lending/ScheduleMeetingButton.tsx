
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScheduleMeetingButtonProps {
  offeringName: string;
}

export const ScheduleMeetingButton: React.FC<ScheduleMeetingButtonProps> = ({ offeringName }) => {
  const { toast } = useToast();
  
  const handleScheduleMeeting = () => {
    toast({
      title: "Scheduling meeting",
      description: `Your advisor will contact you about ${offeringName}.`,
    });
  };
  
  return (
    <Button 
      onClick={handleScheduleMeeting} 
      className="flex items-center gap-2"
    >
      <Calendar className="h-4 w-4" />
      Schedule Consultation
    </Button>
  );
};

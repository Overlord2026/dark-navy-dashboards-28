
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

interface ScheduleMeetingDialogProps {
  assetName: string;
  className?: string;
}

export function ScheduleMeetingDialog({ assetName, className = "" }: ScheduleMeetingDialogProps) {
  const handleScheduleMeeting = () => {
    // Open Calendly with Tony Gomes's link
    window.open("https://calendly.com/tonygomes/60min?month=2025-06", "_blank");
    
    toast.success("Opening scheduling page", {
      description: `Schedule a meeting to discuss ${assetName} with your advisor.`,
      duration: 3000,
    });
  };

  return (
    <Button 
      onClick={handleScheduleMeeting}
      className={`w-full bg-[#1B1B32] text-white hover:bg-[#2D2D4A] ${className}`}
    >
      <Calendar className="mr-2 h-4 w-4" />
      Schedule Meeting
    </Button>
  );
}

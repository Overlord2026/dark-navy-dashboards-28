
import React from "react";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ScheduleMeetingDialogProps {
  assetName?: string;
  variant?: "default" | "outline" | "marketplace";
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const ScheduleMeetingDialog = ({ 
  assetName = "this offering", 
  variant = "marketplace", 
  className = "",
  onClick
}: ScheduleMeetingDialogProps) => {
  const handleScheduleAppointment = (e: React.MouseEvent) => {
    if (onClick) onClick(e);
    window.open("https://calendly.com/tonygomes/60min", "_blank");
    toast.success("Opening scheduling page", {
      description: `Schedule a meeting to discuss ${assetName} with your advisor.`,
    });
  };

  return (
    <Button 
      variant={variant === "marketplace" ? "marketplace" : variant} 
      className={`flex items-center justify-center w-full font-medium shadow-sm ${className}`}
      onClick={handleScheduleAppointment}
    >
      <CalendarClock className="mr-2 h-4 w-4" />
      Schedule Meeting
    </Button>
  );
};

export default ScheduleMeetingDialog;


import React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ScheduleMeetingDialogProps {
  assetName?: string;
  variant?: "default" | "outline";
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const ScheduleMeetingDialog = ({ 
  assetName = "this offering", 
  variant = "default", 
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
      variant={variant} 
      className={`${className} ${variant === "default" ? "bg-blue-600 hover:bg-blue-700 w-1/2" : "border-gray-700 text-white hover:bg-[#1c2e4a] w-1/2"}`}
      onClick={handleScheduleAppointment}
    >
      <Calendar className="mr-2 h-4 w-4" />
      Schedule Meeting
    </Button>
  );
};

export default ScheduleMeetingDialog;

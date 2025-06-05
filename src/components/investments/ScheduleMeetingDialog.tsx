
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useTaxPlanning } from "@/hooks/useTaxPlanning";

interface ScheduleMeetingDialogProps {
  assetName: string;
  className?: string;
}

export function ScheduleMeetingDialog({ assetName, className = "" }: ScheduleMeetingDialogProps) {
  const { scheduleMeeting } = useTaxPlanning();

  const handleScheduleMeeting = () => {
    scheduleMeeting(assetName);
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

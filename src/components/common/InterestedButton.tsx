
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface InterestedButtonProps {
  assetName?: string;
  variant?: "default" | "outline" | "secondary";
  className?: string;
  onInterest?: () => void;
}

export const InterestedButton = ({ 
  assetName = "this offering", 
  variant = "outline", 
  className = "",
  onInterest
}: InterestedButtonProps) => {
  const handleInterested = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    toast.success("Your interest has been registered!", {
      description: "Your advisor has been notified about your interest",
      duration: 5000,
    });
    
    if (onInterest) {
      onInterest();
    }
  };

  return (
    <Button 
      variant={variant} 
      className={`${className}`}
      onClick={handleInterested}
    >
      I'm Interested
    </Button>
  );
};

export default InterestedButton;

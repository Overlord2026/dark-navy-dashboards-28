
import React from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";
import { toast } from "sonner";

interface InterestedButtonProps {
  assetName: string;
}

export const InterestedButton: React.FC<InterestedButtonProps> = ({ assetName }) => {
  const handleInterested = () => {
    // In a real application, this would send a notification to the advisor and CFO
    toast.success("Your interest has been registered!", {
      description: `Your advisor and CFO have been notified about your interest in ${assetName}.`,
      duration: 5000,
    });
  };
  
  return (
    <Button 
      variant="interested" 
      className="w-full" 
      onClick={handleInterested}
    >
      <HeartIcon className="h-4 w-4 mr-1" /> 
      I'm Interested
    </Button>
  );
};

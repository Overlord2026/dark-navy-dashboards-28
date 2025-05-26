
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface InterestedButtonProps {
  assetName: string;
  onInterested?: () => void;
}

export const InterestedButton: React.FC<InterestedButtonProps> = ({ assetName, onInterested }) => {
  const [isInterested, setIsInterested] = React.useState(false);
  
  const handleInterested = () => {
    setIsInterested(true);
    
    toast.success(`You've expressed interest in ${assetName}`, {
      description: "Your advisor will be notified about your interest.",
    });
    
    if (onInterested) {
      onInterested();
    }
  };
  
  return (
    <Button 
      variant={isInterested ? "success" : "interested"} 
      disabled={isInterested}
      onClick={handleInterested}
    >
      {isInterested ? "Interest Recorded" : "I am interested"}
    </Button>
  );
};

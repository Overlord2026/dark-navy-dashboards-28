import React from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
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
      variant={isInterested ? "default" : "outline"} 
      size="icon"
      disabled={isInterested}
      onClick={handleInterested}
      className={isInterested ? "bg-red-500 hover:bg-red-600 border-red-500" : ""}
    >
      <Heart className={`h-4 w-4 ${isInterested ? "fill-white" : ""}`} />
    </Button>
  );
};

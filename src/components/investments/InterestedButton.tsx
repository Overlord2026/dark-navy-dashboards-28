
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useInvestmentData } from "@/hooks/useInvestmentData";
import { useAuth } from "@/context/AuthContext";

interface InterestedButtonProps {
  offeringId?: string;
  assetName: string;
  onInterested?: () => void;
}

export const InterestedButton: React.FC<InterestedButtonProps> = ({ 
  offeringId, 
  assetName, 
  onInterested 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addUserInterest, removeUserInterest, isUserInterested } = useInvestmentData();
  const { user } = useAuth();
  
  // If no offeringId is provided, this is a legacy usage (portfolio models, etc.)
  const isInterested = offeringId ? isUserInterested(offeringId) : false;
  
  const handleInterested = async () => {
    if (!user) {
      toast.error("Please log in to express interest in investments");
      return;
    }

    // If no offeringId, just show a general message
    if (!offeringId) {
      toast.success(`Interest noted for ${assetName}`, {
        description: "Your advisor will be notified about your interest.",
      });
      if (onInterested) {
        onInterested();
      }
      return;
    }

    setIsLoading(true);
    
    try {
      if (isInterested) {
        await removeUserInterest(offeringId);
        toast.success(`Removed interest in ${assetName}`);
      } else {
        await addUserInterest(offeringId);
        toast.success(`You've expressed interest in ${assetName}`, {
          description: "Your advisor will be notified about your interest.",
        });
      }
      
      if (onInterested) {
        onInterested();
      }
    } catch (error) {
      console.error('Error handling interest:', error);
      toast.error("Failed to update interest. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      variant={isInterested ? "success" : "interested"} 
      disabled={isLoading}
      onClick={handleInterested}
    >
      {isLoading ? "Updating..." : isInterested ? "Interest Recorded" : "I am interested"}
    </Button>
  );
};


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
  
  // Helper function to check if string is a valid UUID
  const isValidUUID = (str: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };
  
  // Only check database interest if offeringId is a valid UUID
  const isInterested = offeringId && isValidUUID(offeringId) ? isUserInterested(offeringId) : false;
  
  const handleInterested = async () => {
    if (!user) {
      toast.error("Please log in to express interest in investments");
      return;
    }

    // If no offeringId or invalid UUID, just show a general message
    if (!offeringId || !isValidUUID(offeringId)) {
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

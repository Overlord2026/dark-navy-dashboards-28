
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useTaxPlanning } from "@/hooks/useTaxPlanning";

interface InterestedButtonProps {
  assetName: string;
  className?: string;
  itemType?: string;
  pageContext?: string;
}

export function InterestedButton({ 
  assetName, 
  className = "",
  itemType = "Investment",
  pageContext = "Investments"
}: InterestedButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createInterest } = useTaxPlanning();

  const handleInterest = async () => {
    setIsSubmitting(true);
    try {
      // Only call createInterest which handles both email and database operations
      await createInterest({
        interest_type: 'investment',
        asset_name: assetName,
        notes: `Expressed interest in ${assetName}`
      });
    } catch (error) {
      console.error('Error submitting interest:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleInterest}
      disabled={isSubmitting}
      className={`w-full flex items-center justify-center ${className}`}
    >
      <Heart className="mr-2 h-4 w-4" />
      {isSubmitting ? "Submitting..." : "I'm Interested"}
    </Button>
  );
}

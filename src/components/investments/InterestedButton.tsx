
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useTaxPlanning } from "@/hooks/useTaxPlanning";
import { useAnalyticsTracking } from "@/hooks/useAnalytics";

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
  const { trackFeatureUsage, trackConversion } = useAnalyticsTracking();

  const handleInterest = async () => {
    setIsSubmitting(true);
    
    // Track interest expression start
    trackFeatureUsage('interest_expressed', {
      asset_name: assetName,
      item_type: itemType,
      page_context: pageContext
    });
    
    try {
      // Only call createInterest which handles the email sending
      await createInterest({
        interest_type: 'investment',
        asset_name: assetName,
        notes: `Expressed interest in ${assetName}`
      });
      
      // Track successful interest submission
      trackConversion('interest_submission', {
        asset_name: assetName,
        item_type: itemType,
        page_context: pageContext
      });
    } catch (error) {
      console.error('Error submitting interest:', error);
      
      // Track failed interest submission
      trackFeatureUsage('interest_submission_failed', {
        asset_name: assetName,
        item_type: itemType,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
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

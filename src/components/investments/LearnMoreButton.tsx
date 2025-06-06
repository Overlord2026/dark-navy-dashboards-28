
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useLearnMoreNotification } from "@/hooks/useLearnMoreNotification";

interface LearnMoreButtonProps {
  assetName: string;
  className?: string;
  itemType?: string;
  pageContext?: string;
}

export function LearnMoreButton({ 
  assetName, 
  className = "",
  itemType = "Investment",
  pageContext = "Investments"
}: LearnMoreButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendLearnMoreEmail } = useLearnMoreNotification();

  const handleLearnMore = async () => {
    setIsSubmitting(true);
    try {
      await sendLearnMoreEmail(assetName, itemType, pageContext);
    } catch (error) {
      console.error('Error submitting learn more request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleLearnMore}
      disabled={isSubmitting}
      className={`w-full flex items-center justify-center ${className}`}
    >
      <BookOpen className="mr-2 h-4 w-4" />
      {isSubmitting ? "Sending..." : "Learn More"}
    </Button>
  );
}


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { LearnMoreDialog } from "@/components/ui/learn-more-dialog";
import { useLearnMoreNotification } from "@/hooks/useLearnMoreNotification";

interface LearnMoreButtonProps {
  assetName: string;
  className?: string;
  itemType?: string;
  pageContext?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export function LearnMoreButton({ 
  assetName, 
  className = "",
  itemType = "Investment",
  pageContext = "Investments",
  variant = "outline",
  size = "default"
}: LearnMoreButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendLearnMoreEmail } = useLearnMoreNotification();

  const handleConfirm = async () => {
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
    <>
      <Button 
        variant={variant}
        size={size}
        onClick={() => setIsDialogOpen(true)}
        disabled={isSubmitting}
        className={`flex items-center justify-center ${className}`}
      >
        <BookOpen className="mr-2 h-4 w-4" />
        Learn More
      </Button>

      <LearnMoreDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        itemName={assetName}
        onConfirm={handleConfirm}
      />
    </>
  );
}

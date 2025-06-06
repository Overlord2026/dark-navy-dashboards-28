
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { LearnMoreDialog } from "@/components/ui/learn-more-dialog";
import { useLearnMoreNotification } from "@/hooks/useLearnMoreNotification";

interface RequestAssistanceButtonProps {
  itemName: string;
  className?: string;
  itemType?: string;
  pageContext?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
}

export function RequestAssistanceButton({ 
  itemName, 
  className = "",
  itemType = "Service",
  pageContext = "Page",
  variant = "outline"
}: RequestAssistanceButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendLearnMoreEmail } = useLearnMoreNotification();

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await sendLearnMoreEmail(itemName, itemType, pageContext, 'request_assistance');
    } catch (error) {
      console.error('Error submitting assistance request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button 
        variant={variant}
        onClick={() => setIsDialogOpen(true)}
        disabled={isSubmitting}
        className={`flex items-center justify-center ${className}`}
      >
        <HelpCircle className="mr-2 h-4 w-4" />
        Request Assistance
      </Button>

      <LearnMoreDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        itemName={itemName}
        onConfirm={handleConfirm}
        actionType="request_assistance"
      />
    </>
  );
}

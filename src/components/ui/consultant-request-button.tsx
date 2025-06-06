
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { LearnMoreDialog } from "@/components/ui/learn-more-dialog";
import { useLearnMoreNotification } from "@/hooks/useLearnMoreNotification";

interface ConsultantRequestButtonProps {
  itemName: string;
  className?: string;
  itemType?: string;
  pageContext?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
}

export function ConsultantRequestButton({ 
  itemName, 
  className = "",
  itemType = "Service",
  pageContext = "Page",
  variant = "outline"
}: ConsultantRequestButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendLearnMoreEmail } = useLearnMoreNotification();

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await sendLearnMoreEmail(itemName, itemType, pageContext, 'consultant_request');
    } catch (error) {
      console.error('Error submitting consultant request:', error);
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
        <Users className="mr-2 h-4 w-4" />
        Request Consultant
      </Button>

      <LearnMoreDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        itemName={itemName}
        onConfirm={handleConfirm}
        actionType="consultant_request"
      />
    </>
  );
}
